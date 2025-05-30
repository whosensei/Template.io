"use client"

import React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  jobRole: z.string().min(1, 'Job role is required').max(100, 'Job role cannot exceed 100 characters'),
  companyName: z.string().min(1, 'Company name is required').max(100, 'Company name cannot exceed 100 characters'),
  recipientTitle: z.string().min(1, 'Recipient title is required'),
  customTitle: z.string().optional(),
})

export type JobApplicationFormValues = z.infer<typeof formSchema>

interface JobApplicationFormProps {
  defaultValues?: Partial<JobApplicationFormValues>
  onSubmit: (values: JobApplicationFormValues) => void
  className?: string
}

export function JobApplicationForm({
  defaultValues = {},
  onSubmit,
  className
}: JobApplicationFormProps) {
  const form = useForm<JobApplicationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobRole: '',
      companyName: '',
      recipientTitle: 'Sir',
      customTitle: '',
      ...defaultValues
    }
  })
  
  const watchRecipientTitle = form.watch('recipientTitle')
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="jobRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Role</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Software Engineer" {...field} />
                </FormControl>
                <FormDescription>
                  The position you are applying for
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Acme Inc." {...field} />
                </FormControl>
                <FormDescription>
                  The company you are applying to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="recipientTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient Title</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a title" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Sir">Sir</SelectItem>
                    <SelectItem value="Madam">Madam</SelectItem>
                    <SelectItem value="Hiring Manager">Hiring Manager</SelectItem>
                    <SelectItem value="Recruitment Team">Recruitment Team</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  How you will address the recipient
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {watchRecipientTitle === 'Custom' && (
            <FormField
              control={form.control}
              name="customTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dr. Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <Button type="submit" className="w-full mt-2">
            Apply to Email Template
          </Button>
        </div>
      </form>
    </Form>
  )
}