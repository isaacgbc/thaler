import { NextResponse } from "next/server";
import demoReport from "@/fixtures/azos-demo.json";

// Returns a cached StressReport for visual verification of the UI without
// waiting for a fresh 7-minute agent run. The JSON is bundled at build time
// so it works on Vercel's serverless runtime as well as locally.
export async function GET() {
  return NextResponse.json(demoReport);
}
