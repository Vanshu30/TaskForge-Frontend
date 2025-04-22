import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Tag, 
  User,
  MessageSquare,
  PlusCircle,
  ChevronRight,
  Users
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AddTaskDialog from './AddTaskDialog';

// Mock data until Supabase integration
const initialColumns = {
  'todo': {
    id: 'todo',
    title: 'To Do',
    taskIds: ['task-4', 'task-5'],
  },
  'in-progress': {
    id: 'in-progress',
    title: 'In Progress',
    taskIds: ['task-6'],
  },
  'review': {
    id: 'review',
    title: 'Review',
    taskIds: ['task-7'],
  },
  'done': {
    id: 'done',
    title: 'Done',
    taskIds: ['task-8', 'task-9'],
  },
};

const initialTasks = {
  'task-1': {
    id: 'task-1',
    title: 'Research competitors',
    description: 'Analyze top 5 competitors and identify opportunities',
    priority: 'medium',
    dueDate: '2025-04-30',
    assignee: {
      id: 'user-1',
      name: 'Alex Johnson',
      avatar: null,
    },
    comments: [
      { id: 'comment-1', user: 'Jane Smith', text: 'Should we include international competitors?', timestamp: '2025-04-18T09:30:00Z' }
    ]
  },
  'task-2': {
    id: 'task-2',
    title: 'Create wireframes',
    description: 'Design wireframes for homepage and product pages',
    priority: 'high',
    dueDate: '2025-05-05',
    assignee: {
      id: 'user-2',
      name: 'Maria Garcia',
      avatar: null,
    },
    comments: []
  },
  'task-3': {
    id: 'task-3',
    title: 'Define brand guidelines',
    description: 'Update brand style guide with new colors and typography',
    priority: 'low',
    dueDate: '2025-05-10',
    assignee: {
      id: 'user-3',
      name: 'David Kim',
      avatar: null,
    },
    comments: []
  },
  'task-4': {
    id: 'task-4',
    title: 'Customer interviews',
    description: 'Conduct interviews with 10 key customers',
    priority: 'high',
    dueDate: '2025-04-25',
    assignee: {
      id: 'user-4',
      name: 'Sarah Wilson',
      avatar: null,
    },
    comments: []
  },
  'task-5': {
    id: 'task-5',
    title: 'User journey mapping',
    description: 'Create user journey maps for primary personas',
    priority: 'medium',
    dueDate: '2025-05-01',
    assignee: {
      id: 'user-2',
      name: 'Maria Garcia',
      avatar: null,
    },
    comments: []
  },
  'task-6': {
    id: 'task-6',
    title: 'Content inventory',
    description: 'Catalog existing content and identify gaps',
    priority: 'medium',
    dueDate: '2025-04-29',
    assignee: {
      id: 'user-1',
      name: 'Alex Johnson',
      avatar: null,
    },
    comments: []
  },
  'task-7': {
    id: 'task-7',
    title: 'SEO strategy',
    description: 'Develop keyword strategy and optimization plan',
    priority: 'high',
    dueDate: '2025-05-08',
    assignee: {
      id: 'user-3',
      name: 'David Kim',
      avatar: null,
    },
    comments: []
  },
  'task-8': {
    id: 'task-8',
    title: 'Competitive analysis report',
    description: 'Finalize competitor analysis report with recommendations',
    priority: 'medium',
    dueDate: '2025-04-15',
    assignee: {
      id: 'user-4',
      name: 'Sarah Wilson',
      avatar: null,
    },
    comments: []
  },
  'task-9': {
    id: 'task-9',
    title: 'Stakeholder presentation',
    description: 'Prepare initial findings for leadership team',
    priority: 'high',
    dueDate: '2025-04-20',
    assignee: {
      id: 'user-1',
      name: 'Alex Johnson',
      avatar: null,
    },
    comments: []
  },
};

const getPriorityBadge = (priority) => {
  switch (priority) {
    case 'high':
      return <Badge className="bg-red-500">High</Badge>;
    case 'medium':
      return <Badge className="bg-yellow-500">Medium</Badge>;
    case 'low':
      return <Badge className="bg-green-500">Low</Badge>;
    default:
      return null;
  }
};

const KanbanBoard = ({ projectId }) => {
  const [columns, setColumns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Prevent moving tasks backwards logic
    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];
    
    // Get column order to determine if this is a backwards move
    const columnOrder = ['todo', 'in-progress', 'review', 'done'];
    const sourceIndex = columnOrder.indexOf(sourceColumn.id);
    const destIndex = columnOrder.indexOf(destinationColumn.id);
    
    // If we're trying to move backwards (to a column with a lower index)
    if (destIndex < sourceIndex) {
      toast({
        title: "Cannot move task backwards",
        description: "Once a task moves forward in the workflow, it cannot move back.",
        variant: "destructive",
      });
      return;
    }

    const sourceTaskIds = Array.from(sourceColumn.taskIds);
    sourceTaskIds.splice(source.index, 1);
    
    const destinationTaskIds = Array.from(destinationColumn.taskIds);
    destinationTaskIds.splice(destination.index, 0, draggableId);

    const newColumns = {
      ...columns,
      [sourceColumn.id]: {
        ...sourceColumn,
        taskIds: sourceTaskIds,
      },
      [destinationColumn.id]: {
        ...destinationColumn,
        taskIds: destinationTaskIds,
      },
    };

    setColumns(newColumns);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kanban Board</h2>
        <div className="flex gap-2">
          <Button onClick={() => window.location.href = `/projects/${projectId}/settings#team`}>
            <Users className="mr-2 h-4 w-4" />
            Team
          </Button>
          <AddTaskDialog projectId={projectId} onAddTask={(task) => {
            // Add task to todo column by default
            const newTasks = { ...tasks, [task.id]: task };
            const newColumns = {
              ...columns,
              todo: {
                ...columns.todo,
                taskIds: [...columns.todo.taskIds, task.id],
              },
            };
            setTasks(newTasks);
            setColumns(newColumns);
          }} />
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 overflow-x-auto">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="min-w-[280px]">
              <div className="bg-muted rounded-t-md p-3 border-x border-t border-border">
                <h3 className="font-medium flex items-center">
                  {column.title}
                  <Badge variant="outline" className="ml-2">
                    {column.taskIds.length}
                  </Badge>
                </h3>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-muted/50 rounded-b-md p-2 min-h-[500px] border border-border"
                  >
                    {column.taskIds.map((taskId, index) => {
                      const task = tasks[taskId];
                      return (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-3 bg-white"
                            >
                              <CardHeader className="p-3 pb-0">
                                <div className="flex justify-between items-start">
                                  <Badge variant="outline" className="mb-1">
                                    {task.id.replace('task-', 'TASK-')}
                                  </Badge>
                                  {getPriorityBadge(task.priority)}
                                </div>
                                <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                                <CardDescription className="text-xs line-clamp-2">
                                  {task.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="p-3 pt-0">
                                <div className="flex items-center text-xs text-muted-foreground mt-2">
                                  <CalendarIcon className="mr-1 h-3 w-3" />
                                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                </div>
                              </CardContent>
                              <CardFooter className="p-3 pt-0 flex justify-between">
                                <div className="flex items-center gap-1">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-[10px]">
                                      {task.assignee.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    {task.comments.length}
                                  </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </CardFooter>
                            </Card>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
