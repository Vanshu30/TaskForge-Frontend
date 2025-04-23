
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Calendar, MessageSquare, Trash2, Bug, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
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

interface TaskDialogProps {
  task: any;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (taskId: string, comment: string) => void;
  onDeleteTask: (taskId: string) => void;
  teamMembers: any[];
}

const TaskDialog: React.FC<TaskDialogProps> = ({ 
  task, 
  isOpen, 
  onClose, 
  onAddComment,
  onDeleteTask,
  teamMembers 
}) => {
  const [comment, setComment] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [localComments, setLocalComments] = useState(task?.comments || []);

  useEffect(() => {
    // Update local comments when task.comments changes
    if (task?.comments) {
      setLocalComments(task.comments);
    }
  }, [task?.comments]);

  const handleAddComment = () => {
    if (comment.trim()) {
      // Create a new comment for immediate display
      const newComment = {
        id: `comment-${Date.now()}`,
        text: comment,
        user: 'Current User',
        timestamp: new Date().toISOString(),
      };
      
      // Update local state immediately
      setLocalComments([...localComments, newComment]);
      
      // Send to parent for persistence
      onAddComment(task.id, comment);
      setComment('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && comment.trim()) {
      handleAddComment();
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    if (onDeleteTask) {
      onDeleteTask(task.id);
    }
    onClose();
  };

  if (!task) return null;

  const getTaskTypeIcon = () => {
    switch (task.type) {
      case 'bug':
        return <Bug className="h-4 w-4 mr-1" />;
      case 'feature':
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'enhancement':
        return <AlertCircle className="h-4 w-4 mr-1" />;
      case 'task':
      default:
        return <Clock className="h-4 w-4 mr-1" />;
    }
  };

  const getTaskTypeBadgeColor = () => {
    switch (task.type) {
      case 'bug':
        return 'bg-red-500';
      case 'feature':
        return 'bg-green-500';
      case 'enhancement':
        return 'bg-blue-500';
      case 'task':
      default:
        return 'bg-amber-500';
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-xl">{task.title}</DialogTitle>
                  {task.type && (
                    <Badge className={getTaskTypeBadgeColor()}>
                      {getTaskTypeIcon()}
                      {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                    </Badge>
                  )}
                </div>
                <Badge variant="outline" className="mt-1 w-fit">
                  {task.id}
                </Badge>
              </div>
              <Badge className={
                task.priority === 'high' ? 'bg-red-500' :
                task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }>
                {task.priority}
              </Badge>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{task.description}</p>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Due: {format(new Date(task.dueDate), 'PPP')}</span>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Assignee:</span>
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarFallback>
                    {task.assignee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{task.assignee.name}</span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium flex items-center mb-4">
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments
              </h3>
              
              <div className="space-y-3 max-h-[200px] overflow-y-auto">
                {localComments && localComments.length > 0 ? (
                  localComments.map(comment => (
                    <div key={comment.id} className="bg-muted p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-sm">{comment.user}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(comment.timestamp), 'PPp')}
                        </div>
                      </div>
                      <p className="text-sm mt-1">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center">No comments yet</p>
                )}
              </div>
              
              <div className="flex mt-4">
                <Input 
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAddComment} 
                  className="ml-2"
                  disabled={!comment.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskDialog;
