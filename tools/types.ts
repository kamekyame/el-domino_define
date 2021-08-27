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
