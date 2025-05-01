import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Plus, Search, Users } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  lastUpdated: string;
  teamSize: number;
  tags: string[];
}

interface ProjectsProps {
  projects?: Project[];
  onAddProject?: (project: Project) => void;
}

const Projects: React.FC<ProjectsProps> = ({ projects: propProjects = [], onAddProject }) => {
  const [localProjects, setLocalProjects] = useState<Project[]>([
    // Default sample projects if none provided
    {
      id: 'project-1',
      name: 'Website Redesign',
      description: 'Redesign the company website with modern UI/UX principles',
      status: 'active',
      lastUpdated: new Date().toISOString(),
      teamSize: 3,
      tags: ['Design', 'Frontend'],
    },
    {
      id: 'project-2',
      name: 'Mobile App Development',
      description: 'Create a mobile app for our customers',
      status: 'on-hold',
      lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      teamSize: 5,
      tags: ['Mobile', 'React Native'],
    },
  ]);
  
  // Use provided projects if available, otherwise use local state
  const projectsToDisplay = propProjects.length > 0 ? propProjects : localProjects;
  
  // Default implementation for onAddProject if not provided
  const handleAddProject = onAddProject || ((project: Project) => {
    console.log('New project added:', project);
    setLocalProjects(prev => [...prev, project]);
  });
  
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projectsToDisplay.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  interface ProjectFormValues {
    name: string;
    description: string;
    status: 'active' | 'completed' | 'on-hold';
  }

  const form = useForm<ProjectFormValues>({
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
    },
  });

  const handleSubmit = (data: ProjectFormValues) => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: data.name,
      description: data.description,
      status: 'active',
      lastUpdated: new Date().toISOString(),
      teamSize: 1,
      tags: ['New'],
    };

    handleAddProject(newProject);
    setOpen(false);
    form.reset();
  };

  const handleProjectClick = (projectId: string) => {
    console.log("Navigating to project:", projectId);
    try {
      navigate(`/projects/${projectId}`);
    } catch (error) {
      console.error("Navigation error:", error);
      window.location.href = `/projects/${projectId}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  {...form.register('name', { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...form.register('description')}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Project</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className="cursor-pointer transition-all hover:shadow-md"
              onClick={() => handleProjectClick(project.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground flex justify-between pt-2 border-t">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(project.lastUpdated).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {project.teamSize} {project.teamSize === 1 ? 'member' : 'members'}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border rounded-lg bg-muted/10">
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm ? 'Try a different search term' : 'Get started by creating your first project'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;