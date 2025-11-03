import { db } from "@/lib/db";
import { posts, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { SafeUser } from "@/lib/db/types";

export async function getAllPosts() {
  // Add explicit orderBy to get newest first
  return await db.select().from(posts).orderBy(desc(posts.createdAt));
}

export async function getPostsWithAuthors() {
  const result = await db
    .select({
      // Post fields
      id: posts.id,
      title: posts.title,
      content: posts.content,
      authorId: posts.authorId,
      likeCount: posts.likeCount,
      createdAt: posts.createdAt,
      // Author fields (excluding hashedPassword)
      authorId_user: users.id,
      authorUsername: users.username,
      authorCreatedAt: users.createdAt,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .orderBy(desc(posts.createdAt));

  // match expected structure with SafeUser
  return result.map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    authorId: row.authorId,
    likeCount: row.likeCount,
    createdAt: row.createdAt,
    author: row.authorId_user
      ? ({
          id: row.authorId_user,
          username: row.authorUsername!,
          createdAt: row.authorCreatedAt!,
        } as SafeUser)
      : null,
  }));
}
