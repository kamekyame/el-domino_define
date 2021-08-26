import Encoding from "https://esm.sh/encoding-japanese";

import { VoiceJSON } from "./types.ts";
import Domino from "./domino-define.ts";
import { pcsName } from "./base.ts";

const moduleData = new Domino.File({
  name: "Electone",
  folder: "YAMAHA",
  fileCreator: "SuzuTomo",
  fileVersion: "0.1.0",
});

const instrumentList = moduleData.createInstrumentList();

const els02Pcs = createPCs(pcsName);
const elxxxPcs = createPCs(pcsName);

const els02Map = new Domino.InstrumentMap("ELS-02 Series", els02Pcs);
const elxxxMap = new Domino.InstrumentMap("EL100~900m", elxxxPcs);

instrumentList.addMap(els02Map);
instrumentList.addMap(elxxxMap);

const voices = await JSON.parse(
  Deno.readTextFileSync("./data/voices.json"),
) as VoiceJSON[];

for (const voice of voices) {
  const { name, msb, lsb, pc, elxxx } = voice;
  const bank = new Domino.Bank(name, lsb, msb);
  els02Pcs[pc - 1].addBank(bank);
  if (elxxx) elxxxPcs[pc - 1].addBank(bank);
}

const xmlText = moduleData.toXML();
const sjisString = Encoding.convert(xmlText, "SJIS", "UTF8");
Deno.writeTextFileSync("electone.xml", sjisString);

// functions
function createPCs(pcsName: string[]) {
  return pcsName.map((name, i) => new Domino.InstrumentPC(name, i + 1));
}
