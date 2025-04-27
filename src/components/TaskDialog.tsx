
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import EditTaskDialog from './EditTaskDialog';

interface TaskDialogProps {
  task: any;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (taskId: string, comment: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (task: any) => void;
  teamMembers?: {id: string; name: string; email: string}[];
}

const TaskDialog = ({ 
  task, 
  isOpen, 
  onClose, 
  onAddComment, 
  onDeleteTask,
  onUpdateTask,
  teamMembers = []
}: TaskDialogProps) => {
  const [comment, setComment] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleAddComment = () => {
    if (comment.trim()) {
      onAddComment(task.id, comment);
      setComment('');
    }
  };

  const handleDelete = () => {
    // Close the confirmation dialog first
    setDeleteConfirmOpen(false);
    
    // Then close the task dialog
    onClose();
    
    // Finally, trigger the delete action after UI updates
    setTimeout(() => {
      onDeleteTask(task.id);
      
      toast({
        title: "Task deleted",
        description: "Task has been removed from the board"
      });
    }, 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug':
        return <div className="h-4 w-4 rounded-full bg-red-500" title="Bug"></div>;
      case 'feature':
        return <div className="h-4 w-4 rounded-full bg-green-500" title="Feature"></div>;
      case 'enhancement':
        return <div className="h-4 w-4 rounded-full bg-blue-500" title="Enhancement"></div>;
      default:
        return <div className="h-4 w-4 rounded-full bg-amber-500" title="Task"></div>;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {getTypeIcon(task.type)}
              {task.title}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-4 p-1">
              {/* Task metadata */}
              <div className="flex flex-wrap gap-2 items-center mb-4">
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </Badge>
                
                {task.dueDate && (
                  <Badge variant="outline" className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                  </Badge>
                )}
                
                <Badge variant="outline" className="ml-auto">
                  {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                </Badge>
              </div>
              
              {/* Task description */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                <p className="text-gray-800 whitespace-pre-wrap">
                  {task.description || "No description provided."}
                </p>
              </div>
              
              {/* Assignee */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Assignee</h3>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-2">
                    {task.assignee?.name ? task.assignee.name.charAt(0) : "?"}
                  </div>
                  <span>{task.assignee?.name || "Unassigned"}</span>
                </div>
              </div>
              
              {/* Comments section */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Comments</h3>
                
                {task.comments && task.comments.length > 0 ? (
                  <div className="space-y-4">
                    {task.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-2">
                            {comment.user ? comment.user.charAt(0) : "?"}
                          </div>
                          <span className="font-medium">{comment.user || "Unknown user"}</span>
                          <span className="text-gray-400 text-xs ml-auto">
                            {comment.timestamp ? format(new Date(comment.timestamp), 'MMM dd, h:mm a') : "No date"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No comments yet.</p>
                )}
                
                {/* Add comment */}
                <div className="mt-4 flex">
                  <Input
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleAddComment}
                    className="ml-2"
                    disabled={!comment.trim()}
                  >
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <div className="mt-4 flex justify-between">
            <Button variant="secondary" onClick={() => setEditDialogOpen(true)}>
              Edit Task
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setDeleteConfirmOpen(true)}
            >
              Delete Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              Delete Task
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit task dialog */}
      {editDialogOpen && (
        <EditTaskDialog
          task={task}
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSave={onUpdateTask}
          teamMembers={teamMembers}
        />
      )}
    </>
  );
};

export default TaskDialog;
