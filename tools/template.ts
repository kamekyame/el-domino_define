// Copyright 2022 kamekyame. All rights reserved. MIT license.

import { Domino } from "../deps.ts";

import Encoding from "https://esm.sh/encoding-japanese";

const f = await Deno.readFile("./data/template_defaultdata.xml");
const tempDefaultStr = Encoding.convert(f, {
  to: "UNICODE",
  from: "SJIS",
  type: "string",
});
const tempDefault = Domino.File.fromXML(tempDefaultStr);

export const templateList = tempDefault.moduleData.templateList;
if (!templateList) {
  throw new Error("data/template_defaultdata.xml TemplateList is not found");
}

export const defaultData = tempDefault.moduleData.defaultData;
if (!defaultData) {
  throw new Error("data/template_defaultdata.xml DefaultData is not found");
}
