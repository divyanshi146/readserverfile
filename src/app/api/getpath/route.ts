import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const file = await req.json(); // Process the file from the request body
  // You can process the file here if needed
  return NextResponse.json({ message: 'File received', file }, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ message: 'GET method not implemented' }, { status: 501 });
}
