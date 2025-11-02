import { db } from "@/lib/db";
import { posts, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getAllPosts() {
  // Add explicit orderBy to get newest first
  return await db.select().from(posts).orderBy(desc(posts.createdAt));
}

export async function getPostsWithAuthors() {
  return await db.query.posts.findMany({
    with: {
      author: true,
    },
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  });
}
