import { z } from "zod";

const scoreSchema = z.object({
  beatmap_id: z.string(),
  highest_combo: z.coerce.number().min(1).max(2000).int(),
});

export default scoreSchema;
