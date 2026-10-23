import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { getSiteSettings } from '@/lib/settings';

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json(); // key-value pairs

    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string') {
        await prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }
    }

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: 'SETTINGS_UPDATED',
        entityType: 'SiteSetting',
        details: 'Updated global site settings',
      },
    }).catch(() => {});

    const updated = await getSiteSettings();
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
