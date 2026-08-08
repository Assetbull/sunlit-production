import { NextRequest, NextResponse } from 'next/server';
import { runEngineeringCalculation } from '@/lib/engineering/engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toolId, inputData } = body;

    if (!toolId) {
      return NextResponse.json(
        { error: 'Missing required field: toolId' },
        { status: 400 }
      );
    }

    const result = runEngineeringCalculation(toolId, inputData || {});
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to process calculation', details: error?.message },
      { status: 500 }
    );
  }
}
