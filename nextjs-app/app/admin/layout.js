'use client';

import { AuthProvider } from '@/components/AuthContext';

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
