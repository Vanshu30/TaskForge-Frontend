import { toast } from '@/hooks/use-toast';
import { getTasks, updateTask } from '@/service/taskService';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  type?: string;
  status?: string;
  assignee: {
    name: string;
    avatar?: string;
  };
  comments: any[];
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface Columns {
  [key: string]: Column;
}

interface Tasks {
  [key: string]: Task;
}

interface KanbanBoardProps {
  projectId: string;
  onTaskDelete: (taskId: string) => void;
}

const KanbanBoard = ({ projectId, onTaskDelete }: KanbanBoardProps) => {
  const [columns, setColumns] = useState<Columns>({
    todo: { id: 'todo', title: 'To Do', taskIds: [] },
    'in-progress': { id: 'in-progress', title: 'In Progress', taskIds: [] },
    review: { id: 'review', title: 'Review', taskIds: [] },
    done: { id: 'done', title: 'Done', taskIds: [] },
  });

  const [tasks, setTasks] = useState<Tasks>({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) return;
      try {
        const data = await getTasks(token, projectId);
        const loadedTasks: Tasks = {};
        const updatedColumns: Columns = { ...columns };

        Object.values(updatedColumns).forEach(col => col.taskIds = []);

        data.forEach((task: Task) => {
          loadedTasks[task.id] = task;
          const col = updatedColumns[task.status || 'todo'];
          if (col) col.taskIds.push(task.id);
        });

        setTasks(loadedTasks);
        setColumns(updatedColumns);
      } catch (err) {
        toast({ title: "Error loading tasks", description: String(err), variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [projectId]);

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = { ...start, taskIds: newTaskIds };

      setColumns({ ...columns, [newColumn.id]: newColumn });
    } else {
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStart = { ...start, taskIds: startTaskIds };

      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish = { ...finish, taskIds: finishTaskIds };

      setColumns({ ...columns, [newStart.id]: newStart, [newFinish.id]: newFinish });

      const task = tasks[draggableId];
      const updatedTask = { ...task, status: finish.id };
      setTasks({ ...tasks, [draggableId]: updatedTask });
      try {
        await updateTask(draggableId, { status: finish.id }, token!);
      } catch (err) {
        toast({ title: "Failed to update task", description: String(err), variant: "destructive" });
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 min-w-[1000px] p-4">
          {Object.values(columns).map((column) => (
            <Droppable droppableId={column.id} key={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white dark:bg-zinc-800 rounded-2xl p-4 w-72 flex-shrink-0 shadow-md"
                >
                  <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
                    {column.title}
                  </h3>
                  <div className="space-y-4">
                    {column.taskIds.map((taskId, index) => (
                      <Draggable draggableId={taskId} index={index} key={taskId}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard 
                              task={tasks[taskId]} 
                              onDelete={onTaskDelete} 
                              onClick={() => {
                                // Handle task click - you can implement task details view here
                                console.log(`Task clicked: ${tasks[taskId].title}`);
                                // You might want to navigate to a task details page or open a modal
                              }} 
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;