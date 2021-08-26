namespace DominoDefine {
  class ModuleData implements Base {
    private name: string;
    private folder?: string;
    private priority?: number;
    private fileCreator?: string;
    private fileVersion?: string;
    private website?: string;

    private instrumentList?: InstrumentList;

    constructor(
      {
        name,
        folder,
        priority,
        fileCreator,
        fileVersion,
        website,
      }: {
        name: string;
        folder?: string;
        priority?: number;
        fileCreator?: string;
        fileVersion?: string;
        website?: string;
      },
      instrumentList?: InstrumentList,
    ) {
      this.name = name;
      this.folder = folder;
      this.priority = priority;
      this.fileCreator = fileCreator;
      this.fileVersion = fileVersion;
      this.website = website;

      this.instrumentList = instrumentList;
    }

    createInstrumentList() {
      this.instrumentList = new InstrumentList();
      return this.instrumentList;
    }

    check() {}

    toXML() {
      let xml = `<ModuleData Name="${this.name}"`;
      if (this.folder) xml += ` Folder="${this.folder}"`;
      if (this.priority) xml += ` Priority="${this.priority}"`;
      if (this.fileCreator) xml += ` FileCreator="${this.fileCreator}"`;
      if (this.fileVersion) xml += ` FileVersion="${this.fileVersion}"`;
      if (this.website) xml += ` Website="${this.website}"`;
      xml += ` >\n`;
      if (this.instrumentList) xml += this.instrumentList.toXML();
      xml += `</ModuleData>\n`;
      return escapeXML(xml);
    }
  }

  export class File extends ModuleData {
    private xmlVersion = "1.0";
    private xmlEncoding = "Shift_JIS";

    toXML() {
      let xml =
        `<?xml version="${this.xmlVersion}" encoding="${this.xmlEncoding}"?>\n\n`;
      xml += super.toXML();
      return escapeXML(xml);
    }
  }

  export class InstrumentList implements Base {
    private maps: InstrumentMap[];

    constructor(maps?: InstrumentMap[]) {
      this.maps = maps || [];
    }

    addMap(map: InstrumentMap) {
      this.maps.push(map);
    }

    check() {
    }

    toXML() {
      this.check();
      let xml = `\t<InstrumentList>\n`;
      this.maps.forEach((map) => {
        xml += map.toXML();
      });
      xml += `\t</InstrumentList>\n`;
      return xml;
    }
  }

  class Map<T extends Bank> implements Base {
    private name: string;
    private pcs: PC<T>[];
    constructor(name: string, pcs?: PC<T>[]) {
      this.name = name;
      this.pcs = pcs || [];
    }

    addPC(pc: PC<T> | PC<T>[]) {
      if (pc instanceof Array) {
        this.pcs.push(...pc);
      } else {
        this.pcs.push(pc);
      }
    }

    check() {}

    toXML() {
      this.check();
      let xml = `\t\t<Map Name="${this.name}">\n`;
      this.pcs.forEach((pc) => {
        xml += pc.toXML();
      });
      xml += `\t\t</Map>\n`;
      return escapeXML(xml);
    }
  }

  export class InstrumentMap extends Map<Bank> {}
  export class DrumMap extends Map<DrumBank> {}

  class PC<T extends Bank> implements Base {
    private name: string;
    private pc: number;
    private banks: T[];

    constructor(name: string, pc: number, banks?: T[]) {
      this.name = name;
      this.pc = pc;
      this.banks = banks || [];
    }

    check() {
      if (this.pc < 1 || this.pc > 128) {
        throw new Error(
          `PC must be between 1 and 128. Received: ${this.pc}`,
        );
      }
      if (this.banks.length === 0) {
        throw new Error("One DominoBank is required for DominoPC");
      }
    }

    addBank(bank: T) {
      this.banks.push(bank);
    }

    toXML() {
      this.check();
      let xml = `\t\t\t<PC Name="${this.name}" PC="${this.pc}">\n`;

      this.banks.forEach((bank) => {
        xml += bank.toXML();
      });

      xml += "\t\t\t</PC>\n";
      return escapeXML(xml);
    }
  }

  export class InstrumentPC extends PC<Bank> {}
  export class DrumPC extends PC<DrumBank> {}

  export class Bank implements Base {
    protected name: string;
    protected lsb?: number;
    protected msb?: number;

    constructor(
      name: string,
      lsb?: number,
      msb?: number,
    ) {
      this.name = name;
      this.lsb = lsb;
      this.msb = msb;
    }

    check() {
      if (this.lsb !== undefined) {
        if (this.lsb < 0 || this.lsb > 255) {
          throw new Error(
            `LSB must be between 0 and 255. Received: ${this.lsb}`,
          );
        }
      }
      if (this.msb !== undefined) {
        if (this.msb < 0 || this.msb > 255) {
          throw new Error(
            `MSB must be between 0 and 255. Received: ${this.msb}`,
          );
        }
      }
    }

    toXML() {
      this.check();
      let xml = `\t\t\t\t<Bank Name="${this.name}"`;
      if (this.lsb !== undefined) xml += ` LSB="${this.lsb}"`;
      if (this.msb !== undefined) xml += ` MSB="${this.msb}"`;
      xml += ` />\n`;
      return escapeXML(xml);
    }
  }
  export class DrumBank extends Bank {
    private tones: Tone[];

    constructor(
      tones?: Tone[],
      ...bankConstructorParameters: ConstructorParameters<typeof Bank>
    ) {
      super(...bankConstructorParameters);
      this.tones = tones || [];
    }

    toXML() {
      this.check();
      let xml = `<DominoBank Name="${this.name}"`;
      if (this.lsb !== undefined) xml += ` LSB="${this.lsb}"`;
      if (this.msb !== undefined) xml += ` MSB="${this.msb}"`;
      xml += ` >`;

      this.tones.forEach((tone) => {
        xml += tone.toXML();
      });

      xml += `</DominoBank>`;
      return escapeXML(xml);
    }
  }

  export class Tone implements Base {
    private name: string;
    private key: number;

    constructor(name: string, key: number) {
      this.name = name;
      this.key = key;
    }

    check() {
      if (this.key < 0 || this.key > 127) {
        throw new Error(`Key must be between 0 and 127. Received: ${this.key}`);
      }
    }

    toXML() {
      this.check();
      return escapeXML(`<DomimoTone Name="${this.name}" Key="${this.key}"/>`);
    }
  }

  interface Base {
    check(): void;
    toXML(): string;
  }

  function escapeXML(str: string) {
    return str.replace(/&(?!amp;|apos;)/g, "&amp;");
  }
}

export default DominoDefine;
