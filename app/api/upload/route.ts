import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getCurrentUser } from "@/lib/auth";

export const maxDuration = 60;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
];

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "MANAGER")) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload request" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.type && !ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
  }

  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: "File is larger than 20MB" }, { status: 400 });
  }

  console.log(`Blob upload starting: ${file.name} (${file.size} bytes, ${file.type})`);

  try {
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
      abortSignal: AbortSignal.timeout(45_000),
    });
    console.log(`Blob upload finished: ${blob.url}`);
    return NextResponse.json(blob);
  } catch (error) {
    console.error("Blob upload error:", error);
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json(
      {
        error: timedOut
          ? "Upload to storage timed out. Try a smaller photo or check your connection."
          : error instanceof Error
            ? error.message
            : "Upload failed",
      },
      { status: timedOut ? 504 : 500 }
    );
  }
}
