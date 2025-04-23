
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string
  type: 'deadline' | 'meeting' | 'milestone';
  relatedTaskId?: string;
  assignedTo?: string;
}

interface ProjectCalendarProps {
  events: CalendarEvent[];
  teamMembers: Array<{id: string; name: string; email: string}>;
  tasks: Array<{id: string; title: string}>;
  onAddEvent: (event: CalendarEvent) => void;
}

const ProjectCalendar: React.FC<ProjectCalendarProps> = ({ 
  events, 
  teamMembers,
  tasks, 
  onAddEvent 
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  // Custom styles for days with events
  const modifiers = {
    eventDay: (date: Date) => 
      events.some(event => isSameDay(date, parseISO(event.date)))
  };

  const modifiersStyles = {
    eventDay: { 
      fontWeight: 'bold',
      border: '2px solid',
      borderColor: 'var(--primary)'
    }
  };

  // Get events for the selected date
  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(date, parseISO(event.date)));
  };

  // Navigate between months
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Selected day's events
  const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedEvent(null);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const eventTypeColors = {
    deadline: 'bg-red-100 text-red-800 border-red-300',
    meeting: 'bg-blue-100 text-blue-800 border-blue-300',
    milestone: 'bg-green-100 text-green-800 border-green-300',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Calendar</h2>
        <AddEventDialog 
          teamMembers={teamMembers}
          tasks={tasks}
          onAddEvent={onAddEvent}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="bg-background border-b flex flex-row items-center justify-between p-4">
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={prevMonth}
                className="mr-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-lg">
                {format(currentMonth, 'MMMM yyyy')}
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={nextMonth}
                className="ml-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              month={currentMonth}
              className="p-3 pointer-events-auto"
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
            />
          </CardContent>
        </Card>
        
        {/* Day view with events */}
        <Card className="lg:col-span-1 overflow-auto" style={{ maxHeight: '500px' }}>
          <CardHeader className="bg-background border-b p-4">
            <CardTitle className="text-md">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {selectedDayEvents.length > 0 ? (
              selectedDayEvents.map(event => (
                <div 
                  key={event.id}
                  className={`p-3 border rounded-md cursor-pointer transition-all hover:shadow-md ${eventTypeColors[event.type]}`}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{event.title}</h3>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                  {event.description && (
                    <p className="text-sm mt-1 line-clamp-2">{event.description}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {selectedDate 
                  ? 'No events for this day' 
                  : 'Select a date to view events'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Event detail dialog */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedEvent.title}</span>
                <Badge>{selectedEvent.type}</Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label className="text-muted-foreground">Date</Label>
                <p>{format(parseISO(selectedEvent.date), 'MMMM d, yyyy')}</p>
              </div>
              
              {selectedEvent.description && (
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1">{selectedEvent.description}</p>
                </div>
              )}
              
              {selectedEvent.relatedTaskId && (
                <div>
                  <Label className="text-muted-foreground">Related Task</Label>
                  <p className="mt-1">
                    {tasks.find(t => t.id === selectedEvent.relatedTaskId)?.title || selectedEvent.relatedTaskId}
                  </p>
                </div>
              )}
              
              {selectedEvent.assignedTo && (
                <div>
                  <Label className="text-muted-foreground">Assigned To</Label>
                  <p className="mt-1">
                    {teamMembers.find(m => m.id === selectedEvent.assignedTo)?.name || selectedEvent.assignedTo}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

const AddEventDialog: React.FC<{ 
  teamMembers: Array<{id: string; name: string; email: string}>,
  tasks: Array<{id: string; title: string}>,
  onAddEvent: (event: CalendarEvent) => void 
}> = ({ teamMembers, tasks, onAddEvent }) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      type: 'deadline',
      relatedTaskId: '',
      assignedTo: ''
    }
  });

  const handleSubmit = (data: any) => {
    if (!selectedDate) {
      toast({
        variant: "destructive",
        title: "Date required",
        description: "Please select a date for this event",
      });
      return;
    }

    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: data.title,
      description: data.description,
      date: selectedDate.toISOString(),
      type: data.type,
      relatedTaskId: data.relatedTaskId || undefined,
      assignedTo: data.assignedTo || undefined
    };

    onAddEvent(newEvent);
    setOpen(false);
    form.reset();
    setSelectedDate(new Date());
    
    toast({
      title: "Event added",
      description: "Your event has been added to the calendar",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Calendar Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
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
              <Label>Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="p-0 pointer-events-auto border rounded-md"
                initialFocus
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Event Type</Label>
              <Select 
                onValueChange={(value) => form.setValue('type', value)} 
                defaultValue="deadline"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="milestone">Milestone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="relatedTaskId">Related Task (Optional)</Label>
              <Select 
                onValueChange={(value) => form.setValue('relatedTaskId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select related task" />
                </SelectTrigger>
                <SelectContent>
                  {tasks.map(task => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To (Optional)</Label>
              <Select 
                onValueChange={(value) => form.setValue('assignedTo', value)} 
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="submit">Create Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCalendar;
