
"use client"

import { format } from "date-fns";
import { Calendar as CalendarIcon, Palette, DollarSign } from "lucide-react";
import { type UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import type { Event, PassType } from "@/lib/types";

const formSchema = z.object({
  eventId: z.string().min(1, 'Event is required'),
  eventName: z.string().min(1, 'Event name is required'),
  ownerName: z.string().min(1, 'Owner name is required'),
  eventDate: z.date({
    required_error: "An event date is required.",
  }),
  passType: z.enum(['VIP', 'Basic', 'Staff'], {
    required_error: "You need to select a pass type.",
  }),
  publicPrice: z.coerce.number().min(0, "Price must be non-negative").optional(),
  costPrice: z.coerce.number().min(0, "Cost must be non-negative").optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color').optional(),
});


type TicketFormProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isEditing: boolean;
  isEventContext: boolean;
  events: Event[];
};

const passTypes: PassType[] = ['Basic', 'VIP', 'Staff'];

const colorPalettes = [
  { name: 'Indigo', color: '#6366f1' },
  { name: 'Violet', color: '#8b5cf6' },
  { name: 'Emerald', color: '#10b981' },
  { name: 'Rose', color: '#f43f5e' },
  { name: 'Sky', color: '#0ea5e9' },
  { name: 'Amber', color: '#f59e0b' },
];

export function TicketForm({ form, onSubmit, isEditing, isEventContext, events }: TicketFormProps) {

  const handleEventChange = (eventId: string) => {
    const selectedEvent = events.find(event => event.id === eventId);
    if (selectedEvent) {
      form.setValue('eventId', selectedEvent.id);
      form.setValue('eventName', selectedEvent.name);
      form.setValue('eventDate', new Date(selectedEvent.date));
    }
  };

  const selectedEventId = form.watch('eventId');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Ticket Details</CardTitle>
            <CardDescription>{isEditing ? 'Update ticket details.' : 'Fill in the details to generate a new ticket.'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEventContext || isEditing ? (
                <FormField
                control={form.control}
                name="eventName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Firebase Dev Summit" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            ) : (
                <FormField
                    control={form.control}
                    name="eventId"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Event</FormLabel>
                        <Select onValueChange={handleEventChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select an event" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {events.map(event => (
                            <SelectItem key={event.id} value={event.id}>
                                {event.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Owner's Full Name</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g. Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="eventDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col pt-2">
                        <FormLabel>Event Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                disabled={isEventContext || isEditing || !!selectedEventId}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                isEventContext || isEditing || !!selectedEventId || date < new Date(new Date().setHours(0,0,0,0))
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="passType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Pass Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a pass type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {passTypes.map(type => (
                            <SelectItem key={type} value={type}>
                                {type}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="pricing" className="border-none">
             <div className='p-6 border rounded-lg'>
              <AccordionTrigger className="py-0 hover:no-underline">
                <div className="flex items-center gap-4">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">Pricing</h3>
                    <p className="text-sm text-muted-foreground font-normal">Set public price and internal cost.</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="publicPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Public Price ($)</FormLabel>
                        <FormControl>
                           <Input type="number" placeholder="e.g. 50.00" {...field} />
                        </FormControl>
                        <FormDescription>The price visible to the public. Set to 0 for free tickets.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="costPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ticket Cost ($)</FormLabel>
                        <FormControl>
                           <Input type="number" placeholder="e.g. 5.00" {...field} />
                        </FormControl>
                        <FormDescription>Your internal cost for this ticket. Not public.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </div>
          </AccordionItem>
          <AccordionItem value="design" className="border-none">
            <div className='p-6 border rounded-lg'>
              <AccordionTrigger className="py-0 hover:no-underline">
                <div className="flex items-center gap-4">
                  <Palette className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">Design</h3>
                    <p className="text-sm text-muted-foreground font-normal">Customize the ticket's appearance.</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-6">
                 <div className='space-y-4'>
                    <FormLabel>Color Palette</FormLabel>
                    <div className="flex flex-wrap gap-2">
                        {colorPalettes.map(palette => (
                            <button key={palette.name} type="button" onClick={() => {
                                form.setValue('color', palette.color);
                            }}
                            className="p-1 border-2 rounded-md hover:border-primary data-[active=true]:border-primary"
                            data-active={form.watch('color') === palette.color}
                            >
                                <div style={{ backgroundColor: palette.color }} className="h-8 w-8 rounded-sm"></div>
                            </button>
                        ))}
                    </div>
                    <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Custom Color</FormLabel>
                            <div className="flex items-center gap-2">
                                <input type="color" {...field} value={field.value || ''} className="h-10 w-10 p-1 rounded-md bg-transparent border-input border" />
                                <FormControl>
                                    <Input {...field} value={field.value || ''} placeholder="#6366f1" />
                                </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                </div>
              </AccordionContent>
            </div>
          </AccordionItem>
        </Accordion>
        
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset
            </Button>
            <Button type="submit">{isEditing ? 'Save Changes' : 'Create Ticket'}</Button>
        </div>
      </form>
    </Form>
  );
}
