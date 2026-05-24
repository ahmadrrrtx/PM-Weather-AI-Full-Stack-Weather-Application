import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message:
      "Records are stored in browser localStorage. Use client-side storage utilities.",
    info: "See lib/storage.ts for CRUD implementation.",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.locationInput || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: "locationInput, startDate, and endDate are required." },
        { status: 400 }
      );
    }
    return NextResponse.json({
      message: "Use client-side storage for record creation.",
      received: body,
    });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
}
