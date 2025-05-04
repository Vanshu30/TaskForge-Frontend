import axios from "axios";
import { addDays, isBefore, parseISO } from "date-fns";
import { BarChart2, CalendarClock, PlusSquare, RefreshCcw } from "lucide-react";
import React, { useEffect, useState } from "react";

const StatsPanel: React.FC = () => {
  const [stats, setStats] = useState({
    completed: 0,
    updated: 0,
    created: 0,
    dueSoon: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const tasksRes = await axios.get("/api/tasks");
        const tasks = tasksRes.data;

        const now = new Date();
        const sevenDaysAgo = addDays(now, -7);

        let completed = 0;
        let updated = 0;
        let created = 0;
        let dueSoon = 0;

        tasks.forEach((task: any) => {
          const createdAt = parseISO(task.createdAt);
          const updatedAt = parseISO(task.updatedAt);
          const dueDate = task.dueDate ? parseISO(task.dueDate) : null;

          if (task.status === "COMPLETED" && isBefore(createdAt, now) && isBefore(sevenDaysAgo, createdAt)) {
            completed++;
          }

          if (updatedAt && isBefore(updatedAt, now) && isBefore(sevenDaysAgo, updatedAt)) {
            updated++;
          }

          if (createdAt && isBefore(createdAt, now) && isBefore(sevenDaysAgo, createdAt)) {
            created++;
          }

          if (dueDate && isBefore(dueDate, addDays(now, 7))) {
            dueSoon++;
          }
        });

        setStats({ completed, updated, created, dueSoon });
      } catch (err) {
        console.error("Failed to load task stats", err);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    { icon: BarChart2, label: "Completed", value: stats.completed },
    { icon: RefreshCcw, label: "Updated", value: stats.updated },
    { icon: PlusSquare, label: "Created", value: stats.created },
    { icon: CalendarClock, label: "Due Soon", value: stats.dueSoon },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center justify-center p-4 bg-white border border-border rounded-xl shadow-sm dark:bg-gray-800"
        >
          <item.icon className="text-primary mb-2" size={28} />
          <div className="text-2xl font-bold">{item.value}</div>
          <div className="text-sm text-muted-foreground">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsPanel;
