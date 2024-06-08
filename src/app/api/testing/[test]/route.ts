import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { promptGroq } from "@/internal/groq";
import { prompGPTWithImages, promptGPT } from "@/internal/gpt"; // Import the promptGPT function

export async function POST(
  request: Request,
  { params }: { params: { test: string } }
) {
  switch (params.test) {
    case "craby":
      return getResponse({
        text: "Say my name Walter White 10 times",
      });
    case "prompt_gpt":
      // Use the promptGPT function to get a response from GPT-4
      return getResponse({ text: await prompGPTWithImages() });
    case "prompt_groq":
      return getResponse({ text: await promptGroq() });
    case "upload":
      // the file will appear in /public/uploads
      return handleFileUpload(request);
  }
  return new Response("Hello, Next.js!");
}

export function getResponse(jsonData: any): Response {
  return new Response(JSON.stringify(jsonData), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handleFileUpload(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob;
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(
      process.cwd(),
      "public/uploads",
      (file as any).name
    );

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, fileBuffer);

    return getResponse({ data: "File uploaded successfully" });
  } catch (error) {
    return getResponse({ data: "File upload failed" });
  }
}
