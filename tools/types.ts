export type VoiceJSON = {
  name: string;
  msb: number;
  lsb: number;
  pc: number;
  elxxx: boolean;
};

export type DrumJSON = {
  sfx: boolean;
} & VoiceJSON;

export type DrumToneJson = {
  name: string;
  tone: DrumToneBankJson[];
};

export type DrumToneBankJson = {
  name: string;
  key: number;
};
