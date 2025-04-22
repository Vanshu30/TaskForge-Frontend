
import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useAuth } from '@/context/AuthContext';
import { Menu, ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// Mock data until Supabase integration
const MOCK_PROJECTS = {
  '1': {
    id: '1',
    name: 'Website Redesign',
    description: 'Redesign company website with new branding',
    members: [
      { id: 'user-1', name: 'Alex Johnson', email: 'alex@example.com', role: 'Project Manager' },
      { id: 'user-2', name: 'Maria Garcia', email: 'maria@example.com', role: 'Designer' },
      { id: 'user-3', name: 'David Kim', email: 'david@example.com', role: 'Developer' },
      { id: 'user-4', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Content Writer' }
    ],
    taskTypes: ['Feature', 'Bug', 'Documentation', 'Design'],
    priorities: ['High', 'Medium', 'Low']
  },
  '2': {
    id: '2',
    name: 'Mobile App Development',
    description: 'Create a new mobile app for customer engagement',
    members: [
      { id: 'user-1', name: 'Alex Johnson', email: 'alex@example.com', role: 'Project Manager' },
      { id: 'user-5', name: 'Michael Brown', email: 'michael@example.com', role: 'Developer' },
      { id: 'user-6', name: 'Emily Chen', email: 'emily@example.com', role: 'UX Designer' }
    ],
    taskTypes: ['Feature', 'Bug', 'UI Component', 'API Integration'],
    priorities: ['Critical', 'High', 'Medium', 'Low']
  },
  '3': {
    id: '3',
    name: 'Q2 Marketing Campaign',
    description: 'Plan and execute Q2 marketing initiatives',
    members: [
      { id: 'user-1', name: 'Alex Johnson', email: 'alex@example.com', role: 'Project Manager' },
      { id: 'user-7', name: 'Jessica Taylor', email: 'jessica@example.com', role: 'Marketing Lead' },
      { id: 'user-8', name: 'Ryan Martinez', email: 'ryan@example.com', role: 'Content Strategist' }
    ],
    taskTypes: ['Research', 'Content Creation', 'Social Media', 'Email Campaign'],
    priorities: ['High', 'Normal', 'Low']
  }
};

const ProjectSettings = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { projectId } = useParams();
  
  // Get project details
  const project = projectId ? MOCK_PROJECTS[projectId] : null;

  const [projectName, setProjectName] = useState(project?.name || '');
  const [projectDescription, setProjectDescription] = useState(project?.description || '');
  const [newTaskType, setNewTaskType] = useState('');
  const [newPriority, setNewPriority] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('member');
  const [taskTypes, setTaskTypes] = useState(project?.taskTypes || []);
  const [priorities, setPriorities] = useState(project?.priorities || []);

  // If user is not logged in, redirect to login page
  if (!user) {
    navigate('/login');
    return null;
  }

  // If project doesn't exist, redirect to projects page
  if (!project) {
    navigate('/projects');
    return null;
  }

  const handleAddTaskType = () => {
    if (!newTaskType.trim()) return;
    
    if (taskTypes.includes(newTaskType.trim())) {
      toast({
        title: "Task type already exists",
        description: "Please enter a unique task type.",
        variant: "destructive",
      });
      return;
    }
    
    setTaskTypes([...taskTypes, newTaskType.trim()]);
    setNewTaskType('');
  };

  const handleRemoveTaskType = (type) => {
    setTaskTypes(taskTypes.filter(t => t !== type));
  };

  const handleAddPriority = () => {
    if (!newPriority.trim()) return;
    
    if (priorities.includes(newPriority.trim())) {
      toast({
        title: "Priority already exists",
        description: "Please enter a unique priority level.",
        variant: "destructive",
      });
      return;
    }
    
    setPriorities([...priorities, newPriority.trim()]);
    setNewPriority('');
  };

  const handleRemovePriority = (priority) => {
    setPriorities(priorities.filter(p => p !== priority));
  };

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) return;
    
    // This would actually send an invitation email through Supabase
    toast({
      title: "Invitation sent",
      description: `Invitation email sent to ${inviteEmail} with role: ${selectedRole}`,
    });
    
    setInviteEmail('');
  };

  const handleSaveSettings = () => {
    // This would save to Supabase
    toast({
      title: "Settings saved",
      description: "Project settings have been updated successfully.",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar 
        isMobile={isMobile} 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      <div className="flex-1 overflow-auto">
        <Header />
        
        {isMobile && !sidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </Button>
        )}
        
        <main className="container mx-auto py-6 px-4">
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Link to={`/projects/${projectId}`} className="text-muted-foreground hover:text-foreground transition-colors flex items-center mr-4">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Project
              </Link>
            </div>
            <h1 className="text-3xl font-bold">Project Settings</h1>
          </div>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="team">Team Members</TabsTrigger>
              <TabsTrigger value="workflow">Workflow</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>Update your project information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="project-name" className="text-sm font-medium">
                      Project Name
                    </label>
                    <Input 
                      id="project-name" 
                      value={projectName} 
                      onChange={(e) => setProjectName(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="project-description" className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea 
                      id="project-description" 
                      rows={4}
                      value={projectDescription} 
                      onChange={(e) => setProjectDescription(e.target.value)} 
                    />
                  </div>
                  
                  <Button onClick={handleSaveSettings}>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage who has access to this project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Email address" 
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="flex-1"
                      />
                      <Select 
                        value={selectedRole} 
                        onValueChange={setSelectedRole}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={handleInviteMember}>Invite</Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      {project.members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-muted-foreground">{member.email}</div>
                            </div>
                          </div>
                          <Badge variant={member.role === 'Project Manager' ? 'default' : 'outline'}>
                            {member.role}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="workflow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Task Types</CardTitle>
                    <CardDescription>Configure the types of tasks for this project</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input 
                          placeholder="New task type" 
                          value={newTaskType}
                          onChange={(e) => setNewTaskType(e.target.value)}
                        />
                        <Button onClick={handleAddTaskType}>Add</Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {taskTypes.map((type) => (
                          <Badge key={type} variant="outline" className="flex items-center gap-1">
                            {type}
                            <button 
                              onClick={() => handleRemoveTaskType(type)}
                              className="ml-1 rounded-full hover:bg-muted p-1"
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove</span>
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Priority Levels</CardTitle>
                    <CardDescription>Define the priority levels for tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input 
                          placeholder="New priority level" 
                          value={newPriority}
                          onChange={(e) => setNewPriority(e.target.value)}
                        />
                        <Button onClick={handleAddPriority}>Add</Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {priorities.map((priority) => (
                          <Badge key={priority} variant="outline" className="flex items-center gap-1">
                            {priority}
                            <button 
                              onClick={() => handleRemovePriority(priority)}
                              className="ml-1 rounded-full hover:bg-muted p-1"
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove</span>
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <Button onClick={handleSaveSettings}>Save Workflow Settings</Button>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default ProjectSettings;
