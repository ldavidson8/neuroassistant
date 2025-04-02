import { z } from 'zod';

const timetableEventSchema = z.object({
  topIdx: z.number(),
  slotInDay: z.number(),
  time: z.string(),
  day: z.string(),
  title: z.string(),
  startDateString: z.string(),
  endDateString: z.string(),
});

export type TimetableEvent = z.infer<typeof timetableEventSchema>;
