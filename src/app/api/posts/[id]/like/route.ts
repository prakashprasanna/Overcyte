import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/utils";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

// use zod to validate
const likePayloadSchema = z.object({
  action: z.enum(["like", "unlike"]),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const postId = parseInt(resolvedParams.id);

    if (isNaN(postId) || postId <= 0) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const body = await request.json();
    const validated = likePayloadSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validated.error.issues },
        { status: 400 }
      );
    }

    // Use validated.data instead of body to ensure type safety
    let updatedPost;
    if (validated.data.action === "like") {
      // use returning() to get updated row 
      [updatedPost] = await db
        .update(posts)
        .set({
          likeCount: sql`${posts.likeCount} + 1`,
        })
        .where(eq(posts.id, postId))
        .returning();
    } else {
      [updatedPost] = await db
        .update(posts)
        .set({
          likeCount: sql`CASE WHEN ${posts.likeCount} > 0 THEN ${posts.likeCount} - 1 ELSE 0 END`,
        })
        .where(eq(posts.id, postId))
        .returning();
    }

    return NextResponse.json({
      success: true,
      post: updatedPost,
      message: `Post ${validated.data.action}d successfully`,
    });
  } catch (error) {
    console.error("Like/unlike error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
