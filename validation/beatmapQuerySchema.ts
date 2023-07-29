import { z } from "zod";

const beatmapQuerySchema = z.object({
  dif: z.coerce.number().int().min(1).optional().catch(undefined),
  att: z.coerce.number().int().min(1).optional().catch(undefined),
  grp: z.coerce.number().int().min(1).optional().catch(undefined),
});

export default beatmapQuerySchema;
