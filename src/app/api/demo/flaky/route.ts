import { NextResponse } from "next/server";

// Demo-only endpoint for the Cypress "Retry" talk segment: succeeds about half the
// time, to illustrate an unreliable backend causing an otherwise-correct test to flake.
export async function GET() {
  const success = Math.random() < 0.5;
  return NextResponse.json({ success });
}
