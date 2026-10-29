import React from 'react';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { formatDateTime } from '@/lib/formatters';
import { History, Shield, User, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AuditLogsPage() {
  await requireAdmin();

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 mb-1">
          <Shield className="w-4 h-4" />
          <span>Security & Compliance</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Administrative Audit Trail
        </h1>
        <p className="text-xs text-slate-500">
          Chronological record of property modifications, status changes, and settings adjustments.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-4">Action</th>
                  <th className="py-4 px-4">Entity</th>
                  <th className="py-4 px-4">User</th>
                  <th className="py-4 px-6">Activity Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-6 text-slate-500 whitespace-nowrap">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 text-slate-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {log.entityType}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {log.user ? log.user.email : 'System / Direct'}
                    </td>
                    <td className="py-3 px-6 text-slate-700 font-sans">
                      {log.details || '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-400">
            No audit logs recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
