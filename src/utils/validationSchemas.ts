import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  organizationId: z.number().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const organizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required').max(50, 'Organization name cannot exceed 50 characters'),
  description: z.string().optional(),
});


export const integrationConfigSchema = z.object({
  integrationType: z.string(),
  apiToken: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OrganizationInput = z.infer<typeof organizationSchema>;
export type IntegrationConfigInput = z.infer<typeof integrationConfigSchema>;