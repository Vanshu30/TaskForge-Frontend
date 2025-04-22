
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Tag, Priority, User } from "lucide-react";
import Header from '@/components/Header';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';

// Mock data for initial tasks
const initialTasks = {
  todo: [
    {
      id: 'task-1',
      ticketNumber: 'TASK-001',
      title: 'Research API endpoints',
      description: 'Review API documentation and identify required endpoints',
      assignee: 'John Doe',
      priority: 'Medium',
      type: 'Research',
      dueDate: '2025-05-01',
    },
    {
      id: 'task-2',
      ticketNumber: 'TASK-002',
      title: 'Design dashboard layout',
      description: 'Create wireframes for the new dashboard',
      assignee: 'Jane Smith',
      priority: 'High',
      type: 'Design',
      dueDate: '2025-04-28',
    },
  ],
  inProgress: [
    {
      id: 'task-3',
      ticketNumber: 'TASK-003',
      title: 'Implement authentication logic',
      description: 'Add JWT authentication to the backend',
      assignee: 'Alex Johnson',
      priority: 'High',
      type: 'Development',
      dueDate: '2025-04-30',
    },
  ],
  review: [
    {
      id: 'task-4',
      ticketNumber: 'TASK-004',
      title: 'Code review for PR #42',
      description: 'Review the pull request for the new feature',
      assignee: 'Sarah Williams',
      priority: 'Medium',
      type: 'Review',
      dueDate: '2025-04-25',
    },
  ],
  done: [
    {
      id: 'task-5',
      ticketNumber: 'TASK-005',
      title: 'Setup project structure',
      description: 'Initialize project and configure build tools',
      assignee: 'Michael Brown',
      priority: 'High',
      type: 'Setup',
      dueDate: '2025-04-20',
    },
  ],
};

// Interface for task object
interface Task {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  assignee: string;
  priority: string;
  type: string;
  dueDate: string;
}

// Mapping for colors based on priority
const priorityColorMap: Record<string, string> = {
  Low: 'bg-blue-100 text-blue-800',
  Medium: 'bg-amber-100 text-amber-800',
  High: 'bg-red-100 text-red-800',
};

// Mapping for colors based on task type
const typeColorMap: Record<string, string> = {
  Development: 'bg-purple-100 text-purple-800',
  Design: 'bg-green-100 text-green-800',
  Research: 'bg-blue-100 text-blue-800',
  Review: 'bg-amber-100 text-amber-800',
  Setup: 'bg-slate-100 text-slate-800',
  Bug: 'bg-red-100 text-red-800',
};

