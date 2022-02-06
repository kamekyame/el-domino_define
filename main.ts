import Encoding from "https://esm.sh/encoding-japanese";

import { Domino } from "./deps.ts";

import { DrumJSON, DrumToneJson, VoiceJSON } from "./tools/types.ts";
import { pcsName } from "./tools/base.ts";
import { ccmList } from "./tools/ccm.ts";
import { templateList } from "./tools/template.ts";

import voices from "./data/voices.json" assert { type: "json" };
import drums from "./data/drums.json" assert { type: "json" };
import drumTone02 from "./data/drum-tone_02.json" assert { type: "json" };

// InstrumentList 作成
const els02InstPcs = new Map<number, Domino.InstrumentPC>();
const elxxxInstPcs = new Map<number, Domino.InstrumentPC>();
for (const voice of voices) {
  const { name, msb, lsb, pc, elxxx } = voice;
  const bank = new Domino.Bank(name, lsb, msb);
  const els02InstPc = els02InstPcs.get(pc);
  if (els02InstPc) {
    els02InstPc.banks.push(bank);
  } else {
    els02InstPcs.set(pc, new Domino.InstrumentPC(pcsName[pc - 1], pc, [bank]));
  }
  if (elxxx) {
    const elxxxInstPc = elxxxInstPcs.get(pc);
    if (elxxxInstPc) {
      elxxxInstPc.banks.push(bank);
    } else {
      elxxxInstPcs.set(
        pc,
        new Domino.InstrumentPC(pcsName[pc - 1], pc, [bank]),
      );
    }
  }
}
function MapToArrayBySort(
  map: Map<number, Domino.InstrumentPC>,
): Domino.InstrumentPC[] {
  const array = Array.from(map.values());
  array.sort((a, b) => a.pc - b.pc);
  return array;
}
const els02InstsMap = new Domino.InstrumentMap(
  "ELS-02 Series",
  MapToArrayBySort(els02InstPcs),
);
const elxxxInstsMap = new Domino.InstrumentMap(
  "EL100~900m",
  MapToArrayBySort(elxxxInstPcs),
);
const instrumentList = new Domino.InstrumentList([
  els02InstsMap,
  elxxxInstsMap,
]);

// DrumSetList 作成
const els02DrumPcs = new Map<number, Domino.DrumPC>();
const els02DrumSfxPcs = new Map<number, Domino.DrumPC>();
const elxxxDrumPcs = new Map<number, Domino.DrumPC>();
for (const drum of drums) {
  const { name, msb, lsb, pc, elxxx, sfx } = drum;
  // pcsやbankをここで作成しないのは、それぞれのPcsで異なるインスタンスにするため
  if (sfx) {
    const pcs = els02DrumSfxPcs.get(pc);
    const bank = new Domino.DrumBank([], name, lsb, msb);
    if (pcs) pcs.banks.push(bank);
    else els02DrumSfxPcs.set(pc, new Domino.DrumPC(name, pc, [bank]));
  } else {
    const pcs = els02DrumPcs.get(pc);
    const bank = new Domino.DrumBank([], name, lsb, msb);
    if (pcs) pcs.banks.push(bank);
    else els02DrumPcs.set(pc, new Domino.DrumPC(name, pc, [bank]));
  }
  if (elxxx) {
    const pcs = elxxxDrumPcs.get(pc);
    const bank = new Domino.DrumBank([], name, lsb, msb);
    if (pcs) pcs.banks.push(bank);
    else elxxxDrumPcs.set(pc, new Domino.DrumPC(name, pc, [bank]));
  }
}
els02DrumPcs.forEach((pcs) => {
  pcs.banks.forEach((bank) => {
    const tones = drumTone02.find((tone) => tone.name === bank.name);
    if (!tones) return;
    bank.tones = tones.tone.map((tone) => new Domino.Tone(tone.name, tone.key));
  });
});
els02DrumSfxPcs.forEach((pcs) => {
  pcs.banks.forEach((bank) => {
    const tones = drumTone02.find((tone) => tone.name === bank.name);
    if (!tones) return;
    bank.tones = tones.tone.map((tone) => new Domino.Tone(tone.name, tone.key));
  });
});
const els02DrumMap = new Domino.DrumMap(
  "ELS-02 Series",
  Array.from(els02DrumPcs.values()),
);
const els02DrumSfxMap = new Domino.DrumMap(
  "ELS-02 Series SFX",
  Array.from(els02DrumSfxPcs.values()),
);
const elxxxDrumMap = new Domino.DrumMap(
  "EL100~900m",
  Array.from(elxxxDrumPcs.values()),
);
const drumSetList = new Domino.DrumSetList([
  els02DrumMap,
  els02DrumSfxMap,
  elxxxDrumMap,
]);

const file = new Domino.File({
  name: "Electone",
  folder: "YAMAHA",
  fileCreator: "SuzuTomo",
  fileVersion: "1.3.0",
}, {
  controlChangeMacroList: ccmList,
  templateList,
  instrumentList,
  drumSetList,
});

let xmlText = file.toXML();
xmlText = xmlText.replaceAll("&apos;", "'");

// mu50のccmを注入
const splitTexts = xmlText.split("</ControlChangeMacroList>");
const ccmText = await Deno.readTextFile("./data/mu50-ccm-utf8.txt");
const text = splitTexts[0] + ccmText + "</ControlChangeMacroList>" +
  splitTexts[1];

const utf8Bytes = new TextEncoder().encode(text);
const sjisBytesArray = Encoding.convert(utf8Bytes, {
  to: "SJIS",
  from: "UTF8",
});
const sjisBytes = Uint8Array.from(sjisBytesArray);
Deno.writeFileSync("electone.xml", sjisBytes);
