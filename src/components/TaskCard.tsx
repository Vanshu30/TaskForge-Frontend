
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, MessageSquare, Bug } from 'lucide-react';

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
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
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
            {task.type === 'bug' && (
              <Badge className="bg-red-500">
                <Bug className="h-3 w-3 mr-1" />
                Bug
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
        <h3 className="text-sm font-medium">{task.title}</h3>
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
        <div className="text-xs text-primary">Click for details</div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
