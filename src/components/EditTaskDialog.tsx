
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Bug, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EditTaskDialogProps {
  task: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: any) => void;
  teamMembers?: {id: string; name: string; email: string}[];
}

const EditTaskDialog = ({ task, isOpen, onClose, onSave, teamMembers = [] }: EditTaskDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    task.dueDate ? new Date(task.dueDate) : new Date()
  );
  const [customAssignee, setCustomAssignee] = useState('');
  const [isCustomAssignee, setIsCustomAssignee] = useState(false);
  
  const form = useForm({
    defaultValues: {
      title: task.title || '',
      description: task.description || '',
      assignee: task.assignee?.id || 'unassigned',
      priority: task.priority || 'medium',
      type: task.type || 'task'
    },
  });

  useEffect(() => {
    if (task && isOpen) {
      form.reset({
        title: task.title || '',
        description: task.description || '',
        assignee: task.assignee?.id || 'unassigned',
        priority: task.priority || 'medium',
        type: task.type || 'task'
      });
      
      setSelectedDate(task.dueDate ? new Date(task.dueDate) : new Date());
      
      if (task.assignee && !teamMembers.some(member => member.id === task.assignee.id)) {
        setIsCustomAssignee(true);
        setCustomAssignee(task.assignee.name || '');
      } else {
        setIsCustomAssignee(false);
        setCustomAssignee('');
      }
    }
  }, [task, isOpen, form, teamMembers]);

  const onSubmit = async (data) => {
    try {
      let assigneeData;
      
      if (isCustomAssignee && customAssignee) {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customAssignee);
        assigneeData = {
          id: task.assignee?.id || `custom-${Date.now()}`,
          name: isEmail ? customAssignee.split('@')[0] : customAssignee,
          email: isEmail ? customAssignee : null,
          avatar: null,
        };
      } else {
        const selectedAssignee = data.assignee === "unassigned" 
          ? null 
          : teamMembers.find(member => member.id === data.assignee);
        
        assigneeData = selectedAssignee 
          ? {
              id: selectedAssignee.id,
              name: selectedAssignee.name,
              avatar: null,
            }
          : {
              id: 'unassigned',
              name: 'Unassigned',
              avatar: null,
            };
      }

      const updatedTask = {
        ...task,
        title: data.title,
        description: data.description,
        priority: data.priority || 'medium',
        type: data.type || 'task',
        dueDate: selectedDate ? selectedDate.toISOString().split('T')[0] : null,
        assignee: assigneeData
      };
      
      onSave(updatedTask);
      onClose();
      toast({
        title: "Task updated",
        description: "Task has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...form.register('title', { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select onValueChange={(value) => form.setValue('type', value)} defaultValue={form.getValues('type')}>
              <SelectTrigger>
                <SelectValue placeholder="Select task type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="task">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-amber-500" />
                    Task
                  </div>
                </SelectItem>
                <SelectItem value="bug">
                  <div className="flex items-center">
                    <Bug className="h-4 w-4 mr-2 text-red-500" />
                    Bug
                  </div>
                </SelectItem>
                <SelectItem value="feature">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Feature
                  </div>
                </SelectItem>
                <SelectItem value="enhancement">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                    Enhancement
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select onValueChange={(value) => form.setValue('priority', value)} defaultValue={form.getValues('priority')}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignee">Assign To</Label>
            {isCustomAssignee ? (
              <div className="space-y-2">
                <Input
                  placeholder="Enter email or name"
                  value={customAssignee}
                  onChange={(e) => setCustomAssignee(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCustomAssignee(false)}
                >
                  Back to Team List
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Select onValueChange={(value) => form.setValue('assignee', value)} defaultValue={form.getValues('assignee')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {teamMembers.map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCustomAssignee(true)}
                >
                  Assign by Email/Name
                </Button>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;
