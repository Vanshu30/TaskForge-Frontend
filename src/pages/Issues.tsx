
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';

interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo: string;
  createdBy: string;
  createdAt: Date;
  projectId?: string;
}

const Issues = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newIssue, setNewIssue] = useState<Partial<Issue>>({
    title: '',
    description: '',
    status: 'Open',
    priority: 'Medium',
    assignedTo: user?.name || '',
  });
  const [issues, setIssues] = useState<Issue[]>(() => {
    const savedIssues = localStorage.getItem('issues');
    return savedIssues ? JSON.parse(savedIssues) : [];
  });
  const [deleteIssueId, setDeleteIssueId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewIssue(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewIssue(prev => ({ ...prev, [name]: value }));
  };

  const handleAddIssue = () => {
    if (!newIssue.title || !newIssue.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const issue: Issue = {
      id: `issue-${Date.now()}`,
      title: newIssue.title,
      description: newIssue.description,
      status: newIssue.status as 'Open' | 'In Progress' | 'Closed',
      priority: newIssue.priority as 'Low' | 'Medium' | 'High' | 'Critical',
      assignedTo: newIssue.assignedTo || user?.name || 'Unassigned',
      createdBy: user?.name || 'Anonymous',
      createdAt: new Date(),
      projectId: newIssue.projectId,
    };

    const updatedIssues = [...issues, issue];
    setIssues(updatedIssues);
    localStorage.setItem('issues', JSON.stringify(updatedIssues));
    
    toast({
      title: "Issue Created",
      description: "Your new issue has been added successfully",
    });

    setNewIssue({
      title: '',
      description: '',
      status: 'Open',
      priority: 'Medium',
      assignedTo: user?.name || '',
    });
    setIsDialogOpen(false);
  };

  const handleDeleteIssue = (issueId: string) => {
    setDeleteIssueId(issueId);
  };

  const confirmDeleteIssue = () => {
    if (!deleteIssueId) return;
    
    const updatedIssues = issues.filter(issue => issue.id !== deleteIssueId);
    setIssues(updatedIssues);
    localStorage.setItem('issues', JSON.stringify(updatedIssues));
    
    toast({
      title: "Issue Deleted",
      description: "The issue has been successfully removed",
    });
    
    setDeleteIssueId(null);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Issues</h1>
        </div>
        <Button 
          className="flex items-center gap-2" 
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-5 w-5" />
          Add New Issue
        </Button>
      </div>

      {issues.length > 0 ? (
        <div className="grid gap-4">
          {issues.map((issue) => (
            <div key={issue.id} className="p-4 border rounded-lg bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{issue.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Created by {issue.createdBy} on {new Date(issue.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    issue.priority === 'Low' ? 'bg-blue-100 text-blue-800' :
                    issue.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    issue.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {issue.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    issue.status === 'Open' ? 'bg-green-100 text-green-800' :
                    issue.status === 'In Progress' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {issue.status}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-gray-700">{issue.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Assigned to: {issue.assignedTo}
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteIssue(issue.id)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed">
          <p className="text-muted-foreground">No issues found. Click "Add New Issue" to create one.</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Issue</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new issue
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                name="title"
                placeholder="Issue title" 
                value={newIssue.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description"
                placeholder="Describe the issue in detail" 
                rows={4}
                value={newIssue.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={newIssue.priority} 
                  onValueChange={(value) => handleSelectChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newIssue.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input 
                id="assignedTo" 
                name="assignedTo"
                placeholder="Who should handle this issue?" 
                value={newIssue.assignedTo}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddIssue}>Add Issue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteIssueId} onOpenChange={(open) => !open && setDeleteIssueId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Issue</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this issue? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteIssue} className="bg-red-500">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Issues;
