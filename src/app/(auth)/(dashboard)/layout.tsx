import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Teacher Portal',
  description: 'Teacher workspace overview and daily schedule',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}