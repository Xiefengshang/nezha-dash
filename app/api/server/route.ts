import { auth } from "@/auth";
import getEnv from "@/lib/env-entry";
import { GetNezhaData } from "@/lib/serverFetch";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const runtime = "edge";



interface ResError extends Error {
  statusCode: number;
  message: string;
}

export async function GET() {
  const session = await auth();

  if (!session && getEnv("SitePassword")) {
    redirect("/");
  }

  try {
    const data = await GetNezhaData();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const err = error as ResError;
    console.error("Error in GET handler:", err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
