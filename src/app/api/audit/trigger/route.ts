import { NextRequest, NextResponse } from 'next/server';
const { storage } = require('@/lib/storage');
const { enqueueAuditJob } = require('@/lib/queue');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, businessType, city, state, clientId } = body;

    if (!url) {
      return NextResponse.json({ error: 'Target URL is required' }, { status: 400 });
    }

    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    // Create Audit entry in storage
    const newAudit = await storage.createAudit({
      url: formattedUrl,
      businessType: businessType || 'Dental Clinic',
      city: city || 'Pune',
      state: state || 'Maharashtra',
      clientId: clientId || null,
      status: 'queued',
      progress: 0
    });

    // Enqueue job into BullMQ queue
    const queueResult = await enqueueAuditJob(newAudit.id, {
      url: formattedUrl,
      businessType,
      city,
      state
    });

    return NextResponse.json({
      success: true,
      message: 'Audit job successfully queued',
      auditId: newAudit.id,
      jobId: queueResult.jobId,
      queue: queueResult.queue,
      mode: queueResult.mode,
      audit: newAudit
    }, { status: 201 });
  } catch (error: any) {
    console.error('[API Trigger Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to queue audit' }, { status: 500 });
  }
}
