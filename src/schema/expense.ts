import z from "zod";

const merchantSchema = z.object({
  name: z.string(),
  categoryName: z.string().nullable(),
  subCategoryName: z.string().nullable(),
});

const categorySchema = z.object({
  name: z.string(),
});

const subCategorySchema = z.object({
  name: z.string(),
  categoryName: z.string(),
});

export default { merchantSchema, categorySchema, subCategorySchema };
