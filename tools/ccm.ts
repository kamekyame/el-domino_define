// Copyright 2022 kamekyame. All rights reserved. MIT license.

import { Domino } from "../deps.ts";

import Encoding from "https://esm.sh/encoding-japanese";

// mu50.xmlのControlChangeMacroListの一部を統合するために読み込み
const f = await Deno.readFile("./memo/mu50.xml");
const mu50Str = Encoding.convert(f, {
  to: "UTF8",
  from: "SJIS",
  type: "string",
});
const mu50 = Domino.File.fromXML(mu50Str);
const mu50CcmList = mu50.moduleData.controlChangeMacroList;
if (!mu50CcmList) {
  throw new Error("mu50.xml ControlChangeMacroList is not found");
}
function filterCCM(ccm: Domino.CCMFolder | Domino.ControlChangeMacroList) {
  return ccm.tags.filter((tag) => {
    if (
      tag instanceof Domino.CCM &&
      (tag.param.id < 140 || tag.param.id === 200 || tag.param.id === 210 ||
        tag.param.id === 275)
    ) {
      return false;
    }
    if (tag instanceof Domino.CCMFolder) {
      tag.tags = filterCCM(tag);
      if (tag.tags.length === 0) return false;
    }
    return true;
  });
}
const mu50XgParamChangeCcmFolder =
  ((mu50CcmList.tags[2] as Domino.CCMFolder).tags[0] as Domino.CCMFolder)
    .tags[2] as Domino.CCMFolder;
const mu50XgParamChangeTags = mu50XgParamChangeCcmFolder.tags;
mu50XgParamChangeCcmFolder.tags = [];
const addCcmList = filterCCM(mu50CcmList);

const midiParamMM = [
  new Domino.Entry({ value: 0, label: "UK1" }),
  new Domino.Entry({ value: 1, label: "UK2" }),
  new Domino.Entry({ value: 2, label: "LK1" }),
  new Domino.Entry({ value: 3, label: "LK2" }),
  new Domino.Entry({ value: 4, label: "LEAD 1" }),
  new Domino.Entry({ value: 5, label: "LEAD 2" }),
  new Domino.Entry({ value: 6, label: "PEDAL 1" }),
  new Domino.Entry({ value: 7, label: "PEDAL 2" }),
];

// 0x00 : OFF , 0x01 : ON
const swTable1 = new Domino.Table({ id: 2 }, [
  new Domino.Entry({ value: 0x00, label: "OFF" }),
  new Domino.Entry({ value: 0x01, label: "ON" }),
]);

// 0x00 : OFF , 0x7F : ON
const swTable2 = new Domino.Table({ id: 1 }, [
  new Domino.Entry({ value: 0x00, label: "OFF" }),
  new Domino.Entry({ value: 0x7F, label: "ON" }),
]);

const chTable = new Domino.Table({ id: 3 }, [
  new Domino.Entry({ value: 1, label: "CH1" }),
  new Domino.Entry({ value: 2, label: "CH2" }),
  new Domino.Entry({ value: 3, label: "CH3" }),
  new Domino.Entry({ value: 4, label: "CH4" }),
  new Domino.Entry({ value: 5, label: "CH5" }),
  new Domino.Entry({ value: 6, label: "CH6" }),
  new Domino.Entry({ value: 7, label: "CH7" }),
  new Domino.Entry({ value: 8, label: "CH8" }),
  new Domino.Entry({ value: 9, label: "CH9" }),
  new Domino.Entry({ value: 10, label: "CH10" }),
  new Domino.Entry({ value: 11, label: "CH11" }),
  new Domino.Entry({ value: 12, label: "CH12" }),
  new Domino.Entry({ value: 13, label: "CH13" }),
  new Domino.Entry({ value: 14, label: "CH14" }),
  new Domino.Entry({ value: 15, label: "CH15" }),
  new Domino.Entry({ value: 16, label: "CH16" }),
]);

const seqTable = new Domino.Table({ id: 4 }, [
  new Domino.Entry({ value: 0, label: "SEQ.1" }),
  new Domino.Entry({ value: 1, label: "SEQ.2" }),
  new Domino.Entry({ value: 2, label: "SEQ.3" }),
  new Domino.Entry({ value: 3, label: "SEQ.4" }),
]);

const chGate = new Domino.Gate({
  min: 0x01,
  max: 0x10,
  offset: -1,
  tableId: chTable.param.id,
});

