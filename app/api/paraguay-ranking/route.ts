// Persist Paraguay slot ordering via Vercel Blob (if configured).
// If BLOB_READ_WRITE_TOKEN is not set, the route responds gracefully and the
// client falls back to localStorage. This is a single-user, internal tool.

import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BLOB_KEY = "lan-v4/paraguay-order.json";

function blobConfigured(): boolean {
  return typeof process.env.BLOB_READ_WRITE_TOKEN === "string" &&
    process.env.BLOB_READ_WRITE_TOKEN.length > 0;
}

async function readOrder(): Promise<string[] | null> {
  if (!blobConfigured()) return null;
  try {
    const { blobs } = await list({ prefix: "lan-v4/" });
    const match = blobs.find((b) => b.pathname === BLOB_KEY);
    if (!match) return null;
    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data?.order) ? data.order : null;
  } catch {
    return null;
  }
}

async function writeOrder(order: string[]): Promise<boolean> {
  if (!blobConfigured()) return false;
  try {
    await put(BLOB_KEY, JSON.stringify({ order, updatedAt: new Date().toISOString() }), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
    });
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  const order = await readOrder();
  return NextResponse.json({
    order: order ?? [],
    source: order ? "blob" : "none",
  });
}

export async function POST(req: NextRequest) {
  let body: { order?: string[] };
  try {
    body = (await req.json()) as { order?: string[] };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }
  if (!Array.isArray(body.order) || body.order.some((x) => typeof x !== "string")) {
    return NextResponse.json({ ok: false, error: "invalid order" }, { status: 400 });
  }
  const ok = await writeOrder(body.order);
  return NextResponse.json({
    ok: true,
    persisted: ok ? "blob" : "client-only",
  });
}
