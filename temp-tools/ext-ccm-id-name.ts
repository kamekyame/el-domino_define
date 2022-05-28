// Copyright 2022 kamekyame. All rights reserved. MIT license.

// electone.xmlからCCMのIDとNameを抽出してcsvに出力するプログラム

import {
  Column,
  stringify,
} from "https://deno.land/std@0.141.0/encoding/csv.ts";

type Line = {
  id: number;
  name: string;
};

const columns: Column[] = [
  "id",
  "name",
];

const data: Line[] = [];

const uint8Ary = await Deno.readFile("electone.xml", {});
const text = new TextDecoder("Shift-JIS").decode(uint8Ary);
const lines = text
  .split("\n")
  .map((line) => line.trim());

const ccmLines = lines.filter((line) => line.startsWith("<CCM"));
console.log(ccmLines);

ccmLines.forEach((line) => {
  const [_matchId, id] = line.match(/ID="(\d+)"/) || [];
  const [_matchName, name] = line.match(/Name="(.+)"/) || [];
  if (!id || !name) return;
  console.log(id, name);
  data.push({ id: parseInt(id), name });
});

data.sort((a, b) => a.id - b.id);

console.log(data);

const csv = await stringify(data, columns);
await Deno.writeTextFile("data/ccm-id-name.csv", csv);
console.log("Write! data/ccm-id-name.csv");
