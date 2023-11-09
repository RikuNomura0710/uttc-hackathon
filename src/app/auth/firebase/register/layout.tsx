'use client';

import { GuestGuard } from 'src/auth/guard';
import AuthModernLayout from 'src/layouts/auth/modern';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <AuthModernLayout>{children}</AuthModernLayout>
    </GuestGuard>
  );
}
