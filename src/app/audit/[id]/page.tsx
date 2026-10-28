'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import ClientDashboard from '@/components/ClientDashboard';

export default function AuditDetailPage() {
  const params = useParams();
  const router = useRouter();
  const auditId = (params?.id as string) || '';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <ClientDashboard
          auditId={auditId}
          onBackToAdmin={() => router.push('/')}
        />
      </main>
    </div>
  );
}
