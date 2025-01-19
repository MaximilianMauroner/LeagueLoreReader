import { db } from "@/utils/db/client";
import { NextResponse } from "next/server";

export async function GET() {
  const stories = await db.story.count();
  const files = await db.file.count();
  const fileProblems = await db.fileProblems.count();
  return NextResponse.json({
    filecount: files,
    storycount: stories,
    completed: Math.floor((files / stories) * 100) + "%",
    problems: fileProblems,
  });
}
