'use client';

import { useCurrentUser } from '@/hooks/use-current-user';

export function UserProfile() {
  const {
    data: user,
    isPending,
    isError,
  } = useCurrentUser();

  if (isPending) {
    return (
      <p className="text-muted-foreground">
        Loading user...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-destructive">
        Unable to load user.
      </p>
    );
  }

  return (
    <div>
      <p className="font-medium">
        {user.email}
      </p>
    </div>
  );
}