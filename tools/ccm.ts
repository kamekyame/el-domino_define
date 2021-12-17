import {
  CCM,
  CCMFolder,
  ControlChangeMacroList,
  Data,
  Entry,
  Gate,
  Table,
  Value,
} from "./domino-define.ts";

const midiParamMM = [
  new Entry({ value: 0, label: "UK1" }),
  new Entry({ value: 1, label: "UK2" }),
  new Entry({ value: 2, label: "LK1" }),
  new Entry({ value: 3, label: "LK2" }),
  new Entry({ value: 4, label: "LEAD 1" }),
  new Entry({ value: 5, label: "LEAD 2" }),
  new Entry({ value: 6, label: "PEDAL 1" }),
  new Entry({ value: 7, label: "PEDAL 2" }),
];

// 0x00 : OFF , 0x01 : ON
const swTable1 = new Table({ id: 0 }, [
  new Entry({ value: 0x00, label: "OFF" }),
  new Entry({ value: 0x01, label: "ON" }),
]);

// 0x00 : OFF , 0x7F : ON
const swTable2 = new Table({ id: 1 }, [
  new Entry({ value: 0x00, label: "OFF" }),
  new Entry({ value: 0x7F, label: "ON" }),
]);

export const ccmList = new ControlChangeMacroList([
  new CCMFolder({ name: "Channel Message" }, [
    swTable1,
    swTable2,
    // An
    new CCM({ id: 129, name: "Polyphonic After Touch" }, {
      value: new Value(),
      gate: new Gate({ name: "Note No. (音階)", type: "Key" }),
      data: new Data("@PKP #GL #VL"),
    }),

    // Bn
    new CCMFolder({ name: "[000-127] Control Change" }, [
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
    new CCM({ id: 128, name: "After Touch" }, {
      value: new Value(),
      data: new Data("@CP #VL"),
    }),

    // En
    new CCM({ id: 130, name: "Pitch Bend" }, {
      value: new Value({ min: -8192, max: 8191, offset: 8192 }),
      data: new Data("@PB #VH #VL"),
    }),
  ]),
  new CCMFolder({ name: "Exclusive Message" }, [
    new CCMFolder({ name: "Universal Realtime Messages" }, [
      new CCM({ id: 300, name: "GM2 Master Volume" }, {
        value: new Value(),
        gate: new Gate({ name: "Device Number", default: 0x7f }),
        data: new Data("@SYSEX F0H 7FH #GL 04H 01H #VH #VL F7H"),
      }),
      new CCM({ id: 301, name: "GM2 Master Fine Tuning" }, {
        value: new Value(),
        gate: new Gate({ name: "Device Number", default: 0x7f }),
        data: new Data("@SYSEX F0H 7FH #GL 04H 03H #VH #VL F7H"),
      }),
      new CCM({ id: 302, name: "GM2 Master Coarse Tuning" }, {
        value: new Value(),
        gate: new Gate({ name: "Device Number", default: 0x7f }),
        data: new Data("@SYSEX F0H 7FH #GL 04H 04H 00H #VL F7H"),
      }),
    ]),
    new CCMFolder({ name: "Universal Non-Realtime Messages" }, [
      new CCM({ id: 310, name: "GM ON" }, {
        gate: new Gate({ name: "Device Number", default: 0x7f }),
        data: new Data("@SYSEX F0H 7EH #GL 09H 01H F7H"),
      }),
      new CCM({ id: 311, name: "GM2 ON" }, {
        gate: new Gate({ name: "Device Number", default: 0x7f }),
        data: new Data("@SYSEX F0H 7EH #GL 09H 03H F7H"),
      }),
      new CCM({ id: 312, name: "GM OFF" }, {
        gate: new Gate({ name: "Device Number", default: 0x7f }),
        data: new Data("@SYSEX F0H 7EH #GL 09H 02H F7H"),
      }),
    ]),
    new CCMFolder({ name: "Clavinova Exclusive" }, [
      new CCM({ id: 330, name: "Request for Internal Sync. Mode" }, {
        data: new Data("@SYSEX F0H 43H 73H 01H 02H F7H"),
      }),
      new CCM({ id: 331, name: "Request for External Sync. Mode" }, {
        data: new Data("@SYSEX F0H 43H 73H 01H 02H F7H"),
      }),
    ]),
    new CCMFolder({ name: "Message Exclusive" }, [
      new CCM({ id: 340, name: "Rhythm Start" }, {
        data: new Data("@SYSEX F0H 43H 60H 7AH F7H"),
      }),
      new CCM({ id: 341, name: "Rhythm Stop" }, {
        data: new Data("@SYSEX F0H 43H 60H 7DH F7H"),
      }),
    ]),
    new CCMFolder({ name: "Electone Exclusive" }, [
      new CCM({ id: 352, name: "Switch" }, {
        value: new Value({}, [
          new Entry({ label: "ON", value: 0x7F }),
          new Entry({ label: "OFF", value: 0x00 }),
        ]),
        gate: new Gate({}, [
          new Entry({ label: "Left Footswitch", value: 0x45 }),
          new Entry({ label: "Knee Lever", value: 0x47 }),
        ]),
        data: new Data("@SYSEX F0H 43H 70H 70H 40H #GL #VL F7H"),
      }),
      new CCMFolder({ name: "Panel Switch Events" }, [
        new Table(
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
            new Entry({ label: `Volume${Math.abs(i - 24)}`, value: v })
          ),
        ),
        new Table({ id: 302 }, [
          new Entry({ value: 0x00, label: "BRILLIANT" }),
          new Entry({ value: 0x06, label: "MELLOW" }),
        ]),
        new CCMFolder({ name: "Selectors" }, [
          new CCM({ id: 354, name: "Registration Memory" }, {
            value: new Value(
              { min: 1, max: 16, offset: -1 },
              [...Array(16)].map((_, i) =>
                new Entry({ label: `Memory ${i + 1}`, value: i + 1 })
              ),
            ),
            data: new Data("@SYSEX F0H 43H 70H 78H 41H 0FH #VL F7H"),
          }),
        ]),
        new CCMFolder({ name: "Volume" }, [
          createExPanelVolumeCCM(355, 0x12, "Upper Keyboard Voice 1 Volume"),
          createExPanelVolumeCCM(356, 0x13, "Lower Keyboard Voice 1 Volume"),
          createExPanelVolumeCCM(357, 0x14, "Upper Keyboard Voice 2 Volume"),
          createExPanelVolumeCCM(358, 0x15, "Lower Keyboard Voice 2 Volume"),
          createExPanelVolumeCCM(359, 0x16, "Lead Voice 1 Volume"),
          createExPanelVolumeCCM(360, 0x17, "Pedal Voice 1 Volume"),
          createExPanelVolumeCCM(361, 0x18, "Pedal Voice 2 Volume"),
          createExPanelVolumeCCM(362, 0x19, "Lead Voice 2 Volume"),
          createExPanelVolumeCCM(363, 0x1A, "Percussion Volume"),
          createExPanelVolumeCCM(364, 0x1B, "Reverb Depth"),
        ]),
        new CCMFolder({ name: "Organ Flute Voice" }, [
          createExPanelSwCCM(365, 0x30, "Upper Organ Flute Voice"),
          createExPanelSwCCM(366, 0x31, "Lower Organ Flute Voice"),
        ]),
        new CCMFolder({ name: "To Lower" }, [
          createExPanelSwCCM(367, 0x36, "Lead Voice 1 To Lower"),
          createExPanelSwCCM(368, 0x37, "Pedal Voice 1 To Lower"),
          createExPanelSwCCM(369, 0x38, "Pedal Voice 2 To Lower"),
        ]),
        new CCMFolder({ name: "Solo Mode" }, [
          createExPanelSwCCM(370, 0x39, "Lead Voice 2 Solo (Knee)"),
        ]),
        new CCMFolder({ name: "Brilliance" }, [
          createExPanelBrillianceCCM(
            371,
            0x42,
            "Upper Keyboard Voice 1 Brilliance",
          ),
          createExPanelBrillianceCCM(
            372,
            0x43,
            "Lower Keyboard Voice 1 Brilliance",
          ),
          createExPanelBrillianceCCM(
            373,
            0x44,
            "Upper Keyboard Voice 2 Brilliance",
          ),
          createExPanelBrillianceCCM(
            374,
            0x45,
            "Lower Keyboard Voice 2 Brilliance",
          ),
          createExPanelBrillianceCCM(375, 0x46, "Lead Voice 1 Brilliance"),
          createExPanelBrillianceCCM(376, 0x47, "Pedal Voice 1 Brilliance"),
          createExPanelBrillianceCCM(377, 0x48, "Pedal Voice 2 Brilliance"),
          createExPanelBrillianceCCM(378, 0x49, "Lead Voice 2 Brilliance"),
        ]),
        new CCMFolder({ name: "Sustain" }, [
          createExPanelSwCCM(379, 0x50, "Upper Sustain"),
          createExPanelSwCCM(380, 0x51, "Lower Sustain"),
          createExPanelSwCCM(381, 0x52, "Pedal Sustain"),
        ]),
        new CCMFolder({ name: "Solo Bar" }, [
          createExPanelSwCCM(382, 0x59, "Solo Bar"),
        ]),
        new CCMFolder({ name: "Keyboard Percussion" }, [
          createExPanelSwCCM(383, 0x5B, "Keyboard Percussion [1]"),
          createExPanelSwCCM(384, 0x5C, "Keyboard Percussion [2]"),
        ]),
        new CCMFolder({ name: "Disable" }, [
          createExPanelSwCCM(385, 0x5F, "Disable [D.]"),
        ]),
        new CCMFolder({ name: "Rotary Speaker" }, [
          createExPanelSwCCM(386, 0x60, "Rotary Speaker Speed"),
        ]),

        new CCMFolder({ name: "Sequence" }, [
          createExPanelSwCCM(387, 0x61, "Sequence 1 [SEQ.1]"),
          createExPanelSwCCM(388, 0x62, "Sequence 2 [SEQ.2]"),
          createExPanelSwCCM(389, 0x63, "Sequence 3 [SEQ.3]"),
          createExPanelSwCCM(390, 0x64, "Sequence 4 [SEQ.4]"),
        ]),
      ]),
      new CCMFolder({ name: "Midi Parameter" }, [
        new CCMFolder({ name: "VoiceSection Parameters" }, [
          new CCMFolder({ name: "Panel Voice Parameters" }, [
            new Table({ id: 400 }, midiParamMM),
            createExMidi1CCM(401, 0x10, 0x10, "Voice Selector Number", {
              min: 0,
              max: 0x0D,
            }),
            createExMidi1CCM(402, 0x10, 0x11, "Volume"),
            createExMidi1CCM(403, 0x10, 0x12, "Reverb (Send Level)"),
            createExMidi1CCM(404, 0x10, 0x13, "Brilliance", {
              min: -64,
              max: 63,
              offset: 64,
            }),
            new CCM({ id: 405, name: "Feet" }, {
              value: new Value({ min: 0, max: 4 }, [
                new Entry({ value: 0, label: "PRESET" }),
                new Entry({ value: 1, label: "16'" }),
                new Entry({ value: 2, label: "8'" }),
                new Entry({ value: 3, label: "4'" }),
                new Entry({ value: 4, label: "2'" }),
              ]),
              gate: new Gate({ min: 0, max: 7, tableId: 400 }),
              data: new Data(`@SYSEX F0H 43H 70H 78H 44H 10H #GL 14H #VL F7H`),
            }),
            createExMidi1CCM(406, 0x10, 0x15, "Pan", {
              min: -64,
              max: 63,
              offset: 64,
            }),
            createExMidi1CCM(407, 0x10, 0x16, "Touch Tone Initial Touch"),
            createExMidi1CCM(408, 0x10, 0x17, "Touch Tone After Touch"),
            createExMidi1CCM(409, 0x10, 0x18, "Peach After Touch"),
            createExMidi1CCM(410, 0x10, 0x19, "User Vibrato"),
            createExMidi1CCM(411, 0x10, 0x1A, "Vibrato Delay"),
            createExMidi1CCM(412, 0x10, 0x1B, "Vibrato Depth"),
            createExMidi1CCM(413, 0x10, 0x1C, "Vibrato Speed"),
            createExMidi1CCM(414, 0x10, 0x1D, "Pitch Horizontal Touch"),
            new CCM({ id: 415, name: "Touch Vibrato" }, {
              value: new Value({ tableId: swTable2.param.id }),
              gate: new Gate({ min: 0, max: 7, tableId: 400 }),
              data: new Data(`@SYSEX F0H 43H 70H 78H 44H 10H #GL 1EH #VL F7H`),
            }),
            new CCM({ id: 416, name: "TO LOWER ▲/▼/SOLO (KNEE)" }, {
              value: new Value({ tableId: swTable1.param.id }),
              gate: new Gate({ min: 4, max: 7 }, midiParamMM.slice(4)),
              data: new Data(`@SYSEX F0H 43H 70H 78H 44H 10H #GL 1FH #VL F7H`),
            }),
            new CCM({ id: 417, name: "Slide" }, {
              value: new Value({}, [
                new Entry({ value: 0x00, label: "OFF" }),
                new Entry({ value: 0x01, label: "ON" }),
                new Entry({ value: 0x02, label: "Knee Lever" }),
              ]),
              gate: new Gate({ min: 4, max: 5 }, midiParamMM.slice(4, 6)),
              data: new Data(`@SYSEX F0H 43H 70H 78H 44H 10H #GL 20H #VL F7H`),
            }),
            new CCM({ id: 418, name: "Slide Time" }, {
              value: new Value(),
              gate: new Gate({ min: 4, max: 5 }, midiParamMM.slice(4, 6)),
              data: new Data(`@SYSEX F0H 43H 70H 78H 44H 10H #GL 21H #VL F7H`),
            }),
            createExMidi1CCM(419, 0x10, 0x22, "Tune/Detune", {
              min: -64,
              max: 63,
              offset: 64,
            }),
            new CCM({ id: 420, name: "2nd Expression Pitch Bend" }, {
              value: new Value({ tableId: swTable1.param.id }),
              gate: new Gate({ min: 0, max: 7 }, [
                ...midiParamMM.slice(0, 2),
                ...midiParamMM.slice(4),
              ]),
              data: new Data(`@SYSEX F0H 43H 70H 78H 44H 10H #GL 23H #VL F7H`),
            }),
            new CCM({ id: 421, name: "Footswitch Glide Control" }, {
              value: new Value({ tableId: swTable1.param.id }),
              gate: new Gate({ min: 0, max: 5 }, midiParamMM.slice(0, 6)),
              data: new Data(`@SYSEX F0H 43H 70H 78H 44H 10H #GL 24H #VL F7H`),
            }),
            new CCM({ id: 422, name: "Transpose" }, {
              value: new Value({ min: 0x3A, max: 0x46 }, [
                new Entry({ value: 0x3A, label: "KeyDown" }),
                new Entry({ value: 0x40, label: "Normal" }),
                new Entry({ value: 0x46, label: "KeyUp" }),
              ]),
              gate: new Gate({ min: 0, max: 5 }, midiParamMM.slice(0, 6)),
              data: new Data(`@SYSEX F0H 43H 70H 78H 44H 10H #GL 25H #VL F7H`),
            }),
            new CCM({ id: 423, name: "Poly" }, {
              value: new Value({ min: 0x00, max: 0x01 }, [
                new Entry({ value: 0x00, label: "Mono" }),
                new Entry({ value: 0x01, label: "Poly" }),
              ]),
              gate: new Gate({ min: 6, max: 7 }, midiParamMM.slice(6)),
              data: new Data(`@SYSEX F0H 43H 70H 78H 44H 10H #GL 28H #VL F7H`),
            }),
            new CCM({ id: 424, name: "Priority" }, {
              value: new Value({ min: 0x00, max: 0x01 }, [
                new Entry({ value: 0x00, label: "TOP" }),
                new Entry({ value: 0x01, label: "LAST" }),
              ]),
              gate: new Gate({ min: 5, max: 5 }, midiParamMM.slice(5, 6)),
              data: new Data(`@SYSEX F0H 43H 70H 78H 44H 10H #GL 29H #VL F7H`),
            }),
            new CCM({ id: 425, name: "Volume Mute" }, {
              value: new Value({
                min: 0x00,
                max: 0x01,
                tableId: swTable1.param.id,
              }),
              gate: new Gate({ min: 0, max: 7, tableId: 400 }),
              data: new Data(`@SYSEX F0H 43H 70H 78H 44H 10H #GL 2AH #VL F7H`),
            }),
            createExMidi3CCM(426, 0x10, 0x40, "Effect1 Type"),
            createExMidi2CCM(427, 0x10, 0x41, "Effect1 Parameter 1"),
            createExMidi2CCM(428, 0x10, 0x42, "Effect1 Parameter 2"),
            createExMidi2CCM(429, 0x10, 0x43, "Effect1 Parameter 3"),
            createExMidi2CCM(430, 0x10, 0x44, "Effect1 Parameter 4"),
            createExMidi2CCM(431, 0x10, 0x45, "Effect1 Parameter 5"),
            createExMidi2CCM(432, 0x10, 0x46, "Effect1 Parameter 6"),
            createExMidi2CCM(433, 0x10, 0x47, "Effect1 Parameter 7"),
            createExMidi2CCM(434, 0x10, 0x48, "Effect1 Parameter 8"),
            createExMidi2CCM(435, 0x10, 0x49, "Effect1 Parameter 9"),
            createExMidi2CCM(436, 0x10, 0x4A, "Effect1 Parameter 10"),
            createExMidi2CCM(437, 0x10, 0x4B, "Effect1 Parameter 11"),
            createExMidi2CCM(438, 0x10, 0x4C, "Effect1 Parameter 12"),
            createExMidi2CCM(439, 0x10, 0x4D, "Effect1 Parameter 13"),
            createExMidi2CCM(440, 0x10, 0x4E, "Effect1 Parameter 14"),
            createExMidi2CCM(441, 0x10, 0x4F, "Effect1 Parameter 15"),
            createExMidi2CCM(442, 0x10, 0x50, "Effect1 Parameter 16"),
            createExMidi3CCM(443, 0x10, 0x51, "Effect2 Type"),
            createExMidi2CCM(444, 0x10, 0x52, "Effect2 Parameter 1"),
            createExMidi2CCM(445, 0x10, 0x53, "Effect2 Parameter 2"),
            createExMidi2CCM(446, 0x10, 0x54, "Effect2 Parameter 3"),
            createExMidi2CCM(447, 0x10, 0x55, "Effect2 Parameter 4"),
            createExMidi2CCM(448, 0x10, 0x56, "Effect2 Parameter 5"),
            createExMidi2CCM(449, 0x10, 0x57, "Effect2 Parameter 6"),
            createExMidi2CCM(450, 0x10, 0x58, "Effect2 Parameter 7"),
            createExMidi2CCM(451, 0x10, 0x59, "Effect2 Parameter 8"),
            createExMidi2CCM(452, 0x10, 0x5A, "Effect2 Parameter 9"),
            createExMidi2CCM(453, 0x10, 0x5B, "Effect2 Parameter 10"),
            createExMidi2CCM(454, 0x10, 0x5C, "Effect2 Parameter 11"),
            createExMidi2CCM(455, 0x10, 0x5D, "Effect2 Parameter 12"),
            createExMidi2CCM(456, 0x10, 0x5E, "Effect2 Parameter 13"),
            createExMidi2CCM(457, 0x10, 0x5F, "Effect2 Parameter 14"),
            createExMidi2CCM(458, 0x10, 0x60, "Effect2 Parameter 15"),
            createExMidi2CCM(459, 0x10, 0x61, "Effect2 Parameter 16"),
            createExMidi1CCM(460, 0x10, 0x63, "Sustain Length"),
            new CCM({ id: 461, name: "ARTICULATION FOOT SW LEFT" }, {
              value: new Value({ min: 0x00, max: 0x02 }, [
                new Entry({ value: 0x00, label: "OFF" }),
                new Entry({ value: 0x01, label: "ART.1" }),
                new Entry({ value: 0x02, label: "ART.2" }),
              ]),
              gate: new Gate({ min: 0, max: 7, tableId: 400 }),
              data: new Data(`@SYSEX F0H 43H 70H 78H 44H 10H #GL 64H #VL F7H`),
            }),
            new CCM({ id: 462, name: "ARTICULATION AUTO" }, {
              value: new Value({
                min: 0x00,
                max: 0x01,
                tableId: swTable1.param.id,
              }),
              gate: new Gate({ min: 0, max: 7, tableId: 400 }),
              data: new Data(`@SYSEX F0H 43H 70H 78H 44H 10H #GL 65H #VL F7H`),
            }),
          ]),
          new CCMFolder({ name: "Organ Flute Voice Parameters" }, [
            new Table({ id: 500 }, [
              new Entry({ value: 0x00, label: "UK" }),
              new Entry({ value: 0x01, label: "LK" }),
            ]),
            createExMidiOrgan1CCM(500, 0x00, "Footage 16'"),
            createExMidiOrgan1CCM(501, 0x01, "Footage 8'"),
            createExMidiOrgan1CCM(502, 0x02, "Footage 5-1/3'"),
            createExMidiOrgan1CCM(503, 0x03, "Footage 4'"),
            createExMidiOrgan1CCM(504, 0x04, "Footage 2-2/3'"),
            createExMidiOrgan1CCM(505, 0x05, "Footage 2'"),
            createExMidiOrgan1CCM(506, 0x06, "Footage 1-3/5'"),
            createExMidiOrgan1CCM(507, 0x07, "Footage 1-1/3'"),
            createExMidiOrgan1CCM(508, 0x08, "Footage 1'"),
            createExMidiOrgan1CCM(509, 0x09, "Response"),
            createExMidiOrgan1CCM(510, 0x0A, "Attack 4'"),
            createExMidiOrgan1CCM(511, 0x0B, "Attack 2-2/3'"),
            createExMidiOrgan1CCM(512, 0x0C, "Attack 2'"),
            createExMidiOrgan1CCM(513, 0x0D, "Attack Length"),
            new CCM({ id: 514, name: "Organ Flutes" }, {
              value: new Value({
                min: 0,
                max: 0x1,
                tableId: swTable1.param.id,
              }),
              gate: new Gate({ min: 0, max: 1, tableId: 500 }),
              data: new Data(`@SYSEX F0H 43H 70H 78H 44H 11H #GL 10H #VL F7H`),
            }),
            createExMidiOrgan1CCM(515, 0x11, "Volume"),
            createExMidiOrgan1CCM(516, 0x12, "Reverb (Send Level)"),
            new CCM({ id: 517, name: "Type" }, {
              value: new Value({ min: 0, max: 0x2 }, [
                new Entry({ value: 0x00, label: "Sine" }),
                new Entry({ value: 0x01, label: "Vintage" }),
                new Entry({ value: 0x02, label: "Euro" }),
              ]),
              gate: new Gate({ min: 0, max: 1, tableId: 500 }),
              data: new Data(`@SYSEX F0H 43H 70H 78H 44H 11H #GL 13H #VL F7H`),
            }),
            new CCM({ id: 518, name: "Vibrato On/Off" }, {
              value: new Value({
                min: 0,
                max: 0x1,
                tableId: swTable1.param.id,
              }),
              gate: new Gate({ min: 0, max: 1, tableId: 500 }),
              data: new Data(`@SYSEX F0H 43H 70H 78H 44H 11H #GL 19H #VL F7H`),
            }),
            createExMidiOrgan1CCM(519, 0x1B, "Vibrato Depth"),
            createExMidiOrgan1CCM(520, 0x1C, "Vibrato Speed"),
            createExMidiOrgan3CCM(521, 0x40, "Effect Type"),
            createExMidiOrgan2CCM(522, 0x41, "Effect Parameter 1"),
            createExMidiOrgan2CCM(523, 0x42, "Effect Parameter 2"),
            createExMidiOrgan2CCM(524, 0x43, "Effect Parameter 3"),
            createExMidiOrgan2CCM(525, 0x44, "Effect Parameter 4"),
            createExMidiOrgan2CCM(526, 0x45, "Effect Parameter 5"),
            createExMidiOrgan2CCM(527, 0x46, "Effect Parameter 6"),
            createExMidiOrgan2CCM(528, 0x47, "Effect Parameter 7"),
            createExMidiOrgan2CCM(529, 0x48, "Effect Parameter 8"),
            createExMidiOrgan2CCM(530, 0x49, "Effect Parameter 9"),
            createExMidiOrgan2CCM(531, 0x4A, "Effect Parameter 10"),
            createExMidiOrgan2CCM(532, 0x4B, "Effect Parameter 11"),
            createExMidiOrgan2CCM(533, 0x4C, "Effect Parameter 12"),
            createExMidiOrgan2CCM(534, 0x4D, "Effect Parameter 13"),
            createExMidiOrgan2CCM(535, 0x4E, "Effect Parameter 14"),
            createExMidiOrgan2CCM(536, 0x4F, "Effect Parameter 15"),
            createExMidiOrgan2CCM(537, 0x50, "Effect Parameter 16"),
            createExMidiOrgan1CCM(538, 0x63, "Sustain Length"),
          ]),
        ]),
        new CCMFolder({ name: "Keyboard Parameters" }, [
          new CCMFolder({ name: "Sustain Parameters" }, [
            new Table({ id: 600 }, [
              new Entry({ value: 0x00, label: "UK" }),
              new Entry({ value: 0x01, label: "LK" }),
              new Entry({ value: 0x02, label: "PEDAL" }),
            ]),
            new CCM({ id: 601, name: "Sustain (On/Off)" }, {
              value: new Value({ min: 0, max: 1, tableId: swTable1.param.id }),
              gate: new Gate({ min: 0, max: 2, tableId: 600 }),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 12H #GL 00H #VL F7H`,
              ),
            }),
            new CCM({ id: 602, name: "Length" }, {
              value: new Value({ min: 0, max: 0x7F }),
              gate: new Gate({ min: 0, max: 2, tableId: 600 }),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 12H #GL 01H #VL F7H`,
              ),
            }),
          ]),
          new CCMFolder({ name: "Keyboard Percussion Parameters" }, [
            new Table({ id: 601 }, [
              new Entry({ value: 0x01, label: "K.B.P. [1]" }),
              new Entry({ value: 0x02, label: "K.B.P. [2]" }),
            ]),
            new CCM({ id: 603, name: "Keyboard Percussion (On/Off)" }, {
              value: new Value({ min: 0, max: 1, tableId: swTable1.param.id }),
              gate: new Gate({ min: 1, max: 2, tableId: 600 }),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 12H #GL 10H #VL F7H`,
              ),
            }),
            new CCM({ id: 604, name: "Keyboard Percussion Menu" }, {
              value: new Value({ min: 0, max: 28 }, [
                new Entry({ value: 0x00, label: "PRESET" }),
                ...[...Array(28)].map((_, i) =>
                  new Entry({ value: i + 1, label: `USER ${i + 1}` })
                ),
              ]),
              gate: new Gate({ min: 1, max: 2, tableId: 600 }),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 12H #GL 11H #VL F7H`,
              ),
            }),
          ]),
        ]),
        new CCMFolder({ name: "Rhythm" }, [
          new CCMFolder({ name: "Rhythm Parameters" }, [
            createExMidiRhythm1CCM(
              712,
              0x00,
              0x10,
              "Rhythm Selector Number",
              {
                min: 0,
                max: 0xB,
              },
            ),
            createExMidiRhythm1CCM(713, 0x00, 0x11, "Percussion Volume"),
            createExMidiRhythm1CCM(
              714,
              0x00,
              0x12,
              "Percussion Reverb (Send Level)",
            ),
            createExMidiRhythmBoolCCM(
              715,
              0x00,
              0x13,
              "2nd Expression Tempo Control",
            ),
            new CCM({ id: 716, name: "Footswitch Rhythm Control" }, {
              value: new Value({ min: 0, max: 0x7F }, [
                new Entry({ value: 0x00, label: "INTRO 1" }),
                new Entry({ value: 0x01, label: "INTRO 2" }),
                new Entry({ value: 0x02, label: "INTRO 3" }),
                new Entry({ value: 0x08, label: "MAIN A" }),
                new Entry({ value: 0x09, label: "MAIN B" }),
                new Entry({ value: 0x0A, label: "MAIN C" }),
                new Entry({ value: 0x0B, label: "MAIN D" }),
                new Entry({ value: 0x18, label: "BREAK" }),
                new Entry({ value: 0x20, label: "ENDING 1" }),
                new Entry({ value: 0x21, label: "ENDING 2" }),
                new Entry({ value: 0x22, label: "ENDING 3" }),
                new Entry({ value: 0x7E, label: "STOP" }),
                new Entry({ value: 0x7F, label: "OFF" }),
              ]),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 13H 00H 14H #VL F7H`,
              ),
            }),
            createExMidiRhythmBoolCCM(717, 0x00, 0x15, "Add Drum"),
            createExMidiRhythmBoolCCM(718, 0x00, 0x16, "Main Drum"),
            createExMidiRhythmBoolCCM(719, 0x00, 0x17, "Chord 1"),
            createExMidiRhythmBoolCCM(720, 0x00, 0x18, "Chord 2"),
            createExMidiRhythmBoolCCM(721, 0x00, 0x19, "Pad"),
            createExMidiRhythmBoolCCM(722, 0x00, 0x1A, "Phrase 1"),
            createExMidiRhythmBoolCCM(723, 0x00, 0x1B, "Phrase 2"),
            createExMidiRhythmBoolCCM(724, 0x00, 0x1C, "Auto Fill"),
          ]),
          new CCMFolder({ name: "Rhythm Sequence Parameters" }, [
            new CCM({ id: 725, name: "Sequence [SEQ.1] - [SEQ.4]" }, {
              value: new Value({ min: 0, max: 1, tableId: swTable1.param.id }),
              gate: new Gate({ min: 0, max: 3 }, [
                new Entry({ value: 0, label: "SEQ.1" }),
                new Entry({ value: 1, label: "SEQ.2" }),
                new Entry({ value: 2, label: "SEQ.3" }),
                new Entry({ value: 3, label: "SEQ.4" }),
              ]),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 13H 01H #GL #VL F7H`,
              ),
            }),
          ]),
          new CCMFolder({ name: "Accompaniment Parameters" }, [
            createExMidiRhythm1CCM(726, 0x02, 0x11, "Accompaniment Volume"),
            createExMidiRhythm1CCM(
              727,
              0x02,
              0x12,
              "Accompaniment Reverb (Send Level",
            ),
          ]),
          new CCMFolder({ name: "A.B.C. Function Parameters" }, [
            new CCM({ id: 728, name: "Auto Bass Chord Mode" }, {
              value: new Value({ min: 0, max: 3 }, [
                new Entry({ value: 0, label: "OFF" }),
                new Entry({ value: 1, label: "Single Finger" }),
                new Entry({ value: 2, label: "Fingered" }),
                new Entry({ value: 3, label: "Custom A.B.C." }),
              ]),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 13H 03H 00H #VL F7H`,
              ),
            }),
            createExMidiRhythmBoolCCM(729, 0x03, 0x01, "Lower Memory"),
            createExMidiRhythmBoolCCM(730, 0x03, 0x02, "Pedal Memory"),
          ]),
          new CCMFolder({ name: "M.O.C. Function Parameters" }, [
            new CCM({ id: 731, name: "Melody On Chord Mode" }, {
              value: new Value({ min: 0, max: 3 }, [
                new Entry({ value: 0, label: "OFF" }),
                new Entry({ value: 1, label: "1" }),
                new Entry({ value: 2, label: "2" }),
                new Entry({ value: 3, label: "3" }),
              ]),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 13H 04H 00H #VL F7H`,
              ),
            }),
            createExMidiRhythmBoolCCM(
              732,
              0x04,
              0x01,
              "M.O.C.Knee Lever Control",
            ),
          ]),
          new CCMFolder({ name: "Section Parameters" }, [
            createExMidiRhythmBoolCCM(733, 0x05, 0x00, "Intro 1"),
            createExMidiRhythmBoolCCM(734, 0x05, 0x01, "Intro 2"),
            createExMidiRhythmBoolCCM(735, 0x05, 0x02, "Intro 3"),
            createExMidiRhythmBoolCCM(736, 0x05, 0x08, "Main A"),
            createExMidiRhythmBoolCCM(737, 0x05, 0x09, "Main B"),
            createExMidiRhythmBoolCCM(738, 0x05, 0x0A, "Main C"),
            createExMidiRhythmBoolCCM(739, 0x05, 0x0B, "Main D"),
            createExMidiRhythmBoolCCM(740, 0x05, 0x1B, "Break"),
            createExMidiRhythmBoolCCM(741, 0x05, 0x20, "Ending 1"),
            createExMidiRhythmBoolCCM(742, 0x05, 0x21, "Ending 2"),
            createExMidiRhythmBoolCCM(743, 0x05, 0x22, "Ending 3"),
          ]),
          new CCMFolder({ name: "Keyboard Percussion Parameters" }, [
            createExMidiRhythm1CCM(744, 0x10, 0x11, "Volume"),
            createExMidiRhythm1CCM(745, 0x10, 0x12, "Reverb (Send Level"),
          ]),
        ]),
        new CCMFolder({ name: "Overall" }, [
          new CCMFolder({ name: "System Parameters" }, [
            new CCM({ id: 800, name: "Disable" }, {
              value: new Value({ min: 0, max: 1, tableId: swTable1.param.id }),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 00H 00H #VL F7H`,
              ),
            }),
            new CCM({ id: 801, name: "Organ Flute Attack Mode" }, {
              value: new Value({ min: 0, max: 1 }, [
                new Entry({ value: 0, label: "Each" }),
                new Entry({ value: 1, label: "Fiast" }),
              ]),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 00H 01H #VL F7H`,
              ),
            }),
            new CCM({ id: 802, name: "Transpose" }, {
              value: new Value({ min: 0x3A, max: 0x46 }, [
                new Entry({ value: 0x3A, label: "KeyDown" }),
                new Entry({ value: 0x40, label: "Normal" }),
                new Entry({ value: 0x46, label: "KeyUp" }),
              ]),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 00H 02H #VL F7H`,
              ),
            }),
            new CCM({ id: 803, name: "2nd Expression Range" }, {
              value: new Value({ min: 0x01, max: 0x0C }, [
                new Entry({ value: 0x01, label: "100 C" }),
                new Entry({ value: 0x0C, label: "1200 C" }),
              ]),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 00H 03H #VL F7H`,
              ),
            }),
            new CCM({ id: 804, name: "Footswitch Mode" }, {
              value: new Value({ min: 0x00, max: 0x03 }, [
                new Entry({ value: 0x00, label: "OFF" }),
                new Entry({ value: 0x01, label: "Rhythm" }),
                new Entry({ value: 0x02, label: "Glide" }),
                new Entry({ value: 0x03, label: "Rotary Speaker" }),
              ]),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 00H 04H #VL F7H`,
              ),
            }),
            new CCM({ id: 805, name: "Pitch" }, {
              value: new Value({ min: 0x00, max: 0x7F }, [
                new Entry({ value: 0x00, label: "PitchDown" }),
                new Entry({ value: 0x40, label: "Normal" }),
                new Entry({ value: 0x7F, label: "PitchUp" }),
              ]),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 00H 05H #VL F7H`,
              ),
            }),
            new CCM({ id: 806, name: "Footswitch Glide Time" }, {
              value: new Value({ min: 0x00, max: 0x7F }),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 00H 06H #VL F7H`,
              ),
            }),
            new CCM({ id: 807, name: "MIDI Control Expression" }, {
              value: new Value({ min: 0x00, max: 0x01 }, [
                new Entry({ value: 0x00, label: "Internal" }),
                new Entry({ value: 0x01, label: "External" }),
              ]),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 00H 08H #VL F7H`,
              ),
            }),
            new CCM({ id: 808, name: "MIDI Control Lead 1" }, {
              value: new Value({ min: 0x00, max: 0x01 }, [
                new Entry({ value: 0x00, label: "Internal" }),
                new Entry({ value: 0x01, label: "External" }),
              ]),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 00H 09H #VL F7H`,
              ),
            }),
            new CCM({ id: 810, name: "Disable Mode" }, {
              value: new Value({ min: 0x00, max: 0x01 }, [
                new Entry({ value: 0x00, label: "Normal" }),
                new Entry({ value: 0x01, label: "Tempo" }),
              ]),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 00H 0BH #VL F7H`,
              ),
            }),
          ]),
          new CCMFolder({ name: "Effect Parameters : Reverb" }, [
            new CCM({ id: 811, name: "Reverb Depth" }, {
              value: new Value({ min: 0x00, max: 0x7F }),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 01H 00H #VL F7H`,
              ),
            }),
            new CCM({ id: 812, name: "Reverb Time (Panel)" }, {
              value: new Value({ min: 0x00, max: 0x7F }),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 01H 01H #VL F7H`,
              ),
            }),
            new CCM({ id: 814, name: "Reverb Time (Rhythm)" }, {
              value: new Value({ min: 0x00, max: 0x7F }),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 02H 01H #VL F7H`,
              ),
            }),
          ]),
          new CCMFolder({ name: "Effect Parameters : Rotary Speaker" }, [
            new CCM({ id: 816, name: "Rotary Speaker Speed" }, {
              value: new Value({
                min: 0x00,
                max: 0x01,
                tableId: swTable1.param.id,
              }),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 03H 00H #VL F7H`,
              ),
            }),
            new CCM({ id: 817, name: "Rotary Speaker Speed Control Mode" }, {
              value: new Value({ min: 0x00, max: 0x01 }, [
                new Entry({ value: 0x00, label: "STOP" }),
                new Entry({ value: 0x01, label: "SLOW" }),
              ]),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 03H 01H #VL F7H`,
              ),
            }),
            new CCM({ id: 818, name: "Rotary Speaker Speed Control Speed" }, {
              value: new Value({ min: 0x00, max: 0x7F }),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 14H 03H 02H 00H #VL F7H`,
              ),
            }),
          ]),
          new CCMFolder({ name: "Other" }, [
            new CCM({ id: 819, name: "Regist Bank" }, {
              value: new Value({ min: 0x00, max: 0x04 }, [
                new Entry({ value: 0x00, label: "Bank A" }),
                new Entry({ value: 0x01, label: "Bank B" }),
                new Entry({ value: 0x02, label: "Bank C" }),
                new Entry({ value: 0x03, label: "Bank D" }),
              ]),
              data: new Data(
                `@SYSEX F0H 43H 70H 78H 44H 7EH 00H 00H #VL F7H`,
              ),
            }),
          ]),
        ]),
      ]),
      new CCM({ id: 900, name: "MDR" }, {
        value: new Value({ min: 0x01, max: 0x09 }, [
          new Entry({ value: 0x01, label: "Play Start" }),
          new Entry({ value: 0x02, label: "Play Stop" }),
          new Entry({ value: 0x03, label: "Record Start" }),
          new Entry({ value: 0x04, label: "Record Stop" }),
          new Entry({ value: 0x05, label: "Fast Forward Start" }),
          new Entry({ value: 0x06, label: "Fast Forward Stop" }),
          new Entry({ value: 0x09, label: "Rhythm Pointer Reset" }),
        ]),
        data: new Data(`@SYSEX F0H 43H 70H 70H 70H #VL F7H`),
      }),
      new CCM({ id: 1000, name: "EL ON" }, {
        data: new Data(`@SYSEX F0H 43H 70H 70H 73H F7H`),
      }),
    ]),
  ]),

  // 命令を組み合わせて使う
  new CCMFolder({ name: "Macro" }, [
    new CCMFolder({ name: "RPN" }, [
      new CCM({ id: 151, name: "[151] ﾍﾞﾝﾄﾞ幅" }, {
        value: new Value({ default: 2, max: 48 }),
        data: new Data(`@RPN 0 0 #VL #NONE`),
        memo: `[Pitch Bend Sensitivity]
CCM#130 Pitch Bend の値が最大 (+8191 または -8192) の時に、どれだけ音程を変化させるかを半音単位 (12 で 1 ｵｸﾀｰﾌﾞ) で設定。通常、ﾃﾞﾌｫﾙﾄ (ﾘｾｯﾄ受信時) は 「2」 に設定される。
※ 値の範囲が 「0 ～ 48」 なのは MSGS のみ (GM 対応音源は 通常 「0 ～ 24」 ) なので注意。`,
      }),
    ]),
  ]),
]);

