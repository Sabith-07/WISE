import { z } from 'zod';

export const fakeCallFormSchema = z.object({
  callerId: z.string()
    .min(1, { message: "Caller ID is required." })
    .max(30, { message: "Caller ID must be 30 characters or less." }),
  preRecordedMessage: z.string()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(300, { message: "Message must be 300 characters or less." }),
});

export type FakeCallFormValues = z.infer<typeof fakeCallFormSchema>;
