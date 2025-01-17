import { z } from "zod";

const itemSchema = z.object({
  amount: z.number(),
  description: z.string(),
  flags: z.string().nullable(),
  qty: z.number(),
  unitPrice: z.number().nullable(),
});

const receiptSchema = z.object({
  merchantName: z.string(),
  merchantAddress: z.string().nullable(),
  merchantPhone: z.string().nullable(),
  merchantWebsite: z.string().nullable(),
  receiptNo: z.string(),
  date: z.string(),
  time: z.string().nullable(),
  items: z.array(itemSchema),
  currency: z.string(),
  total: z.number(),
  subtotal: z.number(),
  tax: z.number().nullable(),
  serviceCharge: z.string().nullable(),
  tip: z.number().nullable(),
});

export default receiptSchema;
