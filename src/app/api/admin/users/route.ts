import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get('role');
    const statusFilter = searchParams.get('status');

    const where: any = {};
    if (roleFilter && roleFilter !== 'ALL') where.role = roleFilter;
    if (statusFilter && statusFilter !== 'ALL') where.status = statusFilter;

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        country: true,
        preferredContact: true,
        role: true,
        status: true,
        isEmailVerified: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            enquiries: true,
            viewingRequests: true,
          },
        },
        enquiries: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            status: true,
            createdAt: true,
            message: true,
            property: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, status, role } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const dataToUpdate: any = {};
    if (status !== undefined) {
      if (!['UNVERIFIED', 'VERIFIED', 'DISABLED'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      dataToUpdate.status = status;
    }

    if (role !== undefined) {
      if (!['USER', 'ADMIN'].includes(role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      }
      dataToUpdate.role = role;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        isEmailVerified: true,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: admin.userId,
        action: status === 'DISABLED' ? 'USER_DISABLED' : 'USER_STATUS_UPDATED',
        entityType: 'User',
        entityId: userId,
        details: `Admin changed user status/role to: ${JSON.stringify(dataToUpdate)}`,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
