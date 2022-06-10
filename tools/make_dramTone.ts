// Copyright 2022 kamekyame. All rights reserved. MIT license.

import { readMatrix } from "https://deno.land/std@0.143.0/encoding/csv.ts";
import { BufReader } from "https://deno.land/std@0.143.0/io/buffer.ts";

import { DrumToneBankJson, DrumToneJson } from "./types.ts";

const resolve = (path: string) => new URL(path, import.meta.url);

CreateDrumToneJson({
  inFile: "drum-tone_01.csv",
  outFile: "drum-tone_01.json",
});
CreateDrumToneJson({
  inFile: "drum-tone_02.csv",
  outFile: "drum-tone_02.json",
});

async function CreateDrumToneJson(
  { inFile, outFile }: { inFile: string; outFile: string },
) {
  const file = await Deno.open(
    resolve(`../data/raw-data/${inFile}`),
    { read: true },
  );
  const csv = await readMatrix(new BufReader(file), {});

  const columnDram: { names: string[]; tone: DrumToneBankJson[] }[] = [];

  csv.forEach((row) => {
    const keyNum = parseInt(row[0]);
    row.slice(1).forEach((str, i) => {
      str = str.trim();
      if (!str) return;
      if (!columnDram[i]) columnDram[i] = { names: [], tone: [] };
      if (isNaN(keyNum)) { // 先頭行が非数の場合(その行にはDram名が含まれている)
        columnDram[i].names.push(str);
      } else { // 先頭列が数字の場合(その行にはToneが含まれている)
        columnDram[i].tone.push({ key: keyNum, name: str });
      }
    });
  });

  const json: DrumToneJson[] = columnDram.flatMap((dram) => {
    return dram.names.map((name) => ({ name, tone: dram.tone }));
  });

  Deno.writeTextFileSync(
    resolve(`../data/${outFile}`),
    JSON.stringify(json, null, 2) + "\n",
  );
}
