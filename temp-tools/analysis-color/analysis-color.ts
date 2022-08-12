// Copyright 2022 kamekyame. All rights reserved. MIT license.

// mu50.xmlからCCMのColorとNameを抽出してcsvに出力するプログラム

const data: { [key: string]: string[] } = {};

const uint8Ary = await Deno.readFile("memo/mu50.xml");
const text = new TextDecoder("Shift-JIS").decode(uint8Ary);
const lines = text
  .split("\n")
  .map((line) => line.trim());

const ccmLines = lines.filter((line) => line.startsWith("<CCM"));
console.log(ccmLines);

ccmLines.forEach((line) => {
  const [_matchColor, color] = line.match(/Color="#(\w{6})"/) || [];
  const [_matchName, name] = line.match(/Name="(.+?)"/) || [];
  if (!color || !name) return;
  if (data[color] === undefined) data[color] = [];
  data[color].push(name);
});

console.log(data);

await Deno.writeTextFile(
  "./temp-tools/analysis-color/analysis-color.json",
  JSON.stringify(data, null, 2),
);
