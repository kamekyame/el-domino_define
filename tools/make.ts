import Encoding from "https://esm.sh/encoding-japanese";

import { DrumJSON, VoiceJSON } from "./types.ts";
import * as Domino from "./domino-define.ts";
import { pcsName } from "./base.ts";
import { ccmList } from "./ccm.ts";

const moduleData = new Domino.File({
  name: "Electone",
  folder: "YAMAHA",
  fileCreator: "SuzuTomo",
  fileVersion: "0.1.0",
}, { controlChangeMacroList: ccmList });

const instrumentList = moduleData.createInstrumentList();
const drumSetList = moduleData.createDrumSetList();

const els02InstPcs = createInstPCs(pcsName);
const elxxxInstPcs = createInstPCs(pcsName);

const els02DrumPcs: Domino.DrumPC[] = [];
const els02DrumSfxPcs: Domino.DrumPC[] = [];
const elxxxDrumPcs: Domino.DrumPC[] = [];

const els02InstsMap = new Domino.InstrumentMap("ELS-02 Series", els02InstPcs);
const elxxxInstsMap = new Domino.InstrumentMap("EL100~900m", elxxxInstPcs);

instrumentList.addMap(els02InstsMap);
instrumentList.addMap(elxxxInstsMap);

const els02DrumsMap = new Domino.DrumMap("ELS-02 Series", els02DrumPcs);
const els02DrumsSfxMap = new Domino.DrumMap(
  "ELS-02 Series SFX",
  els02DrumSfxPcs,
);
const elxxxDrumsMap = new Domino.DrumMap("EL100~900m", elxxxDrumPcs);

drumSetList.addMap(els02DrumsMap);
drumSetList.addMap(els02DrumsSfxMap);
drumSetList.addMap(elxxxDrumsMap);

// 音色リストの読み込み
const voices = await JSON.parse(
  Deno.readTextFileSync("./data/voices.json"),
) as VoiceJSON[];

for (const voice of voices) {
  const { name, msb, lsb, pc, elxxx } = voice;
  const bank = new Domino.Bank(name, lsb, msb);
  els02InstPcs[pc - 1].addBank(bank);
  if (elxxx) elxxxInstPcs[pc - 1].addBank(bank);
}

// ドラムセットリストの読み込み
const drums = await JSON.parse(
  Deno.readTextFileSync("./data/drums.json"),
) as DrumJSON[];

for (const drum of drums) {
  const { name, msb, lsb, pc, elxxx, sfx } = drum;
  const bank = new Domino.DrumBank([], name, lsb, msb);

  if (sfx) {
    const pcs = els02DrumSfxPcs.find((p) => p.pc === pc);
    if (pcs) pcs.addBank(bank);
    else {
      const pcs = new Domino.DrumPC(name, pc, [bank]);
      els02DrumSfxPcs.push(pcs);
    }
  } else {
    const pcs = els02DrumPcs.find((p) => p.pc === pc);
    if (pcs) pcs.addBank(bank);
    else {
      const pcs = new Domino.DrumPC(name, pc, [bank]);
      els02DrumPcs.push(pcs);
    }
  }
  if (elxxx) {
    const pcs = elxxxDrumPcs.find((p) => p.pc === pc);
    if (pcs) pcs.addBank(bank);
    else {
      const pcs = new Domino.DrumPC(name, pc, [bank]);
      elxxxDrumPcs.push(pcs);
    }
  }
}

const xmlText = moduleData.toXML();
const sjisString = Encoding.convert(xmlText, "SJIS", "UTF8");
Deno.writeTextFileSync("electone.xml", sjisString);

// functions
function createInstPCs(pcsName: string[]) {
  return pcsName.map((name, i) => new Domino.InstrumentPC(name, i + 1));
}