function createCcCCM(
  { id, name }: { id: number; name: string },
  valueOption: typeof Value.prototype.param = {},
) {
  return new CCM({ id, name: `[${("000" + id).slice(-3)}] ${name}` }, {
    value: new Value(valueOption),
    data: new Data(`@CC ${id} #VL`),
  });
}

function createCcCCMFix({ id, name }: { id: number; name: string }) {
  return new CCM({ id, name: `[${id}] ${name}` }, {
    data: new Data(`@CC ${id} 0x00`),
  });
}

function createExPanelVolumeCCM(id: number, cc: number, name: string) {
  return new CCM({ id, name }, {
    value: new Value({ min: 0, max: 0x7F, tableId: 300 }),
    data: new Data(`@SYSEX F0H 43H 70H 78H 41H ${cc} #VL F7H`),
  });
}
function createExPanelBrillianceCCM(id: number, cc: number, name: string) {
  return new CCM({ id, name }, {
    value: new Value({ min: 0, max: 0x06, tableId: 302 }),
    data: new Data(`@SYSEX F0H 43H 70H 78H 41H ${cc} #VL F7H`),
  });
}

function createExPanelSwCCM(id: number, cc: number, name: string) {
  return new CCM({ id, name }, {
    value: new Value({ min: 0, max: 0x01, tableId: swTable1.param.id }),
    data: new Data(`@SYSEX F0H 43H 70H 78H 41H ${cc} #VL F7H`),
  });
}
function createExMidi1CCM(
  id: number,
  hh: number,
  ll: number,
  name: string,
  valueOption: typeof Value.prototype.param = { min: 0, max: 0x7F },
) {
  return new CCM({ id, name }, {
    value: new Value(valueOption),
    gate: new Gate({ min: 0, max: 7, tableId: 400 }),
    data: new Data(`@SYSEX F0H 43H 70H 78H 44H ${hh} #GL ${ll} #VL F7H`),
  });
}

