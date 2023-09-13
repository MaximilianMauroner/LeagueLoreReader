"use server";

import { db } from "@/utils/db/client";

export async function saveFileProblem(formData: FormData) {
  const fileId = formData.get("fileId")?.toString();
  if (!fileId) return;
  if (await db.fileProblems.findFirst({ where: { fileId: +fileId } })) return;

  await db.fileProblems.create({
    data: {
      fileId: +fileId,
    },
  });
}
