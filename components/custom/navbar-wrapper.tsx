"use client";

import { usePathname } from 'next/navigation';
import getServerSession from 'next-auth';
import { Navbar } from './navbar';
import { authConfig } from '@/app/(auth)/auth.config';

export async function NavbarWrapper() {
  const pathname = usePathname();
  const isLandingPage = pathname === '/landing-page';
  const session = await getServerSession(authConfig);

  if (isLandingPage) {
    return null;
  }

  return <Navbar session={session} />;
}
