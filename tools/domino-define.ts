class ModuleData implements Base {
  private name: string;
  private folder?: string;
  private priority?: number;
  private fileCreator?: string;
  private fileVersion?: string;
  private website?: string;

  private instrumentList?: InstrumentList;
  private drumSetList?: DrumSetList;
  private controlChangeMacroList?: ControlChangeMacroList;
  private templateList?: TemplateList;

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
    { instrumentList, drumSetList, controlChangeMacroList, templateList }: {
      instrumentList?: InstrumentList;
      drumSetList?: DrumSetList;
      controlChangeMacroList?: ControlChangeMacroList;
      templateList?: TemplateList;
    } = {},
  ) {
    this.name = name;
    this.folder = folder;
    this.priority = priority;
    this.fileCreator = fileCreator;
    this.fileVersion = fileVersion;
    this.website = website;

    this.instrumentList = instrumentList;
    this.drumSetList = drumSetList;
    this.controlChangeMacroList = controlChangeMacroList;
    this.templateList = templateList;
  }

  createInstrumentList() {
    this.instrumentList = new InstrumentList();
    return this.instrumentList;
  }

  createDrumSetList() {
    this.drumSetList = new DrumSetList();
    return this.drumSetList;
  }

  check() {}

  toXML() {
    let xml = `<ModuleData Name="${this.name}"`;
    if (this.folder) xml += ` Folder="${this.folder}"`;
    if (this.priority) xml += ` Priority="${this.priority}"`;
    if (this.fileCreator) xml += ` FileCreator="${this.fileCreator}"`;
    if (this.fileVersion) xml += ` FileVersion="${this.fileVersion}"`;
    if (this.website) xml += ` Website="${this.website}"`;
    xml += `>`;
    if (this.instrumentList) xml += this.instrumentList.toXML();
    if (this.drumSetList) xml += this.drumSetList.toXML();
    if (this.controlChangeMacroList) xml += this.controlChangeMacroList.toXML();
    if (this.templateList) xml += this.templateList.toXML();
    xml += `</ModuleData>`;
    return escapeXML(xml);
  }
}

export class File extends ModuleData {
  private xmlVersion = "1.0";
  private xmlEncoding = "Shift_JIS";

  toXML() {
    let xml =
      `<?xml version="${this.xmlVersion}" encoding="${this.xmlEncoding}"?>`;
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
    let xml = `<InstrumentList>`;
    this.maps.forEach((map) => {
      xml += map.toXML();
    });
    xml += `</InstrumentList>`;
    return xml;
  }
}

export class DrumSetList implements Base {
  private maps: DrumMap[];

  constructor(maps?: DrumMap[]) {
    this.maps = maps || [];
  }

  addMap(map: DrumMap) {
    this.maps.push(map);
  }

  check() {
  }

  toXML() {
    this.check();
    let xml = `<DrumSetList>`;
    this.maps.forEach((map) => {
      xml += map.toXML();
    });
    xml += `</DrumSetList>`;
    return xml;
  }
}

export class ControlChangeMacroList implements Base {
  private tags: (CCMFolder | CCM)[];

  constructor(tags?: typeof ControlChangeMacroList.prototype.tags) {
    this.tags = tags || [];
  }

  check() {
  }

  toXML() {
    this.check();
    let xml = `<ControlChangeMacroList>`;
    this.tags.forEach((tag) => {
      xml += tag.toXML();
    });
    xml += `</ControlChangeMacroList>`;
    return xml;
  }
}

export class TemplateList implements Base {
  private tags: (TemplateFolder | Template)[];

  constructor(tags?: typeof TemplateList.prototype.tags) {
    this.tags = tags || [];
  }

  check() {
  }

  toXML() {
    this.check();
    let xml = `<TemplateList>`;
    this.tags.forEach((tag) => {
      xml += tag.toXML();
    });
    xml += `</TemplateList>`;
    return xml;
  }
}

class Map<T extends Bank> implements Base {
  public readonly name: string;
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
    let xml = `<Map Name="${this.name}">`;
    this.pcs.forEach((pc) => {
      xml += pc.toXML();
    });
    xml += `</Map>`;
    return escapeXML(xml);
  }
}

export class InstrumentMap extends Map<Bank> {}
export class DrumMap extends Map<DrumBank> {}

