
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useAuth } from '@/hooks/useAuth';
import { Menu, ArrowLeft, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role?: string;
  status?: string;
}

interface Project {
  id: string;
  name: string;
}

interface ProjectTeam {
  projectId: string;
  projectName: string;
  members: TeamMember[];
}

const Teams = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projectTeams, setProjectTeams] = useState<ProjectTeam[]>([]);

  useEffect(() => {
    // Load projects and their team members
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      const projects: Project[] = JSON.parse(storedProjects);
      const teams: ProjectTeam[] = [];
      
      projects.forEach(project => {
        const teamMembers = localStorage.getItem(`team_${project.id}`);
        if (teamMembers) {
          const members: TeamMember[] = JSON.parse(teamMembers);
          
          if (members && members.length > 0) {
            teams.push({
              projectId: project.id,
              projectName: project.name,
              members
            });
          }
        }
      });
      
      setProjectTeams(teams);
    }
    
    // Add event listener for team updates
    window.addEventListener('teamUpdate', handleTeamUpdate as EventListener);
    
    return () => {
      window.removeEventListener('teamUpdate', handleTeamUpdate as EventListener);
    };
  }, []);
  
  // Handle team updates
  const handleTeamUpdate = (event: CustomEvent) => {
    if (event.detail && event.detail.projectId) {
      refreshTeams();
    }
  };
  
  // Refresh all teams
  const refreshTeams = () => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      const projects: Project[] = JSON.parse(storedProjects);
      const teams: ProjectTeam[] = [];
      
      projects.forEach(project => {
        const teamMembers = localStorage.getItem(`team_${project.id}`);
        if (teamMembers) {
          const members: TeamMember[] = JSON.parse(teamMembers);
          
          if (members && members.length > 0) {
            teams.push({
              projectId: project.id,
              projectName: project.name,
              members
            });
          }
        }
      });
      
      setProjectTeams(teams);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

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
        
        <main className="container mx-auto py-8 px-4">
          <div className="flex items-center mb-6">
            <Link 
              to="/dashboard" 
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </div>

          <h1 className="text-2xl font-bold mb-6">Teams</h1>
          
          {projectTeams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectTeams.map(team => (
                <Card key={team.projectId}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        {team.projectName} Team
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {team.members.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {team.members.map((member) => (
                        <li key={member.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.role || 'Team Member'}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4 w-full"
                      onClick={() => navigate(`/projects/${team.projectId}`)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Project
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <h3 className="font-medium text-lg mb-2">No teams found</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any team members yet. Start by adding team members to your projects.
              </p>
              <Button asChild>
                <Link to="/projects">
                  <Users className="mr-2 h-4 w-4" />
                  Go to Projects
                </Link>
              </Button>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Teams;