export const ccmList = new Domino.ControlChangeMacroList([
  seqTable,
  new Domino.CCMFolder({ name: "Channel Message" }, [
    swTable1,
    swTable2,
    chTable,
    // An
    new Domino.CCM({ id: 129, name: "Polyphonic After Touch" }, {
      value: new Domino.Value(),
      gate: new Domino.Gate({ name: "Note No. (音階)", type: "Key" }),
      data: new Domino.Data("@PKP #GL #VL"),
    }),

    // Bn
    new Domino.CCMFolder({ name: "[000-127] Control Change" }, [
      createCcCCM({ id: 0x00, name: "Bank Select(MSB)" }),
      createCcCCM({ id: 0x20, name: "Bank Select(LSB)" }),
      createCcCCM({ id: 0x01, name: "Modulation" }),
      createCcCCM({ id: 0x04, name: "2nd Expression" }),
      createCcCCM({ id: 0x05, name: "Portament Time" }),
      createCcCCM({ id: 0x06, name: "Data Entry(MSB)" }),
      createCcCCM({ id: 0x26, name: "Data Entry(LSB)" }),
      createCcCCM({ id: 0x07, name: "Volume" }),
      createCcCCM({ id: 0x0A, name: "Panpot" }, {
        min: -64,
        max: 63,
        offset: 64,
      }),
      createCcCCM({ id: 0x0B, name: "Expression" }),
      createCcCCM({ id: 0x10, name: "VA After Touch" }),
      createCcCCM({ id: 0x40, name: "Hold" }, { tableId: swTable2.param.id }),
      createCcCCM({ id: 0x41, name: "Portament" }, {
        tableId: swTable2.param.id,
      }),
      createCcCCM({ id: 0x42, name: "Sostenuto" }, {
        tableId: swTable2.param.id,
      }),
      createCcCCM({ id: 0x43, name: "Soft Pedal" }, {
        tableId: swTable2.param.id,
      }),
      createCcCCM({ id: 0x47, name: "Resonance" }, {
        min: -64,
        max: 63,
        offset: 64,
      }),
      createCcCCM({ id: 0x48, name: "Release Time" }, {
        min: -64,
        max: 63,
        offset: 64,
      }),
      createCcCCM({ id: 0x49, name: "Attack Time" }, {
        min: -64,
        max: 63,
        offset: 64,
      }),
      createCcCCM({ id: 0x4A, name: "Brightness" }, {
        min: -64,
        max: 63,
        offset: 64,
      }),
      createCcCCM({ id: 0x4B, name: "Decay Time" }, {
        min: -64,
        max: 63,
        offset: 64,
      }),
      createCcCCM({ id: 0x4C, name: "Vibrato Rate" }, {
        min: -64,
        max: 63,
        offset: 64,
      }),
      createCcCCM({ id: 0x4D, name: "Vibrato Depth" }, {
        min: -64,
        max: 63,
        offset: 64,
      }),
      createCcCCM({ id: 0x4E, name: "Vibrato Delay" }, {
        min: -64,
        max: 63,
        offset: 64,
      }),
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

    // Dn
    new Domino.CCM({ id: 128, name: "After Touch" }, {
      value: new Domino.Value(),
      data: new Domino.Data("@CP #VL"),
    }),

    // En
    new Domino.CCM({ id: 130, name: "Pitch Bend" }, {
      value: new Domino.Value({ min: -8192, max: 8191, offset: 8192 }),
      data: new Domino.Data("@PB #VH #VL"),
    }),
  ]),
  new Domino.CCMFolder({ name: "Exclusive Message" }, [
    new Domino.CCMFolder({ name: "Universal Realtime Messages" }, [
      new Domino.CCM({ id: 210, name: "GM2 Master Volume", color: "#FF0000" }, {
        value: new Domino.Value({ default: 127 }),
        gate: new Domino.Gate({ name: "Device Number", default: 0x7f }),
        data: new Domino.Data("@SYSEX F0H 7FH #GL 04H 01H #VH #VL F7H"),
      }),
      new Domino.CCM({ id: 501, name: "GM2 Master Fine Tuning" }, {
        value: new Domino.Value(),
        gate: new Domino.Gate({ name: "Device Number", default: 0x7f }),
        data: new Domino.Data("@SYSEX F0H 7FH #GL 04H 03H #VH #VL F7H"),
      }),
      new Domino.CCM({ id: 502, name: "GM2 Master Coarse Tuning" }, {
        value: new Domino.Value(),
        gate: new Domino.Gate({ name: "Device Number", default: 0x7f }),
        data: new Domino.Data("@SYSEX F0H 7FH #GL 04H 04H 00H #VL F7H"),
      }),
    ]),
    new Domino.CCMFolder({ name: "Universal Non-Realtime Messages" }, [
      new Domino.CCM({ id: 200, name: "GM ON" }, {
        gate: new Domino.Gate({ name: "Device Number", default: 0x7f }, [
          new Domino.Entry({ label: "Broadcast", value: 0x7f }),
        ]),
        data: new Domino.Data("@SYSEX F0H 7EH #GL 09H 01H F7H"),
      }),
      new Domino.CCM({ id: 504, name: "GM2 ON" }, {
        gate: new Domino.Gate({ name: "Device Number", default: 0x7f }),
        data: new Domino.Data("@SYSEX F0H 7EH #GL 09H 03H F7H"),
      }),
      new Domino.CCM({ id: 505, name: "GM OFF" }, {
        gate: new Domino.Gate({ name: "Device Number", default: 0x7f }),
        data: new Domino.Data("@SYSEX F0H 7EH #GL 09H 02H F7H"),
      }),
    ]),
    new Domino.CCMFolder({ name: "XG Native" }, [
      new Domino.CCMFolder({ name: "XG Parameter Change" }, [
        new Domino.CCM({ id: 1207, name: "Part Mode" }, {
          gate: chGate,
          value: new Domino.Value({ min: 0x00, max: 0x03 }, [
            new Domino.Entry({ label: "NORMAL", value: 0x00 }),
            new Domino.Entry({ label: "DRUM", value: 0x01 }),
            new Domino.Entry({ label: "DRUMS1(Main Drum)", value: 0x02 }),
            new Domino.Entry({ label: "DRUMS2(Add Drum)", value: 0x03 }),
            // new Domino.Entry({ label: "DRUMS3", value: 0x04 }), ELS-02Cでは非対応を確認済み
            // new Domino.Entry({ label: "DRUMS4", value: 0x05 }), ELS-02Cでは非対応を確認済み
          ]),
          data: new Domino.Data(`@SYSEX F0H 43H 10H 4CH 08H #GL 07H #VL F7H`),
        }),
        ...mu50XgParamChangeTags,
      ]),
      new Domino.CCM({ id: 275, name: "XG Master Tuning" }, {
        value: new Domino.Value({ min: -100, max: 100, offset: 128 }),
        data: new Domino.Data(
          `@SYSEX F0H 43H 10H 27H 30H 00H 00H #VF2 #VF1 00H F7H`,
        ),
      }),
    ]),
    new Domino.CCMFolder({ name: "Clavinova Exclusive" }, [
      new Domino.CCM({ id: 506, name: "Request for Internal Sync. Mode" }, {
        data: new Domino.Data("@SYSEX F0H 43H 73H 01H 02H F7H"),
      }),
      new Domino.CCM({ id: 507, name: "Request for External Sync. Mode" }, {
        data: new Domino.Data("@SYSEX F0H 43H 73H 01H 02H F7H"),
      }),
      new Domino.CCM({ id: 1208, name: "Clavinova function" }, {
        data: new Domino.Data("@SYSEX F0H 43H 73H 39H 11H 00H 46H 00H F7H"),
      }),
      new Domino.CCM({ id: 1209, name: "Clavinova function" }, {
        data: new Domino.Data(
          "@SYSEX F0H 43H 73H 01H 51H 05H 00H 01H 08H 00H 00H 00H 00H 00H 00H 00H 00H F7H",
        ),
      }),
      new Domino.CCM({ id: 1210, name: "Clavinova function" }, {
        data: new Domino.Data(
          "@SYSEX F0H 43H 73H 01H 51H 05H 00H 02H 08H 00H 00H 00H 00H 00H 00H 00H 00H F7H",
        ),
      }),
    ]),
    new Domino.CCMFolder({ name: "Message Exclusive" }, [
      new Domino.CCM({ id: 508, name: "Rhythm Start" }, {
        data: new Domino.Data("@SYSEX F0H 43H 60H 7AH F7H"),
      }),
      new Domino.CCM({ id: 509, name: "Rhythm Stop" }, {
        data: new Domino.Data("@SYSEX F0H 43H 60H 7DH F7H"),
      }),
    ]),
    new Domino.CCMFolder({ name: "Electone Exclusive" }, [
      new Domino.CCM({ id: 510, name: "Switch" }, {
        value: new Domino.Value({}, [
          new Domino.Entry({ label: "ON", value: 0x7F }),
          new Domino.Entry({ label: "OFF", value: 0x00 }),
        ]),
        gate: new Domino.Gate({}, [
          new Domino.Entry({ label: "Left Footswitch", value: 0x45 }),
          new Domino.Entry({ label: "Knee Lever", value: 0x47 }),
          new Domino.Entry({ label: "Solo Bar", value: 0x4D }),
        ]),
        data: new Domino.Data("@SYSEX F0H 43H 70H 70H 40H #GL #VL F7H"),
      }),
      new Domino.CCMFolder({ name: "Panel Switch Events" }, [
        new Domino.Table(
          { id: 300 },
          [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            0xA,
            0xB,
            0xC,
            0xE,
            0x10,
            0x12,
            0x14,
            0x17,
            0x1A,
            0x1D,
            0x20,
            0x24,
            0x28,
            0x2C,
            0x7F,
          ].map((v, i) =>
            new Domino.Entry({ label: `Volume${Math.abs(i - 24)}`, value: v })
          ),
        ),
        new Domino.Table({ id: 302 }, [
          new Domino.Entry({ value: 0x00, label: "BRILLIANT" }),
          new Domino.Entry({ value: 0x06, label: "MELLOW" }),
        ]),
        new Domino.CCMFolder({ name: "Selectors" }, [
          new Domino.CCM({ id: 511, name: "Registration Memory" }, {
            value: new Domino.Value(
              { min: 1, max: 16, offset: -1 },
              [...Array(16)].map((_, i) =>
                new Domino.Entry({ label: `Memory ${i + 1}`, value: i + 1 })
              ),
            ),
            data: new Domino.Data("@SYSEX F0H 43H 70H 78H 41H 0FH #VL F7H"),
          }),
        ]),
        new Domino.CCMFolder({ name: "Volume" }, [
          createExPanelVolumeCCM(512, 0x12, "Upper Keyboard Voice 1 Volume"),
          createExPanelVolumeCCM(513, 0x13, "Lower Keyboard Voice 1 Volume"),
          createExPanelVolumeCCM(514, 0x14, "Upper Keyboard Voice 2 Volume"),
          createExPanelVolumeCCM(515, 0x15, "Lower Keyboard Voice 2 Volume"),
          createExPanelVolumeCCM(516, 0x16, "Lead Voice 1 Volume"),
          createExPanelVolumeCCM(517, 0x17, "Pedal Voice 1 Volume"),
          createExPanelVolumeCCM(518, 0x18, "Pedal Voice 2 Volume"),
          createExPanelVolumeCCM(519, 0x19, "Lead Voice 2 Volume"),
          createExPanelVolumeCCM(520, 0x1A, "Percussion Volume"),
          createExPanelVolumeCCM(521, 0x1B, "Reverb Depth"),
        ]),
        new Domino.CCMFolder({ name: "Organ Flute Voice" }, [
          createExPanelSwCCM(522, 0x30, "Upper Organ Flute Voice"),
          createExPanelSwCCM(523, 0x31, "Lower Organ Flute Voice"),
        ]),
        new Domino.CCMFolder({ name: "To Lower" }, [
          createExPanelSwCCM(524, 0x36, "Lead Voice 1 To Lower"),
          createExPanelSwCCM(525, 0x37, "Pedal Voice 1 To Lower"),
          createExPanelSwCCM(526, 0x38, "Pedal Voice 2 To Lower"),
        ]),
        new Domino.CCMFolder({ name: "Solo Mode" }, [
          createExPanelSwCCM(527, 0x39, "Lead Voice 2 Solo (Knee)"),
        ]),
        new Domino.CCMFolder({ name: "Brilliance" }, [
          createExPanelBrillianceCCM(
            528,
            0x42,
            "Upper Keyboard Voice 1 Brilliance",
          ),
          createExPanelBrillianceCCM(
            529,
            0x43,
            "Lower Keyboard Voice 1 Brilliance",
          ),
          createExPanelBrillianceCCM(
            530,
            0x44,
            "Upper Keyboard Voice 2 Brilliance",
          ),
          createExPanelBrillianceCCM(
            531,
            0x45,
            "Lower Keyboard Voice 2 Brilliance",
          ),
          createExPanelBrillianceCCM(532, 0x46, "Lead Voice 1 Brilliance"),
          createExPanelBrillianceCCM(533, 0x47, "Pedal Voice 1 Brilliance"),
          createExPanelBrillianceCCM(534, 0x48, "Pedal Voice 2 Brilliance"),
          createExPanelBrillianceCCM(535, 0x49, "Lead Voice 2 Brilliance"),
        ]),
        new Domino.CCMFolder({ name: "Sustain" }, [
          createExPanelSwCCM(536, 0x50, "Upper Sustain"),
          createExPanelSwCCM(537, 0x51, "Lower Sustain"),
          createExPanelSwCCM(538, 0x52, "Pedal Sustain"),
        ]),
        new Domino.CCMFolder({ name: "Solo Bar" }, [
          createExPanelSwCCM(539, 0x59, "Solo Bar"),
        ]),
        new Domino.CCMFolder({ name: "Keyboard Percussion" }, [
          createExPanelSwCCM(540, 0x5B, "Keyboard Percussion [1]"),
          createExPanelSwCCM(541, 0x5C, "Keyboard Percussion [2]"),
        ]),
        new Domino.CCMFolder({ name: "Disable" }, [
          createExPanelSwCCM(542, 0x5F, "Disable [D.]"),
        ]),
        new Domino.CCMFolder({ name: "Rotary Speaker" }, [
          createExPanelSwCCM(543, 0x60, "Rotary Speaker Speed"),
        ]),
        new Domino.CCMFolder({ name: "Sequence" }, [
          new Domino.CCM({
            id: 544,
            name: "Sequence [SEQ.1] - [SEQ.4] (Panel SW Event)",
          }, {
            value: new Domino.Value({
              min: 0,
              max: 1,
              tableId: swTable1.param.id,
            }),
            gate: new Domino.Gate({
              min: 0,
              max: 3,
              tableId: seqTable.param.id,
              offset: 0x61,
            }),
            data: new Domino.Data(`@SYSEX F0H 43H 70H 78H 41H #GL #VL F7H`),
            memo:
              `パネルスイッチイベントとしてシーケンスボタンを制御します。\n同様のものに、CCM866のMIDIパラメータとして制御する方法もあります。`,
          }),
        ]),
      ]),
      new Domino.CCMFolder({ name: "Midi Parameter" }, [
        new Domino.CCMFolder({ name: "VoiceSection Parameters" }, [
          new Domino.CCMFolder({ name: "Panel Voice Parameters" }, [
            new Domino.Table({ id: 400 }, midiParamMM),
            createExMidi1CCM(548, 0x10, 0x10, "Voice Selector Number", {
              min: 0,
              max: 0x0D,
            }),
            createExMidi1CCM(549, 0x10, 0x11, "Volume"),
            createExMidi1CCM(550, 0x10, 0x12, "Reverb (Send Level)"),
            createExMidi1CCM(551, 0x10, 0x13, "Brilliance", {
              min: -64,
              max: 63,
              offset: 64,
            }),
            new Domino.CCM({ id: 552, name: "Feet" }, {
              value: new Domino.Value({ min: 0, max: 4 }, [
                new Domino.Entry({ value: 0, label: "PRESET" }),
                new Domino.Entry({ value: 1, label: "16'" }),
                new Domino.Entry({ value: 2, label: "8'" }),
                new Domino.Entry({ value: 3, label: "4'" }),
                new Domino.Entry({ value: 4, label: "2'" }),
              ]),
              gate: new Domino.Gate({ min: 0, max: 7, tableId: 400 }),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 10H #GL 14H #VL F7H`,
              ),
            }),
            createExMidi1CCM(553, 0x10, 0x15, "Pan", {
              min: -64,
              max: 63,
              offset: 64,
            }),
            createExMidi1CCM(554, 0x10, 0x16, "Touch Tone Initial Touch"),
            createExMidi1CCM(555, 0x10, 0x17, "Touch Tone After Touch"),
            createExMidi1CCM(556, 0x10, 0x18, "Pitch After Touch"),
            createExMidi1CCM(557, 0x10, 0x19, "User Vibrato"),
            createExMidi1CCM(558, 0x10, 0x1A, "Vibrato Delay"),
            createExMidi1CCM(559, 0x10, 0x1B, "Vibrato Depth"),
            createExMidi1CCM(560, 0x10, 0x1C, "Vibrato Speed"),
            createExMidi1CCM(561, 0x10, 0x1D, "Pitch Horizontal Touch"),
            new Domino.CCM({ id: 562, name: "Touch Vibrato" }, {
              value: new Domino.Value({ tableId: swTable2.param.id }),
              gate: new Domino.Gate({ min: 0, max: 7, tableId: 400 }),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 10H #GL 1EH #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 563, name: "TO LOWER ▲/▼/SOLO (KNEE)" }, {
              value: new Domino.Value({ tableId: swTable1.param.id }),
              gate: new Domino.Gate({ min: 4, max: 7 }, midiParamMM.slice(4)),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 10H #GL 1FH #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 564, name: "Slide" }, {
              value: new Domino.Value({}, [
                new Domino.Entry({ value: 0x00, label: "OFF" }),
                new Domino.Entry({ value: 0x01, label: "ON" }),
                new Domino.Entry({ value: 0x02, label: "Knee Lever" }),
              ]),
              gate: new Domino.Gate(
                { min: 4, max: 5 },
                midiParamMM.slice(4, 6),
              ),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 10H #GL 20H #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 565, name: "Slide Time" }, {
              value: new Domino.Value(),
              gate: new Domino.Gate(
                { min: 4, max: 5 },
                midiParamMM.slice(4, 6),
              ),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 10H #GL 21H #VL F7H`,
              ),
            }),
            createExMidi1CCM(566, 0x10, 0x22, "Tune/Detune", {
              min: -64,
              max: 63,
              offset: 64,
            }),
            new Domino.CCM({ id: 567, name: "2nd Expression Pitch Bend" }, {
              value: new Domino.Value({ tableId: swTable1.param.id }),
              gate: new Domino.Gate({ min: 0, max: 7 }, [
                ...midiParamMM.slice(0, 2),
                ...midiParamMM.slice(4),
              ]),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 10H #GL 23H #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 568, name: "Footswitch Glide Control" }, {
              value: new Domino.Value({ tableId: swTable1.param.id }),
              gate: new Domino.Gate(
                { min: 0, max: 5 },
                midiParamMM.slice(0, 6),
              ),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 10H #GL 24H #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 569, name: "Transpose" }, {
              value: new Domino.Value({ min: 0x3A, max: 0x46 }, [
                new Domino.Entry({ value: 0x3A, label: "KeyDown" }),
                new Domino.Entry({ value: 0x40, label: "Normal" }),
                new Domino.Entry({ value: 0x46, label: "KeyUp" }),
              ]),
              gate: new Domino.Gate(
                { min: 0, max: 5 },
                midiParamMM.slice(0, 6),
              ),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 10H #GL 25H #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 570, name: "Poly" }, {
              value: new Domino.Value({ min: 0x00, max: 0x01 }, [
                new Domino.Entry({ value: 0x00, label: "Mono" }),
                new Domino.Entry({ value: 0x01, label: "Poly" }),
              ]),
              gate: new Domino.Gate({ min: 6, max: 7 }, midiParamMM.slice(6)),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 10H #GL 28H #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 571, name: "Priority" }, {
              value: new Domino.Value({ min: 0x00, max: 0x01 }, [
                new Domino.Entry({ value: 0x00, label: "TOP" }),
                new Domino.Entry({ value: 0x01, label: "LAST" }),
              ]),
              gate: new Domino.Gate(
                { min: 5, max: 5 },
                midiParamMM.slice(5, 6),
              ),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 10H #GL 29H #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 572, name: "Volume Mute" }, {
              value: new Domino.Value({
                min: 0x00,
                max: 0x01,
                tableId: swTable1.param.id,
              }),
              gate: new Domino.Gate({ min: 0, max: 7, tableId: 400 }),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 10H #GL 2AH #VL F7H`,
              ),
            }),
            createExMidi3CCM(573, 0x10, 0x40, "Effect1 Type"),
            createExMidi2CCM(574, 0x10, 0x41, "Effect1 Parameter 1"),
            createExMidi2CCM(575, 0x10, 0x42, "Effect1 Parameter 2"),
            createExMidi2CCM(576, 0x10, 0x43, "Effect1 Parameter 3"),
            createExMidi2CCM(577, 0x10, 0x44, "Effect1 Parameter 4"),
            createExMidi2CCM(578, 0x10, 0x45, "Effect1 Parameter 5"),
            createExMidi2CCM(579, 0x10, 0x46, "Effect1 Parameter 6"),
            createExMidi2CCM(580, 0x10, 0x47, "Effect1 Parameter 7"),
            createExMidi2CCM(581, 0x10, 0x48, "Effect1 Parameter 8"),
            createExMidi2CCM(582, 0x10, 0x49, "Effect1 Parameter 9"),
            createExMidi2CCM(583, 0x10, 0x4A, "Effect1 Parameter 10"),
            createExMidi2CCM(584, 0x10, 0x4B, "Effect1 Parameter 11"),
            createExMidi2CCM(585, 0x10, 0x4C, "Effect1 Parameter 12"),
            createExMidi2CCM(586, 0x10, 0x4D, "Effect1 Parameter 13"),
            createExMidi2CCM(587, 0x10, 0x4E, "Effect1 Parameter 14"),
            createExMidi2CCM(588, 0x10, 0x4F, "Effect1 Parameter 15"),
            createExMidi2CCM(589, 0x10, 0x50, "Effect1 Parameter 16"),
            createExMidi3CCM(590, 0x10, 0x51, "Effect2 Type"),
            createExMidi2CCM(591, 0x10, 0x52, "Effect2 Parameter 1"),
            createExMidi2CCM(592, 0x10, 0x53, "Effect2 Parameter 2"),
            createExMidi2CCM(593, 0x10, 0x54, "Effect2 Parameter 3"),
            createExMidi2CCM(594, 0x10, 0x55, "Effect2 Parameter 4"),
            createExMidi2CCM(595, 0x10, 0x56, "Effect2 Parameter 5"),
            createExMidi2CCM(596, 0x10, 0x57, "Effect2 Parameter 6"),
            createExMidi2CCM(597, 0x10, 0x58, "Effect2 Parameter 7"),
            createExMidi2CCM(598, 0x10, 0x59, "Effect2 Parameter 8"),
            createExMidi2CCM(599, 0x10, 0x5A, "Effect2 Parameter 9"),
            createExMidi2CCM(800, 0x10, 0x5B, "Effect2 Parameter 10"),
            createExMidi2CCM(801, 0x10, 0x5C, "Effect2 Parameter 11"),
            createExMidi2CCM(802, 0x10, 0x5D, "Effect2 Parameter 12"),
            createExMidi2CCM(803, 0x10, 0x5E, "Effect2 Parameter 13"),
            createExMidi2CCM(804, 0x10, 0x5F, "Effect2 Parameter 14"),
            createExMidi2CCM(805, 0x10, 0x60, "Effect2 Parameter 15"),
            createExMidi2CCM(806, 0x10, 0x61, "Effect2 Parameter 16"),
            createExMidi1CCM(807, 0x10, 0x63, "Sustain Length"),
            new Domino.CCM({ id: 808, name: "ARTICULATION FOOT SW LEFT" }, {
              value: new Domino.Value({ min: 0x00, max: 0x02 }, [
                new Domino.Entry({ value: 0x00, label: "OFF" }),
                new Domino.Entry({ value: 0x01, label: "ART.1" }),
                new Domino.Entry({ value: 0x02, label: "ART.2" }),
              ]),
              gate: new Domino.Gate({ min: 0, max: 7, tableId: 400 }),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 10H #GL 64H #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 809, name: "ARTICULATION AUTO" }, {
              value: new Domino.Value({
                min: 0x00,
                max: 0x01,
                tableId: swTable1.param.id,
              }),
              gate: new Domino.Gate({ min: 0, max: 7, tableId: 400 }),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 10H #GL 65H #VL F7H`,
              ),
            }),
          ]),
          new Domino.CCMFolder({ name: "Organ Flute Voice Parameters" }, [
            new Domino.Table({ id: 500 }, [
              new Domino.Entry({ value: 0x00, label: "UK" }),
              new Domino.Entry({ value: 0x01, label: "LK" }),
            ]),
            createExMidiOrgan1CCM(810, 0x00, "Footage 16'"),
            createExMidiOrgan1CCM(811, 0x01, "Footage 8'"),
            createExMidiOrgan1CCM(812, 0x02, "Footage 5-1/3'"),
            createExMidiOrgan1CCM(813, 0x03, "Footage 4'"),
            createExMidiOrgan1CCM(814, 0x04, "Footage 2-2/3'"),
            createExMidiOrgan1CCM(815, 0x05, "Footage 2'"),
            createExMidiOrgan1CCM(816, 0x06, "Footage 1-3/5'"),
            createExMidiOrgan1CCM(817, 0x07, "Footage 1-1/3'"),
            createExMidiOrgan1CCM(818, 0x08, "Footage 1'"),
            createExMidiOrgan1CCM(819, 0x09, "Response"),
            createExMidiOrgan1CCM(820, 0x0A, "Attack 4'"),
            createExMidiOrgan1CCM(821, 0x0B, "Attack 2-2/3'"),
            createExMidiOrgan1CCM(822, 0x0C, "Attack 2'"),
            createExMidiOrgan1CCM(823, 0x0D, "Attack Length"),
            new Domino.CCM({ id: 824, name: "Organ Flutes" }, {
              value: new Domino.Value({
                min: 0,
                max: 0x1,
                tableId: swTable1.param.id,
              }),
              gate: new Domino.Gate({ min: 0, max: 1, tableId: 500 }),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 11H #GL 10H #VL F7H`,
              ),
            }),
            createExMidiOrgan1CCM(825, 0x11, "Volume"),
            createExMidiOrgan1CCM(826, 0x12, "Reverb (Send Level)"),
            new Domino.CCM({ id: 827, name: "Type" }, {
              value: new Domino.Value({ min: 0, max: 0x2 }, [
                new Domino.Entry({ value: 0x00, label: "Sine" }),
                new Domino.Entry({ value: 0x01, label: "Vintage" }),
                new Domino.Entry({ value: 0x02, label: "Euro" }),
              ]),
              gate: new Domino.Gate({ min: 0, max: 1, tableId: 500 }),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 11H #GL 13H #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 828, name: "Vibrato On/Off" }, {
              value: new Domino.Value({
                min: 0,
                max: 0x1,
                tableId: swTable1.param.id,
              }),
              gate: new Domino.Gate({ min: 0, max: 1, tableId: 500 }),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 11H #GL 19H #VL F7H`,
              ),
            }),
            createExMidiOrgan1CCM(829, 0x1B, "Vibrato Depth"),
            createExMidiOrgan1CCM(830, 0x1C, "Vibrato Speed"),
            createExMidiOrgan3CCM(831, 0x40, "Effect Type"),
            createExMidiOrgan2CCM(832, 0x41, "Effect Parameter 1"),
            createExMidiOrgan2CCM(833, 0x42, "Effect Parameter 2"),
            createExMidiOrgan2CCM(834, 0x43, "Effect Parameter 3"),
            createExMidiOrgan2CCM(835, 0x44, "Effect Parameter 4"),
            createExMidiOrgan2CCM(836, 0x45, "Effect Parameter 5"),
            createExMidiOrgan2CCM(837, 0x46, "Effect Parameter 6"),
            createExMidiOrgan2CCM(838, 0x47, "Effect Parameter 7"),
            createExMidiOrgan2CCM(839, 0x48, "Effect Parameter 8"),
            createExMidiOrgan2CCM(840, 0x49, "Effect Parameter 9"),
            createExMidiOrgan2CCM(841, 0x4A, "Effect Parameter 10"),
            createExMidiOrgan2CCM(842, 0x4B, "Effect Parameter 11"),
            createExMidiOrgan2CCM(843, 0x4C, "Effect Parameter 12"),
            createExMidiOrgan2CCM(844, 0x4D, "Effect Parameter 13"),
            createExMidiOrgan2CCM(845, 0x4E, "Effect Parameter 14"),
            createExMidiOrgan2CCM(846, 0x4F, "Effect Parameter 15"),
            createExMidiOrgan2CCM(847, 0x50, "Effect Parameter 16"),
            createExMidiOrgan1CCM(848, 0x63, "Sustain Length"),
          ]),
        ]),
        new Domino.CCMFolder({ name: "Keyboard Parameters" }, [
          new Domino.CCMFolder({ name: "Sustain Parameters" }, [
            new Domino.Table({ id: 600 }, [
              new Domino.Entry({ value: 0x00, label: "UK" }),
              new Domino.Entry({ value: 0x01, label: "LK" }),
              new Domino.Entry({ value: 0x02, label: "PEDAL" }),
            ]),
            new Domino.CCM({ id: 849, name: "Sustain (On/Off)" }, {
              value: new Domino.Value({
                min: 0,
                max: 1,
                tableId: swTable1.param.id,
              }),
              gate: new Domino.Gate({ min: 0, max: 2, tableId: 600 }),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 12H #GL 00H #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 850, name: "Length" }, {
              value: new Domino.Value({ min: 0, max: 0x7F }),
              gate: new Domino.Gate({ min: 0, max: 2, tableId: 600 }),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 12H #GL 01H #VL F7H`,
              ),
            }),
          ]),
          new Domino.CCMFolder({ name: "Keyboard Percussion Parameters" }, [
            new Domino.Table({ id: 601 }, [
              new Domino.Entry({ value: 0x01, label: "K.B.P. [1]" }),
              new Domino.Entry({ value: 0x02, label: "K.B.P. [2]" }),
            ]),
            new Domino.CCM({ id: 851, name: "Keyboard Percussion (On/Off)" }, {
              value: new Domino.Value({
                min: 0,
                max: 1,
                tableId: swTable1.param.id,
              }),
              gate: new Domino.Gate({ min: 1, max: 2, tableId: 600 }),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 12H #GL 10H #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 852, name: "Keyboard Percussion Menu" }, {
              value: new Domino.Value({ min: 0, max: 28 }, [
                new Domino.Entry({ value: 0x00, label: "PRESET" }),
                ...[...Array(28)].map((_, i) =>
                  new Domino.Entry({ value: i + 1, label: `USER ${i + 1}` })
                ),
              ]),
              gate: new Domino.Gate({ min: 1, max: 2, tableId: 600 }),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 12H #GL 11H #VL F7H`,
              ),
            }),
          ]),
        ]),
        new Domino.CCMFolder({ name: "Rhythm" }, [
          new Domino.CCMFolder({ name: "Rhythm Parameters" }, [
            createExMidiRhythm1CCM(
              853,
              0x00,
              0x10,
              "Rhythm Selector Number",
              {
                min: 0,
                max: 0xB,
              },
            ),
            createExMidiRhythm1CCM(854, 0x00, 0x11, "Percussion Volume"),
            createExMidiRhythm1CCM(
              855,
              0x00,
              0x12,
              "Percussion Reverb (Send Level)",
            ),
            createExMidiRhythmBoolCCM(
              856,
              0x00,
              0x13,
              "2nd Expression Tempo Control",
            ),
            new Domino.CCM({ id: 857, name: "Footswitch Rhythm Control" }, {
              value: new Domino.Value({ min: 0, max: 0x7F }, [
                new Domino.Entry({ value: 0x00, label: "INTRO 1" }),
                new Domino.Entry({ value: 0x01, label: "INTRO 2" }),
                new Domino.Entry({ value: 0x02, label: "INTRO 3" }),
                new Domino.Entry({ value: 0x08, label: "MAIN A" }),
                new Domino.Entry({ value: 0x09, label: "MAIN B" }),
                new Domino.Entry({ value: 0x0A, label: "MAIN C" }),
                new Domino.Entry({ value: 0x0B, label: "MAIN D" }),
                new Domino.Entry({ value: 0x18, label: "BREAK" }),
                new Domino.Entry({ value: 0x20, label: "ENDING 1" }),
                new Domino.Entry({ value: 0x21, label: "ENDING 2" }),
                new Domino.Entry({ value: 0x22, label: "ENDING 3" }),
                new Domino.Entry({ value: 0x7E, label: "STOP" }),
                new Domino.Entry({ value: 0x7F, label: "OFF" }),
              ]),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 13H 00H 14H #VL F7H`,
              ),
            }),
            createExMidiRhythmBoolCCM(858, 0x00, 0x15, "Add Drum"),
            createExMidiRhythmBoolCCM(859, 0x00, 0x16, "Main Drum"),
            createExMidiRhythmBoolCCM(860, 0x00, 0x17, "Chord 1"),
            createExMidiRhythmBoolCCM(861, 0x00, 0x18, "Chord 2"),
            createExMidiRhythmBoolCCM(862, 0x00, 0x19, "Pad"),
            createExMidiRhythmBoolCCM(863, 0x00, 0x1A, "Phrase 1"),
            createExMidiRhythmBoolCCM(864, 0x00, 0x1B, "Phrase 2"),
            createExMidiRhythmBoolCCM(865, 0x00, 0x1C, "Auto Fill"),
          ]),
          new Domino.CCMFolder({ name: "Rhythm Sequence Parameters" }, [
            new Domino.CCM({
              id: 866,
              name: "Sequence [SEQ.1] - [SEQ.4] (MIDI Parameter)",
            }, {
              value: new Domino.Value({
                min: 0,
                max: 1,
                tableId: swTable1.param.id,
              }),
              gate: new Domino.Gate({
                min: 0,
                max: 3,
                tableId: seqTable.param.id,
              }),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 13H 01H #GL #VL F7H`,
              ),
              memo:
                `MIDIパラメータとしてシーケンスボタンを制御します。\n同様のものに、CCM544のパネルスイッチイベントとして制御する方法もあります。`,
            }),
          ]),
          new Domino.CCMFolder({ name: "Accompaniment Parameters" }, [
            createExMidiRhythm1CCM(867, 0x02, 0x11, "Accompaniment Volume"),
            createExMidiRhythm1CCM(
              868,
              0x02,
              0x12,
              "Accompaniment Reverb (Send Level",
            ),
          ]),
          new Domino.CCMFolder({ name: "A.B.C. Function Parameters" }, [
            new Domino.CCM({ id: 869, name: "Auto Bass Chord Mode" }, {
              value: new Domino.Value({ min: 0, max: 3 }, [
                new Domino.Entry({ value: 0, label: "OFF" }),
                new Domino.Entry({ value: 1, label: "Single Finger" }),
                new Domino.Entry({ value: 2, label: "Fingered" }),
                new Domino.Entry({ value: 3, label: "Custom A.B.C." }),
              ]),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 13H 03H 00H #VL F7H`,
              ),
            }),
            createExMidiRhythmBoolCCM(870, 0x03, 0x01, "Lower Memory"),
            createExMidiRhythmBoolCCM(871, 0x03, 0x02, "Pedal Memory"),
          ]),
          new Domino.CCMFolder({ name: "M.O.C. Function Parameters" }, [
            new Domino.CCM({ id: 872, name: "Melody On Chord Mode" }, {
              value: new Domino.Value({ min: 0, max: 3 }, [
                new Domino.Entry({ value: 0, label: "OFF" }),
                new Domino.Entry({ value: 1, label: "1" }),
                new Domino.Entry({ value: 2, label: "2" }),
                new Domino.Entry({ value: 3, label: "3" }),
              ]),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 13H 04H 00H #VL F7H`,
              ),
            }),
            createExMidiRhythmBoolCCM(
              873,
              0x04,
              0x01,
              "M.O.C.Knee Lever Control",
            ),
          ]),
          new Domino.CCMFolder({ name: "Section Parameters" }, [
            createExMidiRhythmBoolCCM(874, 0x05, 0x00, "Intro 1"),
            createExMidiRhythmBoolCCM(875, 0x05, 0x01, "Intro 2"),
            createExMidiRhythmBoolCCM(876, 0x05, 0x02, "Intro 3"),
            createExMidiRhythmBoolCCM(877, 0x05, 0x08, "Main A"),
            createExMidiRhythmBoolCCM(878, 0x05, 0x09, "Main B"),
            createExMidiRhythmBoolCCM(879, 0x05, 0x0A, "Main C"),
            createExMidiRhythmBoolCCM(880, 0x05, 0x0B, "Main D"),
            createExMidiRhythmBoolCCM(881, 0x05, 0x1B, "Break"),
            createExMidiRhythmBoolCCM(882, 0x05, 0x20, "Ending 1"),
            createExMidiRhythmBoolCCM(883, 0x05, 0x21, "Ending 2"),
            createExMidiRhythmBoolCCM(884, 0x05, 0x22, "Ending 3"),
          ]),
          new Domino.CCMFolder({ name: "Keyboard Percussion Parameters" }, [
            createExMidiRhythm1CCM(885, 0x10, 0x11, "Volume"),
            createExMidiRhythm1CCM(886, 0x10, 0x12, "Reverb (Send Level)"),
          ]),
        ]),
        new Domino.CCMFolder({ name: "Overall" }, [
          new Domino.CCMFolder({ name: "System Parameters" }, [
            new Domino.CCM({ id: 887, name: "Disable" }, {
              value: new Domino.Value({
                min: 0,
                max: 1,
                tableId: swTable1.param.id,
              }),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 00H 00H #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 888, name: "Organ Flute Attack Mode" }, {
              value: new Domino.Value({ min: 0, max: 1 }, [
                new Domino.Entry({ value: 0, label: "Each" }),
                new Domino.Entry({ value: 1, label: "Fiast" }),
              ]),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 00H 01H #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 889, name: "Transpose" }, {
              value: new Domino.Value({ min: 0x3A, max: 0x46 }, [
                new Domino.Entry({ value: 0x3A, label: "KeyDown" }),
                new Domino.Entry({ value: 0x40, label: "Normal" }),
                new Domino.Entry({ value: 0x46, label: "KeyUp" }),
              ]),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 00H 02H #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 890, name: "2nd Expression Range" }, {
              value: new Domino.Value({ min: 0x01, max: 0x0C }, [
                new Domino.Entry({ value: 0x01, label: "100 C" }),
                new Domino.Entry({ value: 0x0C, label: "1200 C" }),
              ]),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 00H 03H #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 891, name: "Footswitch Mode" }, {
              value: new Domino.Value({ min: 0x00, max: 0x03 }, [
                new Domino.Entry({ value: 0x00, label: "OFF" }),
                new Domino.Entry({ value: 0x01, label: "Rhythm" }),
                new Domino.Entry({ value: 0x02, label: "Glide" }),
                new Domino.Entry({ value: 0x03, label: "Rotary Speaker" }),
              ]),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 00H 04H #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 892, name: "Pitch" }, {
              value: new Domino.Value({ min: 0x00, max: 0x7F }, [
                new Domino.Entry({ value: 0x00, label: "PitchDown" }),
                new Domino.Entry({ value: 0x40, label: "Normal" }),
                new Domino.Entry({ value: 0x7F, label: "PitchUp" }),
              ]),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 00H 05H #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 893, name: "Footswitch Glide Time" }, {
              value: new Domino.Value({ min: 0x00, max: 0x7F }),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 00H 06H #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 894, name: "MIDI Control Expression" }, {
              value: new Domino.Value({ min: 0x00, max: 0x01 }, [
                new Domino.Entry({ value: 0x00, label: "Internal" }),
                new Domino.Entry({ value: 0x01, label: "External" }),
              ]),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 00H 08H #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 895, name: "MIDI Control Lead 1" }, {
              value: new Domino.Value({ min: 0x00, max: 0x01 }, [
                new Domino.Entry({ value: 0x00, label: "Internal" }),
                new Domino.Entry({ value: 0x01, label: "External" }),
              ]),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 00H 09H #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 896, name: "Disable Mode" }, {
              value: new Domino.Value({ min: 0x00, max: 0x01 }, [
                new Domino.Entry({ value: 0x00, label: "Normal" }),
                new Domino.Entry({ value: 0x01, label: "Tempo" }),
              ]),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 00H 0BH #VL F7H`,
              ),
            }),
          ]),
          new Domino.CCMFolder({ name: "Effect Parameters : Reverb" }, [
            new Domino.CCM({ id: 897, name: "Reverb Depth" }, {
              value: new Domino.Value({ min: 0x00, max: 0x7F }),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 01H 00H #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 898, name: "Reverb Time (Panel)" }, {
              value: new Domino.Value({ min: 0x00, max: 0x7F }),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 01H 01H #VL F7H`,
              ),
            }),
            new Domino.CCM({ id: 899, name: "Reverb Time (Rhythm)" }, {
              value: new Domino.Value({ min: 0x00, max: 0x7F }),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 02H 01H #VL F7H`,
              ),
            }),
          ]),
          new Domino.CCMFolder({ name: "Effect Parameters : Rotary Speaker" }, [
            new Domino.CCM({ id: 1200, name: "Rotary Speaker Speed" }, {
              value: new Domino.Value({
                min: 0x00,
                max: 0x01,
                tableId: swTable1.param.id,
              }),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 03H 00H #VL F7H`,
              ),
            }),
            new Domino.CCM({
              id: 1201,
              name: "Rotary Speaker Speed Control Mode",
            }, {
              value: new Domino.Value({ min: 0x00, max: 0x01 }, [
                new Domino.Entry({ value: 0x00, label: "STOP" }),
                new Domino.Entry({ value: 0x01, label: "SLOW" }),
              ]),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 03H 01H #VL F7H`,
              ),
            }),
            new Domino.CCM({
              id: 1202,
              name: "Rotary Speaker Speed Control Speed",
            }, {
              value: new Domino.Value({ min: 0x00, max: 0x7F }),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 03H 02H 00H #VL F7H`,
              ),
            }),
          ]),
          new Domino.CCMFolder({ name: "Other" }, [
            new Domino.CCM({ id: 1203, name: "Regist Bank" }, {
              value: new Domino.Value({ min: 0x00, max: 0x04 }, [
                new Domino.Entry({ value: 0x00, label: "Bank A" }),
                new Domino.Entry({ value: 0x01, label: "Bank B" }),
                new Domino.Entry({ value: 0x02, label: "Bank C" }),
                new Domino.Entry({ value: 0x03, label: "Bank D" }),
              ]),
              data: new Domino.Data(
                `@SYSEX F0H 43H 70H 78H 44H 7EH 00H 00H #VL F7H`,
              ),
            }),
          ]),
        ]),
      ]),
      new Domino.CCM({ id: 1204, name: "MDR" }, {
        value: new Domino.Value({ min: 0x01, max: 0x09 }, [
          new Domino.Entry({ value: 0x01, label: "Play Start" }),
          new Domino.Entry({ value: 0x02, label: "Play Stop" }),
          new Domino.Entry({ value: 0x03, label: "Record Start" }),
          new Domino.Entry({ value: 0x04, label: "Record Stop" }),
          new Domino.Entry({ value: 0x05, label: "Fast Forward Start" }),
          new Domino.Entry({ value: 0x06, label: "Fast Forward Stop" }),
          new Domino.Entry({ value: 0x09, label: "Rhythm Pointer Reset" }),
        ]),
        data: new Domino.Data(`@SYSEX F0H 43H 70H 70H 70H #VL F7H`),
      }),
      new Domino.CCM({ id: 1205, name: "EL ON" }, {
        data: new Domino.Data(`@SYSEX F0H 43H 70H 70H 73H F7H`),
      }),
      new Domino.CCM({ id: 1206, name: "Bar Signal" }, {
        data: new Domino.Data(`@SYSEX F0H 43H 70H 70H 78H 00H 00H F7H`),
      }),
    ]),
    new Domino.CCMFolder({ name: "XGWorks Exclusive" }, [
      new Domino.CCM({ id: 1211, name: "XGWorks Style Code" }, {
        data: new Domino.Data(
          "@SYSEX F0H 43H 76H 1AH 10H 00H 01H 01H #VL 01H 01H 01H #GL F7H",
        ),
      }),
      new Domino.CCM({ id: 1212, name: "XGWorks Style Code" }, {
        data: new Domino.Data(
          "@SYSEX F0H 43H 76H 1AH 10H 01H 01H 01H #VL 01H 01H 01H #GL F7H",
        ),
      }),
    ]),
  ]),
  ...addCcmList,
]);