class PC<T extends Bank> implements Base {
  public readonly name: string;
  public readonly pc: number;
  private banks: T[];

  constructor(name: string, pc: number, banks?: T[]) {
    this.name = name;
    this.pc = pc;
    this.banks = banks || [];
  }

  check() {
    if (this.pc < 1 || this.pc > 128) {
      throw new Error(
        `PC must be between 1 and 128. Received: ${this.pc},${this.name}`,
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
    if (this.banks.length === 0) return "";
    this.check();
    let xml = `<PC Name="${this.name}" PC="${this.pc}">`;

    this.banks.forEach((bank) => {
      xml += bank.toXML();
    });

    xml += "</PC>";
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
    let xml = `<Bank Name="${this.name}"`;
    if (this.lsb !== undefined) xml += ` LSB="${this.lsb}"`;
    if (this.msb !== undefined) xml += ` MSB="${this.msb}"`;
    xml += ` />`;
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

export class CCMFolder implements Base {
  private param: {
    name: string;
    id?: number;
  };
  private tags: (CCMFolder | CCM | Table)[];

  constructor(
    param: typeof CCMFolder.prototype.param,
    tags?: typeof CCMFolder.prototype.tags,
  ) {
    this.param = param;
    this.tags = tags || [];
  }

  check() {}

  toXML() {
    let xml = `<Folder Name="${this.param.name}"`;
    if (this.param.id !== undefined) xml += ` ID="${this.param.id}"`;
    xml += `>`;
    this.tags.forEach((tag) => {
      xml += tag.toXML();
    });
    xml += `</Folder>`;
    return escapeXML(xml);
  }
}

export class CCM implements Base {
  private param: {
    id: number;
    name: string;
    color?: string;
    sync?: "Last" | "LastEachGame";
  };

  private value?: Value;
  private gate?: Gate;
  private data?: Data;
  private memo?: string;

  constructor(
    param: typeof CCM.prototype.param,
    { value, gate, data, memo }: {
      value?: Value;
      gate?: Gate;
      data?: Data;
      memo?: string;
    } = {},
  ) {
    this.param = param;

    this.value = value;
    this.gate = gate;
    this.data = data;
    this.memo = memo;
  }
  check() {
    if (this.param.id < 0 || this.param.id > 1300) {
      throw new Error(
        `CCM ID must be between 0 and 1300. Received: ${this.param.id}`,
      );
    }
    if (this.param.color?.startsWith("#") === false) {
      throw new Error(
        `CCM Color must start with #. Received: ${this.param.color}`,
      );
    }
    if (
      this.param.sync !== undefined &&
      (this.param.sync !== "Last" && this.param.sync !== "LastEachGame")
    ) {
      throw new Error(
        `CCM Sync must be "Last" or "LastEachGame". Received: ${this.param.sync}`,
      );
    }
  }

  toXML() {
    this.check();
    let xml = `<CCM ID="${this.param.id}" Name="${this.param.name}"`;
    if (this.param.color !== undefined) xml += ` Color="${this.param.color}"`;
    if (this.param.sync !== undefined) xml += ` Sync="${this.param.sync}"`;
    xml += `>`;
    if (this.value !== undefined) xml += this.value.toXML();
    if (this.gate !== undefined) xml += this.gate.toXML();
    if (this.data !== undefined) xml += this.data.toXML();
    if (this.memo !== undefined) xml += `<Memo>${this.memo}</Memo>`;
    xml += `</CCM>`;
    return escapeXML(xml);
  }
}

export class Value implements Base {
  public param: {
    default?: number;
    min?: number;
    max?: number;
    offset?: number;
    name?: string;
    type?: "Key";
    tableId?: number;
  };
  private tags?: Entry[];

  constructor(param: typeof Value.prototype.param = {}, tags?: Entry[]) {
    this.param = param;
    this.tags = tags;
  }

  check() {
    this.tags?.forEach((tag) => {
      const { min, max } = this.param;
      if (
        (min !== undefined && tag.param.value < min) ||
        (max !== undefined && tag.param.value > max)
      ) {
        throw new Error(
          `Entry Value must be between ${min} and ${max}. Received ${tag.param.value}`,
        );
      }
    });
  }

  toXML() {
    const tagName = this.constructor.name;
    let xml = `<${tagName}`;
    if (this.param.default !== undefined) {
      xml += ` Default="${this.param.default}"`;
    }
    if (this.param.min !== undefined) xml += ` Min="${this.param.min}"`;
    if (this.param.max !== undefined) xml += ` Max="${this.param.max}"`;
    if (this.param.offset !== undefined) {
      xml += ` Offset="${this.param.offset}"`;
    }
    if (this.param.name !== undefined) xml += ` Name="${this.param.name}"`;
    if (this.param.type !== undefined) xml += ` Type="${this.param.type}"`;
    if (this.param.tableId !== undefined) {
      xml += ` TableID="${this.param.tableId}"`;
    }
    if (this.tags) {
      xml += `>`;
      this.tags.forEach((tag) => {
        xml += tag.toXML();
      });
      xml += `</${tagName}>`;
    } else xml += `/>`;
    return escapeXML(xml);
  }
}

export class Gate extends Value {}

export class Entry implements Base {
  public param: {
    label: string;
    value: number;
  };

  constructor(param: typeof Entry.prototype.param) {
    this.param = param;
  }

  check() {}

  toXML() {
    this.check();
    const xml =
      `<Entry Label="${this.param.label}" Value="${this.param.value}"/>`;
    return escapeXML(xml);
  }
}

export class Table implements Base {
  public param: { id: number };
  public tags: Entry[];

  constructor(param: typeof Table.prototype.param, tags?: Entry[]) {
    this.param = param;
    this.tags = tags || [];
  }

  check() {
    if (this.param.id < 0) {
      throw new Error(
        `Table ID must be 0 or more. Received: ${this.param.id}`,
      );
    }
  }

  toXML() {
    this.check();
    let xml = `<Table ID="${this.param.id}">`;
    this.tags.forEach((tag) => {
      xml += tag.toXML();
    });
    xml += `</Table>`;
    return escapeXML(xml);
  }
}

export class Data implements Base {
  private text: string;
  constructor(text: string) {
    this.text = text;
  }

  check() {}
  toXML() {
    this.check();
    return escapeXML(`<Data>${this.text}</Data>`);
  }
}

export class TemplateFolder implements Base {
  private param: {
    name: string;
  };
  private tags: Template[];

  constructor(
    param: typeof TemplateFolder.prototype.param,
    tags?: typeof TemplateFolder.prototype.tags,
  ) {
    this.param = param;
    this.tags = tags || [];
  }

  check() {}

  toXML() {
    let xml = `<Folder Name="${this.param.name}">`;
    this.tags.forEach((tag) => {
      xml += tag.toXML();
    });
    xml += `</Folder>`;
    return escapeXML(xml);
  }
}

export class Template implements Base {
  public param: { id?: number; name: string };
  public tags: (CC)[];

  constructor(
    param: typeof Template.prototype.param,
    tags?: typeof Template.prototype.tags,
  ) {
    this.param = param;
    this.tags = tags || [];
  }

  check() {
    if (this.param.id !== undefined && this.param.id < 0) {
      throw new Error(
        `Template ID must be 0 or more. Received: ${this.param.id}`,
      );
    }
  }

  toXML() {
    this.check();
    let xml = `<Template`;
    if (this.param.id !== undefined) xml += ` ID="${this.param.id}"`;
    xml += ` Name="${this.param.name}">`;
    this.tags.forEach((tag) => {
      xml += tag.toXML();
    });
    xml += `</Template>`;
    return escapeXML(xml);
  }
}

export class CC implements Base {
  public param: { id: number; value?: number; gate?: number };

  constructor(param: typeof CC.prototype.param) {
    this.param = param;
  }

  check() {}

  toXML() {
    this.check();
    let xml = `<CC ID="${this.param.id}"`;
    if (this.param.value !== undefined) xml += ` Value="${this.param.value}"`;
    if (this.param.gate !== undefined) xml += ` Gate="${this.param.gate}"`;
    xml += `/>`;
    return escapeXML(xml);
  }
}

interface Base {
  check(): void;
  toXML(): string;
}

function escapeXML(str: string) {
  return str.replace(/&(?!amp;|apos;)/g, "&amp;");
}
