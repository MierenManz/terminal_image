import { displayPicture } from "./src/console.ts";
const imageLocation = Deno.args[0];
const imageURL = new URL(imageLocation, import.meta.url);
let image: Uint8Array;
if (imageURL.protocol !== "file:") {
  image = new Uint8Array(await (await fetch(imageURL)).arrayBuffer());
} else image = await Deno.readFile(imageURL);
displayPicture(image);
