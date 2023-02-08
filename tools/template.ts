// Copyright 2022 kamekyame. All rights reserved. MIT license.

import { Domino } from "../deps.ts";

import Encoding from "https://esm.sh/encoding-japanese";

const f = await Deno.readFile("./data/template_defaultdata.xml");
const tempDefaultStr = Encoding.convert(f, {
  to: "UNICODE",
  from: "SJIS",
  type: "string",
});
export const tempDefault = Domino.File.fromXML(tempDefaultStr);

const addTemplate = [
  new Domino.Template({ name: "Scrren Capture" }, [
    new Domino.CC({ id: 1213, value: 0x00 }),
    new Domino.CC({ id: 1213, value: 0x01 }),
  ]),
];

tempDefault.moduleData.tags.templateList?.tags.push(...addTemplate);
