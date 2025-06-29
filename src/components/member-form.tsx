"use client"

import { format } from "date-fns";
import { Calendar as CalendarIcon, User, ImageUp } from "lucide-react";
import { type UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { SubscriptionType, SubscriptionStatus } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(1, 'Member name is required'),
  birthday: z.date({ required_error: "A birth date is required." }),
  profileImageUrl: z.string().url('Invalid URL').optional(),
  subscriptionType: z.enum(['Weekly', 'Monthly', 'Yearly']),
  subscriptionStatus: z.enum(['Active', 'Inactive', 'Expired']),
});

type MemberFormProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isEditing: boolean;
};

const subscriptionTypes: SubscriptionType[] = ['Weekly', 'Monthly', 'Yearly'];
const subscriptionStatuses: SubscriptionStatus[] = ['Active', 'Inactive', 'Expired'];

export function MemberForm({ form, onSubmit, isEditing }: MemberFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Member" : "Create New Member"}</CardTitle>
            <CardDescription>Fill in the details for the club member.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <FormField
                control={form.control}
                name="profileImageUrl"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <div className='flex items-center gap-4'>
                        <div className='w-24 h-24 border-2 border-dashed rounded-full flex items-center justify-center bg-muted/50'>
                            <ImageUp className='h-8 w-8 text-muted-foreground' />
                        </div>
                        <div className='flex-1'>
                            <FormControl>
                                <Input placeholder="https://your-image-url.com/profile.png" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormDescription>Enter a public URL for the profile picture.</FormDescription>
                        </div>
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Alex Johnson" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="birthday"
                    render={({ field }) => (
                        <FormItem className="flex flex-col pt-2">
                        <FormLabel>Date of Birth</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
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
                                disabled={(date) => date > new Date()}
                                initialFocus
                                captionLayout="dropdown-buttons"
                                fromYear={1930}
                                toYear={new Date().getFullYear()}
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="subscriptionType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subscription Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {subscriptionTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="subscriptionStatus"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subscription Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {subscriptionStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
             </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset
            </Button>
            <Button type="submit">{isEditing ? 'Save Changes' : 'Create Member'}</Button>
        </div>
      </form>
    </Form>
  );
}
