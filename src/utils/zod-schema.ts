import { z } from "zod";

export const PostPhotosSchema = z
  .array(
    z
      .object({
        img: z.string().url().endsWith(".webp"),
        title: z.array(z.string().min(1)),
        subTitle: z.array(z.string().min(1)),
        captionText: z.string().nullable(),
        credit: z.string().nullable(),
      })
      .strict(),
  )
  .nonempty();

export const PostSchema = z
  .object({
    id: z.number(),
    header: z.string().min(1),
    subtitle: z.string().min(1).nullable(),
    date: z.date().or(z.string().datetime()),
    dateString: z.string().min(1),
    currentLink: z.string().url(),
    nextLink: z.string().url().nullable(),
    photosWithMeta: PostPhotosSchema,
    createdAt: z.date().nullable().or(z.string().datetime().nullable()),
    updatedAt: z.date().nullable().or(z.string().datetime().nullable()),
  })
  .strict();

export const PostsSchema = z.array(PostSchema);

export type PostsSchemaType = z.infer<typeof PostsSchema>;
