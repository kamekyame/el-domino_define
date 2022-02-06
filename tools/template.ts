import { Domino } from "../deps.ts";

export const templateList = new Domino.TemplateList([
  new Domino.Template({ name: "SEQ.1-4 ON" }, [
    new Domino.CC({ id: 866, gate: 0, value: 1 }),
    new Domino.CC({ id: 866, gate: 1, value: 1 }),
    new Domino.CC({ id: 866, gate: 2, value: 1 }),
    new Domino.CC({ id: 866, gate: 3, value: 1 }),
  ]),
]);
