"use client";

import { Post } from "@/lib/db/types";
import { use, memo, useMemo } from "react";

interface PrefetchedPostsProps {
  postsPromise: Promise<Post[]>;
}

function PrefetchedPostsComponent({ postsPromise }: PrefetchedPostsProps) {
  const posts = use(postsPromise);

  const latestPosts = useMemo(() => posts.slice(0, 5), [posts]);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Latest Posts</h3>
      {latestPosts.map((post) => (
        <PostSummary key={post.id} post={post} />
      ))}
    </div>
  );
}

const PostSummary = memo(({ post }: { post: Post }) => {
  const formattedDate = useMemo(
    () => new Date(post.createdAt).toLocaleDateString(),
    [post.createdAt]
  );

  return (
    <div className="p-3 bg-gray-50 rounded-md">
      <h4 className="font-medium text-gray-900">{post.title}</h4>
      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.content}</p>
      <div className="text-xs text-gray-500 mt-2">
        {post.likeCount} likes • {formattedDate}
      </div>
    </div>
  );
});

PostSummary.displayName = "PostSummary";

export const PrefetchedPosts = memo(PrefetchedPostsComponent);
