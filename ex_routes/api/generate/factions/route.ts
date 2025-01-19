import { db } from "@/utils/db/client";
import {
  createFactions,
  updateIndividualFaction,
} from "@/utils/generate/generate";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const startDate = new Date();
  const { searchParams } = new URL(request.url);
  let res = null;
  if (searchParams.has("faction")) {
    const slug = searchParams.get("faction");
    if (!slug) {
      throw new Error("No slug provided");
    }
    const faction = await db.faction.findFirstOrThrow({
      where: { slug: slug },
    });
    res = await updateIndividualFaction(faction);
  } else {
    res = await createFactions();
  }
  const timeDiff = new Date().getTime() - startDate.getTime();
  return NextResponse.json({ time: `${timeDiff}ms`, response: res });
}
