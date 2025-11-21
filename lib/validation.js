import { z } from 'zod';

// User validation schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// Chat interaction validation schemas
export const chatInteractionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['active', 'archived']).default('active'),
  user_id: z.string().uuid('Invalid user ID')
});

export const updateChatInteractionSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'archived']).optional()
});

// Validation utility functions
export const validateRegisterInput = (data) => {
  return registerSchema.safeParse(data);
};

export const validateLoginInput = (data) => {
  return loginSchema.safeParse(data);
};

export const validateChatInteractionInput = (data) => {
  return chatInteractionSchema.safeParse(data);
};

export const validateUpdateChatInteractionInput = (data) => {
  return updateChatInteractionSchema.safeParse(data);
};