// Copyright 2022 kamekyame. All rights reserved. MIT license.

import { Domino, expandGlob } from "../deps.ts";

import Encoding from "https://esm.sh/encoding-japanese";

const version = Deno.args[0].substring(1);

for await (const file of expandGlob("./*.xml")) {
  if (!file.isFile) continue;

  const f = await Deno.readFile(file.path);
  const xmlStr = Encoding.convert(f, {
    to: "UNICODE",
    from: "SJIS",
    type: "string",
  });
  const domino = Domino.File.fromXML(xmlStr);
  if (domino.moduleData.fileVersion !== version) {
    console.error(`${file.name} file version is not ${version}`);
    throw Error("Version invalid");
  } else {
    console.log(`${file.name} file version is ${version}`);
  }
}
