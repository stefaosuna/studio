
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Linkedin, Twitter, Github, Globe, PlusCircle, Trash2, Instagram, Facebook, Palette, User, Phone, Link as LinkIcon, ImageUp, Repeat, Mail, MapPin, CreditCard } from 'lucide-react';
import type { SocialNetwork, VCardSubscription } from '@/lib/types';

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  department: z.string().optional(),
  bio: z.string().optional(),
  bioSize: z.enum(['sm', 'base', 'lg']).optional(),
  phones: z.array(z.object({ id: z.string(), value: z.string().min(1, 'Phone cannot be empty.') })).optional(),
  emails: z.array(z.object({ id: z.string(), value: z.string().email('Invalid email address.') })).optional(),
  websites: z.array(z.object({ id: z.string(), value: z.string().url('Invalid URL.') })).optional(),
  addresses: z.array(z.object({ id: z.string(), value: z.string().min(1, 'Address cannot be empty.') })).optional(),
  profileImageUrl: z.string().url('Invalid URL').optional(),
  primaryColor: z.string().regex(hexColorRegex, 'Invalid hex color').optional(),
  secondaryColor: z.string().regex(hexColorRegex, 'Invalid hex color').optional(),
  socials: z.array(z.object({
    id: z.string(),
    network: z.enum(['website', 'linkedin', 'twitter', 'github', 'instagram', 'facebook']),
    url: z.string().url('Invalid URL'),
  })).optional(),
  subscription: z.enum(['Basic', 'Top', 'Enterprise']),
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
  { name: 'Proxity Purple', primary: '#4a00e0', secondary: '#FFFFFF' },
  { name: 'Midnight Blue', primary: '#2c3e50', secondary: '#f8f9fa' },
  { name: 'Forest Green', primary: '#042f2c', secondary: '#f8f9fa' },
  { name: 'Royal Purple', primary: '#9b59b6', secondary: '#f8f9fa' },
  { name: 'Sunset Orange', primary: '#d35400', secondary: '#f8f9fa' },
  { name: 'Charcoal', primary: '#34495e', secondary: '#f8f9fa' },
];

const subscriptionTypes: VCardSubscription[] = ['Basic', 'Top', 'Enterprise'];

export function VCardForm({ form, onSubmit, isEditing }: VCardFormProps) {
  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({
    control: form.control,
    name: 'socials',
  });
  const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({ control: form.control, name: 'phones' });
  const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({ control: form.control, name: 'emails' });
  const { fields: websiteFields, append: appendWebsite, remove: removeWebsite } = useFieldArray({ control: form.control, name: 'websites' });
  const { fields: addressFields, append: appendAddress, remove: removeAddress } = useFieldArray({ control: form.control, name: 'addresses' });

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
                            <FormLabel>Header Color</FormLabel>
                            <div className="flex items-center gap-2">
                                <input type="color" {...field} className="h-10 w-10 p-0 rounded-md bg-transparent border-input border" />
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
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
                            <FormLabel>Background Color</FormLabel>
                            <div className="flex items-center gap-2">
                                <input type="color" {...field} className="h-10 w-10 p-0 rounded-md bg-transparent border-input border" />
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
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
                    <FormField
                        control={form.control}
                        name="bioSize"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio Font Size</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a font size" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="sm">Small</SelectItem>
                                        <SelectItem value="base">Medium</SelectItem>
                                        <SelectItem value="lg">Large</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="subscription"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subscription Plan</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a plan" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {subscriptionTypes.map(type => (
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
                <AccordionContent className="pt-6 space-y-6">
                  {/* Phone Numbers */}
                  <div className="space-y-2">
                    <FormLabel>Phone Numbers</FormLabel>
                    {phoneFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <FormField
                          control={form.control}
                          name={`phones.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input placeholder="+1 123 456 7890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removePhone(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => appendPhone({ id: new Date().toISOString(), value: '' })} className='w-full'>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Phone
                    </Button>
                  </div>

                  {/* Email Addresses */}
                  <div className="space-y-2">
                    <FormLabel>Email Addresses</FormLabel>
                    {emailFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <FormField control={form.control} name={`emails.${index}.value`} render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl><Input placeholder="jane.doe@example.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeEmail(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => appendEmail({ id: new Date().toISOString(), value: '' })} className='w-full'>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Email
                    </Button>
                  </div>

                  {/* Websites */}
                  <div className="space-y-2">
                    <FormLabel>Websites</FormLabel>
                    {websiteFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <FormField control={form.control} name={`websites.${index}.value`} render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl><Input placeholder="https://your-website.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeWebsite(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => appendWebsite({ id: new Date().toISOString(), value: '' })} className='w-full'>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Website
                    </Button>
                  </div>

                  {/* Addresses */}
                  <div className="space-y-2">
                    <FormLabel>Addresses</FormLabel>
                    {addressFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <FormField control={form.control} name={`addresses.${index}.value`} render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl><Input placeholder="123 Main St, Anytown" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeAddress(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => appendAddress({ id: new Date().toISOString(), value: '' })} className='w-full'>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Address
                    </Button>
                  </div>
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
                    {socialFields.map((field, index) => (
                        <div key={field.id} className="flex items-end gap-2 p-4 border rounded-md relative">
                            <FormField
                                control={form.control}
                                name={`socials.${index}.network`}
                                render={({ field }) => (
                                    <FormItem className="w-1/3">
                                        <FormLabel>Network</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select network" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.keys(socialIcons).map(network => (
                                                        <SelectItem key={network} value={network}>
                                                            <div className="flex items-center gap-2">
                                                                {React.createElement(socialIcons[network as SocialNetwork], { className: "w-4 h-4" })}
                                                                <span>{network.charAt(0).toUpperCase() + network.slice(1)}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`socials.${index}.url`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeSocial(index)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendSocial({ id: new Date().toISOString(), network: 'website', url: '' })} className='w-full' >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Social Link
                    </Button>
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
