import { z } from 'zod';

export const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

export const brandingSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'Mindestens 2 Zeichen erforderlich')
    .max(100, 'Maximal 100 Zeichen erlaubt'),
  domain: z.string()
    .trim()
    .regex(domainRegex, 'Bitte geben Sie eine gültige Domain ein (z.B. example.com)'),
  email: z.string()
    .trim()
    .email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  primary_color: z.string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Ungültiger Farbcode')
    .optional()
    .default('#6366f1'),
  logo_url: z.string().nullable().optional(),
  is_active: z.boolean().optional().default(true),
  default_language: z.enum(['de', 'en']).optional().default('de'),
});

export type BrandingFormData = z.infer<typeof brandingSchema>;
