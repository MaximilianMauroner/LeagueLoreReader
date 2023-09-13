import { db } from "@/utils/db/client";
import type { File, FileProblems, Story } from "@prisma/client";
import { NextResponse } from "next/server";
import * as ftp from "basic-ftp";
import { env } from "@/env.mjs";

type FileProblemsType = Awaited<ReturnType<typeof getFileProblems>>;
export async function GET() {
  const fileProblems = await getFileProblems();
  if (!fileProblems) return NextResponse.json({ result: "no problem found" });
  const result = await validateFile(fileProblems);
  return NextResponse.json({
    result,
  });
}
const validateFile = async (fileProblems: FileProblemsType) => {
  const client = new ftp.Client();
  try {
    await client.access({
      host: env.FTP_SERVER_HOST,
      user: env.FTP_SERVER_USERNAME,
      password: env.FTP_SERVER_PASSWORD,
      secure: true,
    });
    const files = await client.list();
    for (const problem of fileProblems) {
      for (const file of files) {
        if (file.name == problem.file.fileName) {
          await client.remove(file.name);
          await db.file.delete({ where: { id: problem.file.id } });
        }
      }
    }
    return files;
  } catch (err) {
    console.log(err);
    client.close();
  }
};

const getFileProblems = async () => {
  return await db.fileProblems.findMany({
    include: { file: { include: { story: true } } },
  });
};
