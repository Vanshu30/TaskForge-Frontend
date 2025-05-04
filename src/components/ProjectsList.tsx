// components/ProjectsList.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder, Trash2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  lastUpdated: string;
  teamSize: number;
  tags: string[];
}

interface ProjectsListProps {
  projects: Project[];
  onDelete?: (id: string) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ projects, onDelete }) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ProjectsList received projects:", projects);
  }, [projects]);

  if (!projects || !projects.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No projects found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="relative group hover:shadow-md transition-shadow border border-gray-200"
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 text-primary">
                <Folder className="w-5 h-5" />
                <CardTitle className="text-lg">{project.name}</CardTitle>
              </div>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-50 hover:opacity-100 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(project.id);
                  }}
                  aria-label="Delete project"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent
            onClick={() => navigate(`/projects/${project.id}`)}
            className="cursor-pointer"
          >
            <CardDescription className="mb-2 text-sm text-muted-foreground">
              {project.description || 'No description provided'}
            </CardDescription>
            <div className="text-xs text-gray-500">
              Status: <span className="capitalize">{project.status}</span>
            </div>
            <div className="text-xs text-gray-500">
              Updated: {new Date(project.lastUpdated).toLocaleDateString()}
            </div>
            <div className="text-xs text-gray-500">
              Team Size: {project.teamSize}
            </div>
            {project.tags && project.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectsList;