function createCcCCM(
  { id, name }: { id: number; name: string },
  valueOption: typeof Domino.Value.prototype.param = {},
) {
  return new Domino.CCM({ id, name }, {
    value: new Domino.Value(valueOption),
    data: new Domino.Data(`@CC ${id} #VL`),
  });
}

function createCcCCMFix({ id, name }: { id: number; name: string }) {
  return new Domino.CCM({ id, name }, {
    data: new Domino.Data(`@CC ${id} 0x00`),
  });
}

function createExPanelVolumeCCM(id: number, cc: number, name: string) {
  return new Domino.CCM({ id, name }, {
    value: new Domino.Value({ min: 0, max: 0x7F, tableId: 300 }),
    data: new Domino.Data(`@SYSEX F0H 43H 70H 78H 41H ${cc} #VL F7H`),
  });
}
function createExPanelBrillianceCCM(id: number, cc: number, name: string) {
  return new Domino.CCM({ id, name }, {
    value: new Domino.Value({ min: 0, max: 0x06, tableId: 302 }),
    data: new Domino.Data(`@SYSEX F0H 43H 70H 78H 41H ${cc} #VL F7H`),
  });
}

function createExPanelSwCCM(id: number, cc: number, name: string) {
  return new Domino.CCM({ id, name }, {
    value: new Domino.Value({ min: 0, max: 0x01, tableId: swTable1.param.id }),
    data: new Domino.Data(`@SYSEX F0H 43H 70H 78H 41H ${cc} #VL F7H`),
  });
}
function createExMidi1CCM(
  id: number,
  hh: number,
  ll: number,
  name: string,
  valueOption: typeof Domino.Value.prototype.param = { min: 0, max: 0x7F },
) {
  return new Domino.CCM({ id, name }, {
    value: new Domino.Value(valueOption),
    gate: new Domino.Gate({ min: 0, max: 7, tableId: 400 }),
    data: new Domino.Data(`@SYSEX F0H 43H 70H 78H 44H ${hh} #GL ${ll} #VL F7H`),
  });
}

