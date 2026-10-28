import { NextRequest, NextResponse } from 'next/server';
const { storage } = require('@/lib/storage');
const { sendWhatsApp } = require('@/mocks/twilio.mock');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { auditId, phone } = body;

    const audit = await storage.getAuditById(auditId);
    if (!audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
    }

    const clientId = audit.clientId || 'Client-ApexDental';
    const score = audit.overallScore || 74;
    const pdfUrl = audit.pdfUrl || `/reports/Audit-Report-${audit.id}.pdf`;
    const targetPhone = phone || '+91 98765 43210';

    // 1. Call Twilio Mock as required by PDF (logs to terminal)
    const result = await sendWhatsApp(clientId, pdfUrl, score);

    // 2. Prepare actual shareable message text
    const messageText = `*EDGELINK TECHNOLOGY — SEO Audit Report*\n\nWebsite: ${audit.url}\nOverall SEO Health Score: *${score}/100*\n\nYour executive audit report and recommendations have been generated.\nDownload Full PDF Report:\n${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${pdfUrl}\n\n_Generated via Edgelink SEO Automation Platform_`;

    const whatsappWebUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(targetPhone.replace(/[^0-9]/g, ''))}&text=${encodeURIComponent(messageText)}`;

    return NextResponse.json({
      success: true,
      status: 'mock_sent',
      sid: result.sid,
      clientId,
      phone: targetPhone,
      score,
      pdfUrl,
      messageText,
      whatsappWebUrl
    });
  } catch (error: any) {
    console.error('[WhatsApp API Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
