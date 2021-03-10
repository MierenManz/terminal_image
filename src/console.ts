import { parsePic } from "./parsepic.ts";
export async function displayPicture(path: Uint8Array): Promise<void> {
  const encode = (ree: string) => new TextEncoder().encode(ree);
  for await (const color of parsePic(path)) {
    Deno.stdout.write(encode(color));
  }
  return;
}
