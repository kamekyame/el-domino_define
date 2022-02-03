import { CC, Template, TemplateList } from "./domino-define.ts";

export const templateList = new TemplateList([
  new Template({ name: "SEQ.1-4 ON" }, [
    new CC({ id: 866, gate: 0, value: 1 }),
    new CC({ id: 866, gate: 1, value: 1 }),
    new CC({ id: 866, gate: 2, value: 1 }),
    new CC({ id: 866, gate: 3, value: 1 }),
  ]),
]);
