"use client";

import { SafeUser } from "@/lib/db/types";
import { memo, useMemo } from "react";

interface UserProfileProps {
  user: SafeUser;
}

function UserProfileComponent({ user }: UserProfileProps) {
  const formattedDate = useMemo(
    () => new Date(user.createdAt).toLocaleDateString(),
    [user.createdAt]
  );

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900">{user.username}</h3>
          <p className="text-sm text-gray-500">Member since {formattedDate}</p>
        </div>
      </div>
    </div>
  );
}

export const UserProfile = memo(UserProfileComponent);
