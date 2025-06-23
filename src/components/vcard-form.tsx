"use client"

import React from 'react';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Linkedin, Twitter, Github, Globe, PlusCircle, Trash2, Instagram, Facebook, Palette, User, Phone, Link as LinkIcon, ImageUp, Repeat } from 'lucide-react';
import type { SocialNetwork } from '@/lib/types';

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  department: z.string().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  website: z.string().url('Invalid URL').optional(),
  address: z.string().optional(),
  profileImageUrl: z.string().url('Invalid URL').optional(),
  primaryColor: z.string().regex(hexColorRegex, 'Invalid hex color').optional(),
  secondaryColor: z.string().regex(hexColorRegex, 'Invalid hex color').optional(),
  socials: z.array(z.object({
    id: z.string(),
    network: z.enum(['website', 'linkedin', 'twitter', 'github', 'instagram', 'facebook']),
    url: z.string().url('Invalid URL'),
  })).optional(),
});

type VCardFormProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isEditing: boolean;
};

const socialIcons: Record<SocialNetwork, React.ComponentType<{ className?: string }>> = {
  linkedin: Linkedin,
  twitter: Twitter,
  github: Github,
  website: Globe,
  instagram: Instagram,
  facebook: Facebook,
};

const colorPalettes = [
  { name: 'Emerald', primary: '#042f2c', secondary: '#ffffff' },
  { name: 'Sapphire', primary: '#527AC9', secondary: '#7EC09F' },
  { name: 'Amethyst', primary: '#9b59b6', secondary: '#e8daef' },
  { name: 'Midnight', primary: '#2c3e50', secondary: '#ecf0f1' },
  { name: 'Gold', primary: '#f39c12', secondary: '#fdebcf' },
  { name: 'Graphite', primary: '#34495e', secondary: '#bdc3c7' },
];

