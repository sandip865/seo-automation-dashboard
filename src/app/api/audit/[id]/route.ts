import { NextRequest, NextResponse } from 'next/server';
const { storage } = require('@/lib/storage');

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auditId = params.id;
    let audit = null;

    if (auditId === 'latest') {
      const audits = await storage.getAudits();
      audit = audits[0] || null;
    } else {
      audit = await storage.getAuditById(auditId);
    }

    if (!audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
    }

    const logs = await storage.getLogsByAuditId(audit.id);

    return NextResponse.json({
      audit,
      logs
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
