
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Calendar, Tag, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  text: string;
  user: {
    name: string;
    avatar?: string;
  };
  timestamp: string;
}

interface TaskDialogProps {
  task: {
    id: string;
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    assignee: {
      name: string;
      avatar?: string;
    };
    comments: Comment[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (taskId: string, comment: string) => void;
  teamMembers?: {id: string; name: string; email: string}[];
}

const TaskDialog: React.FC<TaskDialogProps> = ({ task, isOpen, onClose, onAddComment, teamMembers = [] }) => {
  const [newComment, setNewComment] = useState('');

  if (!task) return null;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(task.id, newComment);
      setNewComment('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="outline" className="mb-2">
                {task.id}
              </Badge>
              <DialogTitle className="text-xl font-semibold">{task.title}</DialogTitle>
            </div>
            <Badge className={
              task.priority === 'high' ? 'bg-red-500' :
              task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
            }>
              {task.priority}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>Assigned to {task.assignee.name}</span>
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">{task.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments
            </h3>

            <div className="space-y-4">
              {task.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 text-sm">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.avatar} />
                    <AvatarFallback>
                      {comment.user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.user.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="mt-1">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmitComment} className="space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={!newComment.trim()}>
                  Add Comment
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
