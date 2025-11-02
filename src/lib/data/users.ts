import { db } from "@/lib/db";
import { users, posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getUserById(userId: number) {
  // Validate userId is a positive integer
  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return user;
}

export async function getUserWithPosts(userId: number) {
  // Validate userId is a positive integer
  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  const user = await getUserById(userId);
  if (!user) return null;

  const userPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.authorId, userId));

  return {
    ...user,
    posts: userPosts,
  };
}
