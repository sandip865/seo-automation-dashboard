import { NextRequest, NextResponse } from 'next/server';
const { storage } = require('@/lib/storage');
const { enqueueAuditJob } = require('@/lib/queue');

// Handled by cron-job.org or Vercel Cron
export async function GET(req: NextRequest) {
  try {
    const clients = await storage.getClients();
    if (clients.length === 0) {
      return NextResponse.json({ message: 'No clients configured for recurring cron audit' });
    }

    // Pick first or all clients to audit
    const client = clients[0];
    const newAudit = await storage.createAudit({
      url: client.domain,
      businessType: client.businessType,
      city: client.city,
      state: client.state,
      clientId: client.id,
      status: 'queued',
      progress: 0
    });

    await enqueueAuditJob(newAudit.id, {
      url: client.domain,
      businessType: client.businessType,
      city: client.city,
      state: client.state
    });

    return NextResponse.json({
      success: true,
      message: `Cron job triggered audit for ${client.name} (${client.domain})`,
      auditId: newAudit.id
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
