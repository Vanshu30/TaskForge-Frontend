
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

interface AddTaskDialogProps {
  projectId: string;
  onAddTask: (task: any) => void;
}

const AddTaskDialog = ({ projectId, onAddTask }: AddTaskDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      // TODO: Add Supabase integration here
      const newTask = {
        id: `task-${Date.now()}`,
        title: data.title,
        description: data.description,
        priority: 'medium',
        dueDate: new Date().toISOString(),
        assignee: {
          id: 'unassigned',
          name: 'Unassigned',
          avatar: null,
        },
        comments: [],
      };
      
      onAddTask(newTask);
      setOpen(false);
      form.reset();
      toast({
        title: "Task created",
        description: "New task has been added to To Do column",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
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
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