function createExMidi2CCM(
  id: number,
  hh: number,
  ll: number,
  name: string,
  valueOption: typeof Domino.Value.prototype.param = { min: 0, max: 0x3FFF },
) {
  return new Domino.CCM({ id, name }, {
    value: new Domino.Value(valueOption),
    gate: new Domino.Gate({ min: 0, max: 7, tableId: 400 }),
    data: new Domino.Data(
      `@SYSEX F0H 43H 70H 78H 44H ${hh} #GL ${ll} #VH #VL F7H`,
    ),
  });
}

function createExMidi3CCM(
  id: number,
  hh: number,
  ll: number,
  name: string,
  valueOption: typeof Domino.Value.prototype.param = { min: 0, max: 0x3FFF },
) {
  return new Domino.CCM({ id, name }, {
    value: new Domino.Value(valueOption),
    gate: new Domino.Gate({ min: 0, max: 7, tableId: 400 }),
    data: new Domino.Data(
      `@SYSEX F0H 43H 70H 78H 44H ${hh} #GL ${ll} 00H #VH #VL F7H`,
    ),
  });
}

function createExMidiOrgan1CCM(
  id: number,
  ll: number,
  name: string,
) {
  return new Domino.CCM({ id, name }, {
    value: new Domino.Value({ min: 0, max: 0x7F }),
    gate: new Domino.Gate({ min: 0, max: 1, tableId: 500 }),
    data: new Domino.Data(`@SYSEX F0H 43H 70H 78H 44H 11H #GL ${ll} #VL F7H`),
  });
}

