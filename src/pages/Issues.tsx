
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Bug, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

interface IssueFormData {
  title: string;
  description: string;
  type: 'bug' | 'task' | 'story' | 'epic';
  priority: 'lowest' | 'low' | 'medium' | 'high' | 'highest';
}

const Issues = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const navigate = useNavigate();
  const [issues, setIssues] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const form = useForm<IssueFormData>({
    defaultValues: {
      title: '',
      description: '',
      type: 'task',
      priority: 'medium',
    }
  });

  const handleAddIssue = (data: IssueFormData) => {
    const newIssue = {
      id: `issue-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      status: 'open',
    };

    setIssues([...issues, newIssue]);
    setDialogOpen(false);
    form.reset();

    toast({
      title: "Issue created",
      description: "Your issue has been successfully created",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex flex-1">
        <DashboardSidebar 
          isMobile={isMobile} 
          isOpen={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
        
        <main className={`flex-1 p-4 md:p-6 ${isMobile ? 'w-full' : ''}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
              <p className="text-gray-600">Manage and track issues across your projects.</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto" size="lg">
                  <Plus className="mr-1" />
                  Add New Issue
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Issue</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleAddIssue)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Issue Title</Label>
                    <Input 
                      id="title" 
                      placeholder="Enter issue title" 
                      {...form.register('title', { required: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Issue Type</Label>
                    <Select 
                      onValueChange={(value) => form.setValue('type', value as any)} 
                      defaultValue={form.getValues('type')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bug">
                          <div className="flex items-center">
                            <Bug className="h-4 w-4 mr-2 text-red-500" />
                            Bug
                          </div>
                        </SelectItem>
                        <SelectItem value="task">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-amber-500" />
                            Task
                          </div>
                        </SelectItem>
                        <SelectItem value="story">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            Story
                          </div>
                        </SelectItem>
                        <SelectItem value="epic">
                          <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2 text-purple-500" />
                            Epic
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      onValueChange={(value) => form.setValue('priority', value as any)}
                      defaultValue={form.getValues('priority')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="highest">
                          <div className="flex items-center">
                            <span className="h-3 w-3 rounded-full bg-red-600 mr-2"></span>
                            Highest
                          </div>
                        </SelectItem>
                        <SelectItem value="high">
                          <div className="flex items-center">
                            <span className="h-3 w-3 rounded-full bg-red-400 mr-2"></span>
                            High
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center">
                            <span className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></span>
                            Medium
                          </div>
                        </SelectItem>
                        <SelectItem value="low">
                          <div className="flex items-center">
                            <span className="h-3 w-3 rounded-full bg-green-400 mr-2"></span>
                            Low
                          </div>
                        </SelectItem>
                        <SelectItem value="lowest">
                          <div className="flex items-center">
                            <span className="h-3 w-3 rounded-full bg-green-600 mr-2"></span>
                            Lowest
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe the issue in detail" 
                      {...form.register('description')}
                      rows={5}
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Create Issue
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {issues.length === 0 ? (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
              <p className="text-gray-500">Get started by creating your first issue.</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {/* Issue cards will be rendered here when we have issues */}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Issues;
