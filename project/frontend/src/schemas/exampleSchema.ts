import { z } from 'zod';

export const exampleSchema = z.object({
  name: z.string().min(2, 'O nome deve ter ao menos 2 caracteres'),
  email: z.string().email('Digite um email válido'),
});

export type ExampleSchema = z.infer<typeof exampleSchema>;
