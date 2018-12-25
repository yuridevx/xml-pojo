declare class Entities {
  encode(toEncode: string): string;

  encodeNonUTF(toEncode: string): string;

  encodeNonASCII(toEncode: string): string;

  decode(toDecode: string): string;
}

const XmlEntities = require('html-entities/lib/xml-entities')

export const xmlEntities: Entities = new XmlEntities()
export const parser = new DOMParser()
export const serializer = new XMLSerializer()


