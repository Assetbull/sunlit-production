import { NextRequest, NextResponse } from 'next/server';
import { submitWaitlist } from '@/lib/waitlist';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, full_name, first_name, last_name, phone, state, user_type, interested_tool, project_type } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const fName = first_name || full_name?.split(' ')[0] || 'Subscriber';
    const lName = last_name || full_name?.split(' ').slice(1).join(' ') || '';

    const result = await submitWaitlist({
      first_name: fName,
      last_name: lName,
      email,
      phone: phone || '',
      state: state || 'Lagos',
      interest: interested_tool || user_type || 'Solar Engineering Tools',
      agreed_to_updates: true,
      message: `Project Type: ${project_type || 'General'}`,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to register for waitlist.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "You're officially on the Sunlit Engineering Tools waitlist.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal server error processing waitlist entry.' },
      { status: 500 }
    );
  }
}
