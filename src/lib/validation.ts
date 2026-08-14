import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email"),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(2000),
  // Honeypot: real users never fill this in; bots often do.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
