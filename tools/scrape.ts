import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.13-alpha/deno-dom-wasm.ts";
import { DrumJSON, VoiceJSON } from "./types.ts";

const voices: VoiceJSON[] = [];
const drums: DrumJSON[] = [];

const dom = getDOM(
  await getHTML("http://www.comcom2.com/lib/els_ext_xg_voice_list.html"),
);
const tables = dom.getElementById("content")?.getElementsByClassName("box");
if (!tables) throw Error("tables is nothing");

tables.forEach(
  (table, i) => {
    Array.from(table.getElementsByTagName("tr")).slice(1).forEach((tr) => {
      const [msb_, lsb_, pc_, name_, sfx_, , elxxx_] = tr
        .getElementsByTagName(
          "td",
        )
        .map((td) => td.textContent);
      const msb = parseInt(msb_);
      const lsb = parseInt(lsb_);
      const pc = parseInt(pc_);
      const name = name_.replace(/’/g, "'");
      const sfx = sfx_.startsWith("SFX");
      const elxxx = elxxx_ === "○" ? true : false;
      //console.log(msb, lsb, pc, elxxx, name);
      if (i === tables.length - 1) {
        drums.push({ name, msb, lsb, pc, elxxx, sfx });
      } else voices.push({ name, msb, lsb, pc, elxxx });
    });
  },
);

//console.log(voices);
console.log(drums);
Deno.writeTextFileSync("./data/voices.json", JSON.stringify(voices));
Deno.writeTextFileSync("./data/drums.json", JSON.stringify(drums));

// functions
async function getHTML(url: string) {
  const data = await fetch(url);
  const stream = data.body?.pipeThrough(new TextDecoderStream("euc-jp"));
  if (!stream) throw Error("body is nothing");
  let text = "";
  for await (const s of stream) {
    text += s;
  }
  return text;
}

function getDOM(text: string) {
  const doc = new DOMParser().parseFromString(text, "text/html")!;
  return doc;
}
