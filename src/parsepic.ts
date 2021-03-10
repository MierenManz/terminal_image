import { decode } from "../deps.ts";
interface Signatures {
  [key: string]: number[][];
}

export async function* parsePic(rawData: Uint8Array): AsyncGenerator<string> {
  const fileType = getFileType(rawData);
  let raw: Uint8Array;
  let imageWidth: number;
  if (fileType === "png") {
    const { image, width } = decode(rawData);
    raw = image;
    imageWidth = width;
    if (Deno.consoleSize(Deno.stdout.rid).columns / 2 < width) throw "Image is too big";
  } else throw "Unsupported image format";
  for (let i = 0; i < raw.length; i += 4) {
    if ((i * 0.25 % imageWidth === 0) && i !== 0) {
      yield "\u001b[0m\n";
    }
    yield `\u001b[48;2;${raw[i]};${raw[i+1]};${raw[i+2]}m  `;
  }
  yield "\u001b[0m";
  return;
}

function getFileType(rawFile: Uint8Array): string {
  const signatures: Signatures = {
    "png": [
      [137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82],
    ]
  };

  for (const fileType in signatures) {
    for (const signature of signatures[fileType]) {
      if (
        String(rawFile.slice(0, signature.length)) === String(signature)
      ) {
        return fileType;
      }
    }
  }

  return "unknown";
}