const Projects: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [tasks, setTasks] = useState<Record<string, Task[]>>(initialTasks);
  
  // State for task creation
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'Medium',
    type: 'Development',
    dueDate: new Date().toISOString().split('T')[0],
  });
  const [date, setDate] = React.useState<Date>();

  // Close sidebar on mobile by default
  React.useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // If no user is logged in, redirect to login
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle drag and drop
  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or if the item was dropped back to its original place
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Find the task that was dragged
    const task = tasks[source.droppableId].find(task => task.id === draggableId);
    if (!task) return;

    // Create new task arrays
    const newTasks = { ...tasks };
    
    // Remove from source
    newTasks[source.droppableId] = newTasks[source.droppableId].filter(
      task => task.id !== draggableId
    );
    
    // Add to destination
    newTasks[destination.droppableId] = [
      ...newTasks[destination.droppableId].slice(0, destination.index),
      task,
      ...newTasks[destination.droppableId].slice(destination.index)
    ];
    
    setTasks(newTasks);
  };

  // Create a new task
  const handleCreateTask = () => {
    // Generate a unique ID and ticket number
    const taskId = `task-${Date.now()}`;
    const ticketNumber = `TASK-${Math.floor(100 + Math.random() * 900)}`;
    
    const task: Task = {
      id: taskId,
      ticketNumber,
      title: newTask.title,
      description: newTask.description,
      assignee: newTask.assignee,
      priority: newTask.priority,
      type: newTask.type,
      dueDate: date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    };
    
    // Add the new task to the "todo" column
    setTasks({
      ...tasks,
      todo: [...tasks.todo, task],
    });
    
    // Reset the form and close the dialog
    setNewTask({
      title: '',
      description: '',
      assignee: '',
      priority: 'Medium',
      type: 'Development',
      dueDate: new Date().toISOString().split('T')[0],
    });
    setDate(undefined);
    setShowNewTaskDialog(false);
  };

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  // Mock team members for the assignee dropdown
  const teamMembers = [
    'John Doe',
    'Jane Smith',
    'Alex Johnson',
    'Sarah Williams',
    'Michael Brown',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex flex-1">
        <DashboardSidebar 
          isMobile={isMobile} 
          isOpen={sidebarOpen} 
          onToggle={toggleSidebar} 
        />
        
        <main className={`flex-1 p-4 md:p-6 ${isMobile ? 'w-full' : ''}`}>
          {/* Mobile sidebar toggle */}
          {isMobile && !sidebarOpen && (
            <Button 
              variant="outline" 
              size="icon" 
              className="mb-4" 
              onClick={toggleSidebar}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </Button>
          )}
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-jira-text">Projects</h1>
              <p className="text-gray-600">Manage your project tasks with Kanban</p>
            </div>
            <Button onClick={() => setShowNewTaskDialog(true)}>
              Create Task
            </Button>
          </div>
          
          {/* Kanban Board */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* To Do Column */}
              <div className="flex flex-col">
                <div className="bg-gray-200 px-4 py-2 rounded-t-md flex justify-between items-center">
                  <h3 className="font-medium">To Do</h3>
                  <Badge variant="outline">{tasks.todo.length}</Badge>
                </div>
                <Droppable droppableId="todo">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-gray-100 rounded-b-md p-2 flex-1 min-h-[70vh]"
                    >
                      {tasks.todo.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-2"
                            >
                              <Card className="bg-white shadow-sm">
                                <CardHeader className="p-3 pb-0">
                                  <div className="flex justify-between items-start">
                                    <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                                    <Badge variant="outline" className="text-xs">{task.ticketNumber}</Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-3">
                                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{task.description}</p>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    <div className="flex items-center">
                                      <User size={12} className="mr-1" />
                                      <span className="text-xs">{task.assignee}</span>
                                    </div>
                                    <div className={`ml-2 px-2 py-0.5 rounded-full text-xs ${priorityColorMap[task.priority] || 'bg-gray-100'}`}>
                                      {task.priority}
                                    </div>
                                    <div className={`ml-2 px-2 py-0.5 rounded-full text-xs ${typeColorMap[task.type] || 'bg-gray-100'}`}>
                                      {task.type}
                                    </div>
                                  </div>
                                  <div className="flex items-center mt-2 text-xs text-gray-500">
                                    <Clock size={12} className="mr-1" />
                                    <span>Due: {task.dueDate}</span>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* In Progress Column */}
              <div className="flex flex-col">
                <div className="bg-blue-200 px-4 py-2 rounded-t-md flex justify-between items-center">
                  <h3 className="font-medium">In Progress</h3>
                  <Badge variant="outline">{tasks.inProgress.length}</Badge>
                </div>
                <Droppable droppableId="inProgress">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-blue-50 rounded-b-md p-2 flex-1 min-h-[70vh]"
                    >
                      {tasks.inProgress.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-2"
                            >
                              <Card className="bg-white shadow-sm">
                                <CardHeader className="p-3 pb-0">
                                  <div className="flex justify-between items-start">
                                    <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                                    <Badge variant="outline" className="text-xs">{task.ticketNumber}</Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-3">
                                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{task.description}</p>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    <div className="flex items-center">
                                      <User size={12} className="mr-1" />
                                      <span className="text-xs">{task.assignee}</span>
                                    </div>
                                    <div className={`ml-2 px-2 py-0.5 rounded-full text-xs ${priorityColorMap[task.priority] || 'bg-gray-100'}`}>
                                      {task.priority}
                                    </div>
                                    <div className={`ml-2 px-2 py-0.5 rounded-full text-xs ${typeColorMap[task.type] || 'bg-gray-100'}`}>
                                      {task.type}
                                    </div>
                                  </div>
                                  <div className="flex items-center mt-2 text-xs text-gray-500">
                                    <Clock size={12} className="mr-1" />
                                    <span>Due: {task.dueDate}</span>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* Review Column */}
              <div className="flex flex-col">
                <div className="bg-amber-200 px-4 py-2 rounded-t-md flex justify-between items-center">
                  <h3 className="font-medium">Review</h3>
                  <Badge variant="outline">{tasks.review.length}</Badge>
                </div>
                <Droppable droppableId="review">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-amber-50 rounded-b-md p-2 flex-1 min-h-[70vh]"
                    >
                      {tasks.review.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-2"
                            >
                              <Card className="bg-white shadow-sm">
                                <CardHeader className="p-3 pb-0">
                                  <div className="flex justify-between items-start">
                                    <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                                    <Badge variant="outline" className="text-xs">{task.ticketNumber}</Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-3">
                                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{task.description}</p>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    <div className="flex items-center">
                                      <User size={12} className="mr-1" />
                                      <span className="text-xs">{task.assignee}</span>
                                    </div>
                                    <div className={`ml-2 px-2 py-0.5 rounded-full text-xs ${priorityColorMap[task.priority] || 'bg-gray-100'}`}>
                                      {task.priority}
                                    </div>
                                    <div className={`ml-2 px-2 py-0.5 rounded-full text-xs ${typeColorMap[task.type] || 'bg-gray-100'}`}>
                                      {task.type}
                                    </div>
                                  </div>
                                  <div className="flex items-center mt-2 text-xs text-gray-500">
                                    <Clock size={12} className="mr-1" />
                                    <span>Due: {task.dueDate}</span>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* Done Column */}
              <div className="flex flex-col">
                <div className="bg-green-200 px-4 py-2 rounded-t-md flex justify-between items-center">
                  <h3 className="font-medium">Done</h3>
                  <Badge variant="outline">{tasks.done.length}</Badge>
                </div>
                <Droppable droppableId="done">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-green-50 rounded-b-md p-2 flex-1 min-h-[70vh]"
                    >
                      {tasks.done.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-2"
                            >
                              <Card className="bg-white shadow-sm">
                                <CardHeader className="p-3 pb-0">
                                  <div className="flex justify-between items-start">
                                    <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                                    <Badge variant="outline" className="text-xs">{task.ticketNumber}</Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-3">
                                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{task.description}</p>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    <div className="flex items-center">
                                      <User size={12} className="mr-1" />
                                      <span className="text-xs">{task.assignee}</span>
                                    </div>
                                    <div className={`ml-2 px-2 py-0.5 rounded-full text-xs ${priorityColorMap[task.priority] || 'bg-gray-100'}`}>
                                      {task.priority}
                                    </div>
                                    <div className={`ml-2 px-2 py-0.5 rounded-full text-xs ${typeColorMap[task.type] || 'bg-gray-100'}`}>
                                      {task.type}
                                    </div>
                                  </div>
                                  <div className="flex items-center mt-2 text-xs text-gray-500">
                                    <Clock size={12} className="mr-1" />
                                    <span>Due: {task.dueDate}</span>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </DragDropContext>
        </main>
      </div>

      {/* Create Task Dialog */}
      <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new task. Tasks are added to the "To Do" column by default.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="col-span-3"
                placeholder="Task title"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className="col-span-3"
                placeholder="Task description"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignee" className="text-right">
                Assignee
              </Label>
              <Select 
                onValueChange={(value) => setNewTask({...newTask, assignee: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map(member => (
                    <SelectItem key={member} value={member}>
                      {member}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select 
                defaultValue="Medium"
                onValueChange={(value) => setNewTask({...newTask, priority: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select 
                defaultValue="Development"
                onValueChange={(value) => setNewTask({...newTask, type: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Research">Research</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Setup">Setup</SelectItem>
                  <SelectItem value="Bug">Bug</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`col-span-3 justify-start text-left font-normal ${
                      !date && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTaskDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleCreateTask} disabled={!newTask.title}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
