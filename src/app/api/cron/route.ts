import { db } from "@/utils/db/client";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await db.cron.create({
    data: {
      type: "manual",
    },
  });
  return NextResponse.json({
    res,
  });
}
