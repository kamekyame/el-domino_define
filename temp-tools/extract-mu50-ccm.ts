// Copyright 2022 kamekyame. All rights reserved. MIT license.

import Encoding from "https://esm.sh/encoding-japanese";

const f = await Deno.readFile("./memo/mu50.xml");
let text = Encoding.convert(f, { to: "UNICODE", from: "SJIS", type: "string" });
text = text.replaceAll(/\r\n|\n|\r|\t/g, "");
const ccmMatch = text.match(
  /<ControlChangeMacroList>(.+)<\/ControlChangeMacroList>/,
);
if (!ccmMatch) Deno.exit(1);
let ccm = ccmMatch[1];
// IDが139以下のCCMを抽出
const duplicateCcm = ccm.matchAll(
  /<CCM ID="(1[0-3][0-9]|[1-9][0-9]|[0-9])" Name="(.+?)"(.+?)<\/CCM>/g,
);

for (const [str, id, name] of duplicateCcm) {
  console.log(`Delete CCM[${("000" + id).slice(-3)}] : ${name}`);
  ccm = ccm.replaceAll(str, " ");
}

await Deno.writeTextFile("data/mu50-ccm-utf8.txt", ccm);
console.log("Done! Output: data/mu50-ccm-utf8.txt");
