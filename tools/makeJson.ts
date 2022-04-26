// Copyright 2022 kamekyame. All rights reserved. MIT license.

import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.13-alpha/deno-dom-wasm.ts";
import { DrumJSON, VoiceJSON } from "./types.ts";

const voices: VoiceJSON[] = [];
const drums: DrumJSON[] = [];

// #region web-scrape

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
      const name = name_.replace(
        /Kit(\d)|Live! SFX|Live!\s|Kit\+P|^AnalogT(\d)|DrumMachine|! Standard|PowerKit|RealDrums|VocalEffects Kit|Orchestra Perc/g,
        (...param) => {
          //console.log(param);
          if (param[0] === "Kit+P") return "+P Kit";
          else if (param[0].match(/Kit(\d)/)) return "Kit " + param[1];
          else if (param[0] === "Live! SFX") return param[0]; // ???
          else if (param[0] === "Live! ") return "Live!"; // ??????
          else if (param[0].startsWith("AnalogT")) return `Analog T${param[2]}`;
          else if (param[0] === "DrumMachine") return "Drum Machine";
          else if (param[0] === "! Standard") return "!Std";
          else if (param[0] === "PowerKit") return "Power Kit ";
          else if (param[0] === "RealDrums") return "Real Drums";
          else if (param[0] === "VocalEffects Kit") return "VocalEffectsKit";
          else if (param[0] === "Orchestra Perc") return "OrchestraPerc";
          else return param[0];
        },
      );
      if (name !== name_) {
        console.log(`Replace voice name\tfrom:${name_}\tto:${name}`);
      }
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
Deno.writeTextFileSync(
  "./data/voices.json",
  JSON.stringify(voices, null, 2) + "\n",
);
Deno.writeTextFileSync(
  "./data/drums.json",
  JSON.stringify(drums, null, 2) + "\n",
);

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

// #endregion

// #region read-drumSet-tone

import "./make_dramTone.ts";

// #endregion
