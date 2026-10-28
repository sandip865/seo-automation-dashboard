import { NextRequest, NextResponse } from 'next/server';
const { storage } = require('@/lib/storage');

export async function GET() {
  try {
    const clients = await storage.getClients();
    return NextResponse.json({ clients });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, domain, businessType, city, state, contactEmail, contactPhone } = body;

    if (!name || !domain) {
      return NextResponse.json({ error: 'Name and domain are required' }, { status: 400 });
    }

    const client = await storage.createClient({
      name,
      domain,
      businessType: businessType || 'Dental Clinic',
      city: city || 'Pune',
      state: state || 'Maharashtra',
      contactEmail,
      contactPhone
    });

    return NextResponse.json({ success: true, client }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
