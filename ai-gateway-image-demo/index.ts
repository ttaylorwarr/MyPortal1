import { generateText } from "ai";
import fs from "node:fs";
import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  const prompt =
    process.argv.slice(2).join(" ") ||
    "A sunny beachfront vacation villa with a private pool, photorealistic";

  const result = await generateText({
    model: "google/gemini-3.1-flash-image-preview",
    prompt,
  });

  const imageFiles = result.files.filter((f) =>
    f.mediaType?.startsWith("image/")
  );

  if (imageFiles.length === 0) {
    console.error("No image was returned. Full response text:", result.text);
    process.exitCode = 1;
    return;
  }

  const extension = imageFiles[0].mediaType?.split("/")[1] || "png";
  const outputPath = `output.${extension}`;
  fs.writeFileSync(outputPath, imageFiles[0].uint8Array);
  console.log(`Image saved to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
