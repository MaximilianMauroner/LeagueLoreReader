import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ message: "Hello World" });
}

// const updateAll = async () => {
//   const response = await fetch(env.CHAMPIONS_URL);
//   const jsonData = await response.json();
//   return jsonData;
// };