function createExMidi2CCM(
  id: number,
  hh: number,
  ll: number,
  name: string,
  valueOption: typeof Value.prototype.param = { min: 0, max: 0x3FFF },
) {
  return new CCM({ id, name }, {
    value: new Value(valueOption),
    gate: new Gate({ min: 0, max: 7, tableId: 400 }),
    data: new Data(
      `@SYSEX F0H 43H 70H 78H 44H ${hh} #GL ${ll} #VH #VL F7H`,
    ),
  });
}

function createExMidi3CCM(
  id: number,
  hh: number,
  ll: number,
  name: string,
  valueOption: typeof Value.prototype.param = { min: 0, max: 0x3FFF },
) {
  return new CCM({ id, name }, {
    value: new Value(valueOption),
    gate: new Gate({ min: 0, max: 7, tableId: 400 }),
    data: new Data(
      `@SYSEX F0H 43H 70H 78H 44H ${hh} #GL ${ll} 00H #VH #VL F7H`,
    ),
  });
}

function createExMidiOrgan1CCM(
  id: number,
  ll: number,
  name: string,
) {
  return new CCM({ id, name }, {
    value: new Value({ min: 0, max: 0x7F }),
    gate: new Gate({ min: 0, max: 1, tableId: 500 }),
    data: new Data(`@SYSEX F0H 43H 70H 78H 44H 11H #GL ${ll} #VL F7H`),
  });
}

