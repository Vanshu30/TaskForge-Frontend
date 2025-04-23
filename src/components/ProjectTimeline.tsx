
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format, isAfter, isBefore, isToday, parseISO } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  assignee: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

interface ProjectTimelineProps {
  tasks: Task[];
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ tasks }) => {
  // Sort tasks by due date (ascending)
  const sortedTasks = [...tasks].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  // Group tasks by month/year for display
  const groupedTasks: Record<string, Task[]> = {};
  
  sortedTasks.forEach(task => {
    const date = parseISO(task.dueDate);
    const monthYear = format(date, 'MMMM yyyy');
    
    if (!groupedTasks[monthYear]) {
      groupedTasks[monthYear] = [];
    }
    
    groupedTasks[monthYear].push(task);
  });

  // Function to get status based on due date
  const getTaskStatus = (dueDate: string) => {
    const date = parseISO(dueDate);
    const today = new Date();
    
    if (isAfter(date, today)) return 'upcoming';
    if (isToday(date)) return 'today';
    if (isBefore(date, today)) return 'overdue';
    return 'upcoming';
  };

  // Status colors for visual indication
  const statusColors = {
    upcoming: 'bg-blue-100 border-blue-200 text-blue-800',
    today: 'bg-yellow-100 border-yellow-200 text-yellow-800',
    overdue: 'bg-red-100 border-red-200 text-red-800',
    completed: 'bg-green-100 border-green-200 text-green-800'
  };

  // Priority badge colors
  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Project Timeline</h2>
      
      {Object.keys(groupedTasks).length > 0 ? (
        <div className="relative space-y-8 before:absolute before:inset-0 before:left-4 md:before:left-[calc(50%-1px)] before:h-full before:w-0.5 before:bg-muted-foreground/20">
          {Object.entries(groupedTasks).map(([monthYear, tasks], groupIndex) => (
            <div key={monthYear} className="space-y-4">
              <div className={`flex items-center ${groupIndex % 2 === 0 ? 'justify-start md:justify-end' : 'justify-start'} relative`}>
                <div className="md:w-1/2 md:pr-8 md:pl-0 pl-12 flex items-center">
                  <div className="absolute left-0 md:left-[calc(50%-20px)] w-10 h-10 rounded-full bg-primary/10 border-4 border-muted flex items-center justify-center">
                    <span className="text-xs font-bold">{tasks.length}</span>
                  </div>
                  <h3 className={`text-xl font-semibold ${groupIndex % 2 === 0 ? 'md:text-right' : ''}`}>
                    {monthYear}
                  </h3>
                </div>
              </div>
              
              {tasks.map((task, taskIndex) => (
                <div 
                  key={task.id}
                  className={`flex ${taskIndex % 2 === 0 ? 'justify-start md:justify-end' : 'justify-start'} relative`}
                >
                  <div className="absolute left-4 md:left-[calc(50%-4px)] w-2 h-2 rounded-full bg-primary mt-6"></div>
                  <Card 
                    className={`md:w-5/12 w-[calc(100%-32px)] ml-8 md:ml-0 ${taskIndex % 2 === 0 ? 'md:mr-8' : 'md:ml-8'} ${statusColors[getTaskStatus(task.dueDate)]}`}
                  >
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{task.title}</h4>
                        <Badge className={priorityColors[task.priority]}>
                          {task.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-sm">{task.description}</p>
                      
                      <div className="flex justify-between items-center text-xs pt-2 border-t border-muted-foreground/20">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback className="text-[10px]">
                              {task.assignee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>{task.assignee.name}</span>
                        </div>
                        <span>{format(parseISO(task.dueDate), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No tasks found. Add tasks to see the timeline.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectTimeline;
