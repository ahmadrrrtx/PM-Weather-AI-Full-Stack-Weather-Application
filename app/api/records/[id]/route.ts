import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({
    message: `Record ${params.id} is stored in browser localStorage.`,
    info: "See lib/storage.ts — getRecordById(id)",
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    return NextResponse.json({
      message: `Use client-side updateRecord("${params.id}", updates) from lib/storage.ts`,
      received: body,
    });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({
    message: `Use client-side deleteRecord("${params.id}") from lib/storage.ts`,
  });
}
