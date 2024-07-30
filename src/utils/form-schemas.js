import { z } from "zod";

export const smsFormModalSchema = z.object({
  email: z.string().email(),
  description: z.string().min(20),
  incidentType: z.object(),
});