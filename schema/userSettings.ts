import { currencies } from "@/lib/currency";
import { z } from "zod";

export const updateUserCurrencySchema = z.object({
  currency: z.custom((value) => {
    const found = currencies.some((c) => c.value === value);
    if (!found) {
      throw new Error(`Invalid currency ${value}`);
    }

    return value;
  }),
});