function createExMidiOrgan2CCM(
  id: number,
  ll: number,
  name: string,
) {
  return new CCM({ id, name }, {
    value: new Value({ min: 0, max: 0x3FFF }),
    gate: new Gate({ min: 0, max: 1, tableId: 500 }),
    data: new Data(`@SYSEX F0H 43H 70H 78H 44H 11H #GL ${ll} #VH #VL F7H`),
  });
}

function createExMidiOrgan3CCM(
  id: number,
  ll: number,
  name: string,
) {
  return new CCM({ id, name }, {
    value: new Value({ min: 0, max: 0x3FFF }),
    gate: new Gate({ min: 0, max: 1, tableId: 500 }),
    data: new Data(`@SYSEX F0H 43H 70H 78H 44H 11H #GL ${ll} 00H #VH #VL F7H`),
  });
}

function createExMidiRhythmBoolCCM(
  id: number,
  mm: number,
  ll: number,
  name: string,
) {
  return new CCM({ id, name }, {
    value: new Value({ min: 0, max: 1, tableId: swTable1.param.id }),
    data: new Data(`@SYSEX F0H 43H 70H 78H 44H 13H ${mm} ${ll} #VL F7H`),
  });
}

function createExMidiRhythm1CCM(
  id: number,
  mm: number,
  ll: number,
  name: string,
  valueOption: typeof Value.prototype.param = { min: 0, max: 0x7F },
) {
  return new CCM({ id, name }, {
    value: new Value(valueOption),
    data: new Data(`@SYSEX F0H 43H 70H 78H 44H 13H ${mm} ${ll} #VL F7H`),
  });
}
