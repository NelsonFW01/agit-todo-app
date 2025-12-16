import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).default('pending')
})

export const updateTaskSchema = taskSchema.partial()