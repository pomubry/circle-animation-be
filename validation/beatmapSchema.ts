import { z } from "zod";

const noteSchema = z.object({
  timing_sec: z.coerce.number().min(0),
  notes_attribute: z.coerce.number().int().min(1).max(3),
  notes_level: z.coerce.number().int().min(1),
  effect: z.coerce.number().min(1),
  effect_value: z.coerce.number().gt(0),
  position: z.coerce.number().int().min(1).max(9),
});

export const beatmapSchema = z.object({
  song_name: z.string().max(100),
  difficulty: z.coerce.number().int().min(1),
  combo_info: z.array(
    z.object({
      combo: z.coerce.number().int().min(1),
      combo_min: z.coerce.number().int().min(0),
      combo_max: z.coerce.number().int().min(0),
    })
  ),
  live_icon: z.string().max(100),
  code: z.string().max(10),
  rank_info: z.array(
    z.object({
      rank: z.coerce.number().int().min(1),
      rank_min: z.coerce.number().int().min(0),
      rank_max: z.coerce.number().int().min(0),
    })
  ),
  song_info: z.array(
    z.object({
      member_category: z.coerce.number().int().min(1),
      star: z.coerce.number().int().min(1),
      notes: z.array(noteSchema),
    })
  ),
});
