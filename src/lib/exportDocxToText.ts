import mammoth from "mammoth";

export async function convertDocxToText(inputFile: File): Promise<string> {
  try {
    const arrayBuffer = await inputFile.arrayBuffer();

    // Use mammoth with ArrayBuffer directly instead of Buffer
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (err) {
    console.error("Error extracting text:", err);
    throw err;
  }
}
