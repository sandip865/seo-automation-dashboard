import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;

    // Check possible locations: /tmp/reports (Vercel) and ./public/reports (Local)
    const locations = [
      path.join('/tmp', 'reports', filename),
      path.join(process.cwd(), 'public', 'reports', filename)
    ];

    let foundPath: string | null = null;
    for (const loc of locations) {
      if (fs.existsSync(loc)) {
        foundPath = loc;
        break;
      }
    }

    if (!foundPath) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(foundPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
