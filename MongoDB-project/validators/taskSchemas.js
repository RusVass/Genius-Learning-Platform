import { z } from 'zod';

export const createTaskSchema = z.object({
    description: z.string().min(1).max(500),
});

export const updateTaskSchema = z.object({
    description: z.string().min(1).max(500).optional(),
    completed: z.boolean().optional(),
});
