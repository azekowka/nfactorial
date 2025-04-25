'use client';

import { UserButton } from '@clerk/nextjs';

export function User() {
  return (
    <UserButton 
      afterSignOutUrl="/"
      appearance={{
        elements: {
          userButtonAvatarBox: "h-9 w-9 rounded-full overflow-hidden border border-gray-200",
        }
      }}
    />
  );
}