function createExMidiOrgan2CCM(
  id: number,
  ll: number,
  name: string,
) {
  return new Domino.CCM({ id, name }, {
    value: new Domino.Value({ min: 0, max: 0x3FFF }),
    gate: new Domino.Gate({ min: 0, max: 1, tableId: 500 }),
    data: new Domino.Data(
      `@SYSEX F0H 43H 70H 78H 44H 11H #GL ${ll} #VH #VL F7H`,
    ),
  });
}

function createExMidiOrgan3CCM(
  id: number,
  ll: number,
  name: string,
) {
  return new Domino.CCM({ id, name }, {
    value: new Domino.Value({ min: 0, max: 0x3FFF }),
    gate: new Domino.Gate({ min: 0, max: 1, tableId: 500 }),
    data: new Domino.Data(
      `@SYSEX F0H 43H 70H 78H 44H 11H #GL ${ll} 00H #VH #VL F7H`,
    ),
  });
}

function createExMidiRhythmBoolCCM(
  id: number,
  mm: number,
  ll: number,
  name: string,
) {
  return new Domino.CCM({ id, name }, {
    value: new Domino.Value({ min: 0, max: 1, tableId: swTable1.param.id }),
    data: new Domino.Data(`@SYSEX F0H 43H 70H 78H 44H 13H ${mm} ${ll} #VL F7H`),
  });
}

function createExMidiRhythm1CCM(
  id: number,
  mm: number,
  ll: number,
  name: string,
  valueOption: typeof Domino.Value.prototype.param = { min: 0, max: 0x7F },
) {
  return new Domino.CCM({ id, name }, {
    value: new Domino.Value(valueOption),
    data: new Domino.Data(`@SYSEX F0H 43H 70H 78H 44H 13H ${mm} ${ll} #VL F7H`),
  });
}
