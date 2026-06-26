import { NextResponse } from "next/server";
import { fetchBeatsFromAirtable } from "@/lib/beats";

export async function GET() {
  try {
    const beats = await fetchBeatsFromAirtable();
    const live = Boolean(
      process.env.AIRTABLE_TOKEN && process.env.AIRTABLE_BASE,
    );
    return NextResponse.json({ beats, live });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch beats" },
      { status: 500 },
    );
  }
}
