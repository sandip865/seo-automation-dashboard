import { NextRequest, NextResponse } from 'next/server';
const { storage } = require('@/lib/storage');
const { getRedisStatus } = require('@/lib/queue');

export async function GET(req: NextRequest) {
  try {
    const audits = await storage.getAudits();
    const clients = await storage.getClients();
    const isRedisConnected = getRedisStatus();

    // Summary statistics
    const totalAudits = audits.length;
    const completedAudits = audits.filter((a: any) => a.status === 'completed');
    const avgScore = completedAudits.length > 0
      ? Math.round(completedAudits.reduce((acc: number, curr: any) => acc + (curr.overallScore || 0), 0) / completedAudits.length)
      : 0;
    const activeRunning = audits.filter((a: any) => !['completed', 'failed'].includes(a.status)).length;

    return NextResponse.json({
      audits,
      clients,
      stats: {
        totalAudits,
        completedCount: completedAudits.length,
        averageScore: avgScore,
        activeRunning,
        isRedisConnected,
        useMocks: process.env.USE_MOCKS === 'true'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
