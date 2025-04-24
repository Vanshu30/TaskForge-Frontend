
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AddTaskDialog from './AddTaskDialog';
import TaskDialog from './TaskDialog';
import TaskCard from './TaskCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';

const emptyColumns = {
  'todo': {
    id: 'todo',
    title: 'To Do',
    taskIds: [],
  },
  'in-progress': {
    id: 'in-progress',
    title: 'In Progress',
    taskIds: [],
  },
  'review': {
    id: 'review',
    title: 'Review',
    taskIds: [],
  },
  'done': {
    id: 'done',
    title: 'Done',
    taskIds: [],
  },
};

const demoColumns = {
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

const AddTeamMemberDialog = ({ onAddMember }) => {
  const [open, setOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const onSubmit = (data) => {
    onAddMember({
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
    });
    setOpen(false);
    form.reset();
    toast({
      title: "Team member added",
      description: `${data.name} has been added to the project team.`
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...form.register('name', { required: true })}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email', { required: true })}
              placeholder="john@example.com"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Member</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const TeamMembersDialog = ({ teamMembers, onAddMember }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => {}}>
          <Users className="mr-2 h-4 w-4" />
          Team
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Project Team</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Members ({teamMembers.length})</h3>
            <AddTeamMemberDialog onAddMember={onAddMember} />
          </div>
          {teamMembers.length > 0 ? (
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-md">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No team members yet. Add one to get started.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const KanbanBoard = ({ projectId, onTaskDelete }) => {
  const [isNewProject, setIsNewProject] = useState(true);
  const [columns, setColumns] = useState(emptyColumns);
  const [tasks, setTasks] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    loadBoardData();
  }, [projectId]);
  
  const loadBoardData = () => {
    if (!projectId) return;
    
    const storedTasks = localStorage.getItem(`tasks_${projectId}`);
    const storedColumns = localStorage.getItem(`columns_${projectId}`);
    const storedTeamMembers = localStorage.getItem(`team_${projectId}`);
    
    if (storedTeamMembers) {
      setTeamMembers(JSON.parse(storedTeamMembers));
    }
    
    if (storedTasks && storedColumns) {
      setTasks(JSON.parse(storedTasks));
      setColumns(JSON.parse(storedColumns));
      setIsNewProject(false);
    } else {
      setTasks({});
      setColumns(emptyColumns);
      setIsNewProject(true);
      
      localStorage.setItem(`tasks_${projectId}`, JSON.stringify({}));
      localStorage.setItem(`columns_${projectId}`, JSON.stringify(emptyColumns));
    }
  };

  useEffect(() => {
    const handleTaskEvent = () => {
      loadBoardData();
    };
    
    window.addEventListener('taskUpdate', handleTaskEvent);
    window.addEventListener('taskAdd', handleTaskEvent);
    window.addEventListener('taskDelete', handleTaskEvent);
    
    return () => {
      window.removeEventListener('taskUpdate', handleTaskEvent);
      window.removeEventListener('taskAdd', handleTaskEvent);
      window.removeEventListener('taskDelete', handleTaskEvent);
    };
  }, [projectId]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];
    
    const columnOrder = ['todo', 'in-progress', 'review', 'done'];
    const sourceIndex = columnOrder.indexOf(sourceColumn.id);
    const destIndex = columnOrder.indexOf(destinationColumn.id);
    
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
    localStorage.setItem(`columns_${projectId}`, JSON.stringify(newColumns));
  };

  const handleAddComment = (taskId: string, commentText: string) => {
    if (!tasks[taskId]) return;
    
    const updatedTasks = {
      ...tasks,
      [taskId]: {
        ...tasks[taskId],
        comments: [
          ...(tasks[taskId].comments || []),
          {
            id: `comment-${Date.now()}`,
            text: commentText,
            user: 'Current User',
            timestamp: new Date().toISOString(),
          },
        ],
      },
    };
    
    setTasks(updatedTasks);
    localStorage.setItem(`tasks_${projectId}`, JSON.stringify(updatedTasks));
    
    const updateEvent = new CustomEvent('taskUpdate', {
      detail: { type: 'comment', taskId, tasks: updatedTasks }
    });
    window.dispatchEvent(updateEvent);
  };

  const handleUpdateTask = (updatedTask) => {
    if (!updatedTask || !updatedTask.id) {
      console.error("KanbanBoard - Cannot update task: Invalid task data");
      return;
    }
    
    const updatedTasks = {
      ...tasks,
      [updatedTask.id]: updatedTask
    };
    
    setTasks(updatedTasks);
    localStorage.setItem(`tasks_${projectId}`, JSON.stringify(updatedTasks));
    
    // Update selected task in state if it's currently selected
    if (selectedTask && selectedTask.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }
    
    const updateEvent = new CustomEvent('taskUpdate', {
      detail: { type: 'update', taskId: updatedTask.id, tasks: updatedTasks }
    });
    window.dispatchEvent(updateEvent);
    
    toast({
      title: "Task updated",
      description: "Task has been updated successfully"
    });
  };

  const handleAddTeamMember = (newMember) => {
    const updatedTeamMembers = [...teamMembers, newMember];
    setTeamMembers(updatedTeamMembers);
    localStorage.setItem(`team_${projectId}`, JSON.stringify(updatedTeamMembers));
    
    const updateEvent = new CustomEvent('teamUpdate', {
      detail: { type: 'teamMember', projectId, teamMembers: updatedTeamMembers }
    });
    window.dispatchEvent(updateEvent);
  };

  const handleDeleteTask = (taskId) => {
    if (!taskId) {
      console.error("KanbanBoard - Cannot delete task: No taskId provided");
      return;
    }
    
    console.log("KanbanBoard - Delete task requested for ID:", taskId);
    
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(null);
    }
    
    if (onTaskDelete) {
      onTaskDelete(taskId);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kanban Board</h2>
        <div className="flex gap-2">
          <TeamMembersDialog 
            teamMembers={teamMembers}
            onAddMember={handleAddTeamMember}
          />
          <AddTaskDialog 
            projectId={projectId} 
            teamMembers={teamMembers}
            onAddTask={(task) => {
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
              
              localStorage.setItem(`tasks_${projectId}`, JSON.stringify(newTasks));
              localStorage.setItem(`columns_${projectId}`, JSON.stringify(newColumns));
              
              const updateEvent = new CustomEvent('taskAdd', {
                detail: { task, tasks: newTasks, columns: newColumns }
              });
              window.dispatchEvent(updateEvent);
            }} 
          />
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 overflow-x-auto">
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="min-w-[280px]">
              <div className={`rounded-t-md p-3 border-x border-t border-border font-medium
                ${columnId === 'todo' ? 'bg-blue-50' :
                  columnId === 'in-progress' ? 'bg-amber-50' :
                  columnId === 'review' ? 'bg-purple-50' :
                  'bg-green-50'
                }`}
              >
                <h3 className="font-medium flex items-center">
                  {column.title}
                  <Badge variant="outline" className="ml-2">
                    {column.taskIds.length}
                  </Badge>
                </h3>
              </div>
              
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-2 min-h-[500px] border border-border rounded-b-md
                      ${columnId === 'todo' ? 'bg-blue-50/50' :
                        columnId === 'in-progress' ? 'bg-amber-50/50' :
                        columnId === 'review' ? 'bg-purple-50/50' :
                        'bg-green-50/50'
                      }`
                    }
                  >
                    {column.taskIds.map((taskId, index) => {
                      const task = tasks[taskId];
                      if (!task) return null;
                      return (
                        <Draggable key={taskId} draggableId={taskId} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard 
                                task={task}
                                onClick={() => setSelectedTask(task)}
                              />
                            </div>
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

      {selectedTask && (
        <TaskDialog
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onAddComment={handleAddComment}
          onDeleteTask={handleDeleteTask}
          onUpdateTask={handleUpdateTask}
          teamMembers={teamMembers}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
