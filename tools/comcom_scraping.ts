// Copyright 2022 kamekyame. All rights reserved. MIT license.

import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts";
import { DrumJSON, VoiceJSON } from "./types.ts";

type Voice = {
  msb: number;
  lsb: number;
  pc: number;
  name: string;
  els02Page: string;
  els01Page: string;
  elxxx: boolean;
  xgLite: boolean;
};

const dom = getDOM(
  await getHTML("http://www.comcom2.com/lib/els_ext_xg_voice_list.html"),
);
const tables = dom.getElementById("content")?.getElementsByClassName("box");
if (!tables) throw Error("tables is nothing");

// カテゴリ名のリストを取得
const category = dom.getElementById("content")?.getElementsByTagName("p")[1]
  .getElementsByTagName("a").map((a) => a.textContent);
if (!category) throw Error("category is nothing");
// console.log(category);

const comcomVoices = tables.map((table, i) => {
  // console.log(category[i]);
  const voices: Voice[] = [];
  Array.from(table.getElementsByTagName("tr")).slice(1).forEach((tr) => {
    const [msb_, lsb_, pc_, name_, els02Page, els01Page, elxxx_, xgLite_] = tr
      .getElementsByTagName("td")
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
    // const sfx = sfx_.startsWith("SFX");
    const elxxx = elxxx_ === "○" ? true : false;
    const xgLite = xgLite_ === "○" ? true : false;
    //console.log(msb, lsb, pc, elxxx, name);
    voices.push({ name, msb, lsb, pc, els02Page, els01Page, elxxx, xgLite });
  });
  return { categoryName: category[i], voices };
  // voices.push({ categoryName: category[i], voices: voices });
});
// console.table(comcomVoices);

const voices: { categoryName: string; voices: VoiceJSON[] }[] = comcomVoices
  .slice(undefined, -1)
  .map((voice) => {
    return {
      categoryName: voice.categoryName,
      voices: voice.voices.map((v) => {
        return {
          name: v.name,
          msb: v.msb,
          lsb: v.lsb,
          pc: v.pc,
          elxxx: v.elxxx,
        };
      }),
    };
  });
const drums: DrumJSON[] = comcomVoices
  .slice(-1)[0].voices.map((v) => {
    return {
      name: v.name,
      msb: v.msb,
      lsb: v.lsb,
      pc: v.pc,
      elxxx: v.elxxx,
      sfx: v.els02Page.startsWith("SFX"),
    };
  });

// console.log(voices);
// console.log(drums);
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

import "./make_dramTone.ts";
