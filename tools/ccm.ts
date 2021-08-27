import {
  CCM,
  ControlChangeMacroList,
  Data,
  Folder,
  Gate,
  Value,
} from "./domino-define.ts";

export const ccmList = new ControlChangeMacroList([
  new Folder({ name: "Channel Message" }, [
    // An
    new CCM({ id: 129, name: "Polyphonic After Touch" }, {
      value: new Value(),
      gate: new Gate({ name: "Note No. (音階)", type: "Key" }),
      data: new Data("@PKP #GL #VL"),
    }),

    // Bn
    new Folder({ name: "[000-127] Control Change" }, [
      createCcCCM({ id: 0x00, name: "Bank Select(MSB)" }),
      createCcCCM({ id: 0x20, name: "Bank Select(LSB)" }),
      createCcCCM({ id: 0x01, name: "Modulation" }),
      createCcCCM({ id: 0x04, name: "2nd Expression" }),
      createCcCCM({ id: 0x05, name: "Portament Time" }),
      createCcCCM({ id: 0x06, name: "Data Entry(MSB)" }),
      createCcCCM({ id: 0x26, name: "Data Entry(LSB)" }),
      createCcCCM({ id: 0x07, name: "Volume" }),
      createCcCCM({ id: 0x0A, name: "Panpot" }),
      createCcCCM({ id: 0x0B, name: "Expression" }),
      createCcCCM({ id: 0x10, name: "VA After Touch" }),
      createCcCCM({ id: 0x40, name: "Hold" }),
      createCcCCM({ id: 0x41, name: "Portament" }),
      createCcCCM({ id: 0x42, name: "Sostenuto" }),
      createCcCCM({ id: 0x43, name: "Soft Pedal" }),
      createCcCCM({ id: 0x47, name: "Resonance" }),
      createCcCCM({ id: 0x48, name: "Release Time" }),
      createCcCCM({ id: 0x49, name: "Attack Time" }),
      createCcCCM({ id: 0x4A, name: "Brightness" }),
      createCcCCM({ id: 0x4B, name: "Decay Time" }),
      createCcCCM({ id: 0x4C, name: "Vibrato Rate" }),
      createCcCCM({ id: 0x4D, name: "Vibrato Depth" }),
      createCcCCM({ id: 0x4E, name: "Vibrato Delay" }),
      createCcCCM({ id: 0x54, name: "Portament Control" }),
      createCcCCM({ id: 0x5B, name: "Reverb Send Level" }),
      createCcCCM({ id: 0x5D, name: "Chorus Send Level" }),
      createCcCCM({ id: 0x5E, name: "Variation Send Level" }),
      createCcCCM({ id: 0x60, name: "Data Increment" }),
      createCcCCM({ id: 0x61, name: "Data Decrement" }),
      createCcCCM({ id: 0x62, name: "NRPN(LSB)" }),
      createCcCCM({ id: 0x63, name: "NRPN(MSB)" }),
      createCcCCM({ id: 0x64, name: "RPN(LSB)" }),
      createCcCCM({ id: 0x65, name: "RPN(MSB)" }),
      createCcCCMFix({ id: 0x78, name: "All Sound Off" }),
      createCcCCMFix({ id: 0x79, name: "Reset All Controllers" }),
      createCcCCMFix({ id: 0x7B, name: "All Notes Off" }),
      createCcCCMFix({ id: 0x7C, name: "Omni Mode Off" }),
      createCcCCMFix({ id: 0x7D, name: "Omni Mode On" }),
      createCcCCMFix({ id: 0x7E, name: "Mono Mode On" }),
      createCcCCMFix({ id: 0x7F, name: "Poly Mode On" }),
    ]),
  ]),
]);

function createCcCCM({ id, name }: { id: number; name: string }) {
  return new CCM({ id, name: `[${("000" + id).slice(-3)}] ${name}` }, {
    value: new Value(),
    data: new Data(`@CC 0x${id.toString(16)} #VL`),
  });
}

function createCcCCMFix({ id, name }: { id: number; name: string }) {
  return new CCM({ id, name: `[${id}] ${name}` }, {
    data: new Data(`@CC 0x${id.toString(16)} 0x00`),
  });
}
