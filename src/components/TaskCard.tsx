
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { AlertCircle, Bug, Calendar, CheckCircle, Clock, MessageSquare, Trash2 } from 'lucide-react';
import React from 'react';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    type?: string;
    assignee: {
      name: string;
      avatar?: string;
    };
    comments: any[];
  };
  onClick: () => void;
  onDelete?: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onDelete }) => {
  const getTaskTypeIcon = () => {
    switch (task.type) {
      case 'bug':
        return <Bug className="h-3 w-3 mr-1" />;
      case 'feature':
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'enhancement':
        return <AlertCircle className="h-3 w-3 mr-1" />;
      case 'task':
      default:
        return <Clock className="h-3 w-3 mr-1" />;
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
    <Card 
      className="mb-3 cursor-pointer hover:shadow-md transition-shadow bg-white hover:border-primary"
      onClick={onClick}
    >
      <CardHeader className="p-3 pb-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="mb-1">
              {task.id}
            </Badge>
            {task.type && (
              <Badge className={getTaskTypeBadgeColor()}>
                {getTaskTypeIcon()}
                {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
              </Badge>
            )}
          </div>
          <Badge className={
            task.priority === 'high' ? 'bg-red-500' :
            task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
          }>
            {task.priority}
          </Badge>
        </div>
        <h3 className="text-sm font-medium mt-1">{task.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="flex items-center text-xs text-muted-foreground mt-2">
          <Calendar className="mr-1 h-3 w-3" />
          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between">
        <div className="flex items-center gap-1">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-[10px]">
              {task.assignee.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center text-xs text-muted-foreground">
            <MessageSquare className="h-3 w-3 mr-1" />
            {task.comments.length}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-primary">Click for details</div>
          {onDelete && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the card's onClick
                onDelete(task.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