export function VCardForm({ form, onSubmit, isEditing }: VCardFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'socials',
  });

  const swapColors = () => {
    const primary = form.getValues('primaryColor');
    const secondary = form.getValues('secondaryColor');
    form.setValue('primaryColor', secondary);
    form.setValue('secondaryColor', primary);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Accordion type="multiple" defaultValue={['design', 'personal-info']} className="w-full space-y-4">
          
          <AccordionItem value="design" className="border-none">
            <div className='p-6 border rounded-lg'>
              <AccordionTrigger className="py-0 hover:no-underline">
                <div className="flex items-center gap-4">
                  <Palette className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">Design</h3>
                    <p className="text-sm text-muted-foreground font-normal">Choose a color theme for your page.</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-6">
                <div className='space-y-4'>
                    <FormLabel>Color Palette</FormLabel>
                    <div className="flex flex-wrap gap-2">
                        {colorPalettes.map(palette => (
                            <button key={palette.name} type="button" onClick={() => {
                                form.setValue('primaryColor', palette.primary);
                                form.setValue('secondaryColor', palette.secondary);
                            }}
                            className="flex items-center gap-2 p-2 border rounded-md hover:border-primary"
                            >
                                <div style={{ backgroundColor: palette.primary }} className="h-6 w-6 rounded-sm"></div>
                                <div style={{ backgroundColor: palette.secondary }} className="h-6 w-6 rounded-sm border"></div>
                            </button>
                        ))}
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-center'>
                        <FormField
                            control={form.control}
                            name="primaryColor"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Primary Color</FormLabel>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 border rounded-md">
                                        <div style={{ backgroundColor: field.value }} className="h-6 w-6 rounded-sm" />
                                    </div>
                                    <Input {...field} />
                                </div>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='button' variant='ghost' size='icon' onClick={swapColors} className='mt-5 hidden md:block'>
                            <Repeat className='h-5 w-5' />
                        </Button>
                        <FormField
                            control={form.control}
                            name="secondaryColor"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Secondary Color</FormLabel>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 border rounded-md">
                                        <div style={{ backgroundColor: field.value }} className="h-6 w-6 rounded-sm border" />
                                    </div>
                                    <Input {...field} />
                                </div>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
              </AccordionContent>
            </div>
          </AccordionItem>

          <AccordionItem value="personal-info" className="border-none">
            <div className='p-6 border rounded-lg'>
                <AccordionTrigger className="py-0 hover:no-underline">
                <div className="flex items-center gap-4">
                    <User className="h-5 w-5 text-primary" />
                    <div>
                        <h3 className="font-semibold text-lg">Personal Information</h3>
                        <p className="text-sm text-muted-foreground font-normal">Fill in your information.</p>
                    </div>
                </div>
                </AccordionTrigger>
                <AccordionContent className="pt-6 space-y-4">
                    <FormField
                        control={form.control}
                        name="profileImageUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Image</FormLabel>
                            <div className='flex items-center gap-4'>
                                <div className='w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50'>
                                    <ImageUp className='h-8 w-8 text-muted-foreground' />
                                </div>
                                <div className='flex-1'>
                                    <FormControl>
                                        <Input placeholder="https://your-image-url.com/profile.png" {...field} />
                                    </FormControl>
                                    <FormDescription>Enter a public URL for your profile picture.</FormDescription>
                                </div>
                            </div>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="firstName" render={({ field }) => ( <FormItem><FormLabel>First Name *</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={form.control} name="lastName" render={({ field }) => ( <FormItem><FormLabel>Last Name *</FormLabel><FormControl><Input placeholder="Carlson" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                    <FormField control={form.control} name="jobTitle" render={({ field }) => (<FormItem><FormLabel>Job Title</FormLabel><FormControl><Input placeholder="Account Manager" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="company" render={({ field }) => (<FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="Innovate Inc." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="department" render={({ field }) => (<FormItem><FormLabel>Department</FormLabel><FormControl><Input placeholder="Sales" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="bio" render={({ field }) => (<FormItem><FormLabel>Bio</FormLabel><FormControl><Textarea placeholder="A short description about you or your work..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                </AccordionContent>
            </div>
          </AccordionItem>

          <AccordionItem value="contact-details" className="border-none">
            <div className='p-6 border rounded-lg'>
                <AccordionTrigger className="py-0 hover:no-underline">
                <div className="flex items-center gap-4">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                        <h3 className="font-semibold text-lg">Contact Details</h3>
                        <p className="text-sm text-muted-foreground font-normal">How people can reach you.</p>
                    </div>
                </div>
                </AccordionTrigger>
                <AccordionContent className="pt-6 space-y-4">
                    <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+1 123 456 7890" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="jane.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="website" render={({ field }) => (<FormItem><FormLabel>Website</FormLabel><FormControl><Input placeholder="https://your-website.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="123 Main St, Anytown" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </AccordionContent>
            </div>
          </AccordionItem>

          <AccordionItem value="social-links" className="border-none">
            <div className='p-6 border rounded-lg'>
                <AccordionTrigger className="py-0 hover:no-underline">
                <div className="flex items-center gap-4">
                    <LinkIcon className="h-5 w-5 text-primary" />
                    <div>
                        <h3 className="font-semibold text-lg">Social Links</h3>
                        <p className="text-sm text-muted-foreground font-normal">Add links to your social media profiles.</p>
                    </div>
                </div>
                </AccordionTrigger>
                <AccordionContent className="pt-6 space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-end gap-2 p-4 border rounded-md relative">
                            <FormField control={form.control} name={`socials.${index}.network`} render={({ field }) => ( <FormItem className="w-1/3"> <FormLabel>Network</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select network" /> </SelectTrigger> </FormControl> <SelectContent> {Object.keys(socialIcons).map(network => ( <SelectItem key={network} value={network}> <div className="flex items-center gap-2"> {React.createElement(socialIcons[network as SocialNetwork], { className: "w-4 h-4" })} <span>{network.charAt(0).toUpperCase() + network.slice(1)}</span> </div> </SelectItem> ))} </SelectContent> </Select> <FormMessage /> </FormItem> )} />
                            <FormField control={form.control} name={`socials.${index}.url`} render={({ field }) => ( <FormItem className="flex-1"> <FormLabel>URL</FormLabel> <FormControl> <Input placeholder="https://..." {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}> <Trash2 className="h-4 w-4 text-destructive" /> </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => append({ id: new Date().toISOString(), network: 'website', url: '' })} className='w-full' > <PlusCircle className="mr-2 h-4 w-4" /> Add Social Link </Button>
                </AccordionContent>
            </div>
          </AccordionItem>
        </Accordion>
        
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset
            </Button>
            <Button type="submit">{isEditing ? 'Save Changes' : 'Create Card'}</Button>
        </div>
      </form>
    </Form>
  );
}
