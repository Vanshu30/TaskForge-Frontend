
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Calendar, Users, Settings } from 'lucide-react';

// Mock data until Supabase integration
const MOCK_PROJECTS = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Redesign company website with new branding',
    tasks: { total: 12, completed: 5 },
    members: 4,
    dueDate: '2025-05-15',
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Create a new mobile app for customer engagement',
    tasks: { total: 24, completed: 8 },
    members: 6,
    dueDate: '2025-06-30',
  },
  {
    id: '3',
    name: 'Q2 Marketing Campaign',
    description: 'Plan and execute Q2 marketing initiatives',
    tasks: { total: 18, completed: 2 },
    members: 3,
    dueDate: '2025-05-01',
  },
];

const ProjectsList = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button>
          <Briefcase className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROJECTS.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-start">
                <Link to={`/projects/${project.id}`} className="hover:text-primary transition-colors">
                  {project.name}
                </Link>
                <Badge variant="outline" className="ml-2">
                  {Math.round((project.tasks.completed / project.tasks.total) * 100)}%
                </Badge>
              </CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{project.members} team members</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{project.tasks.completed}/{project.tasks.total} tasks</span>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${(project.tasks.completed / project.tasks.total) * 100}%` }}
                  />
                </div>
              </div>
              <Link to={`/projects/${project.id}/settings`}>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;
