import { BLOCK_TYPES } from "./blockTypes";
import { BlockHeading } from "./BlockHeading";
import { BlockParagraph } from "./BlockParagraph";
import { BlockImage } from "./BlockImage";

function createBlock(type, data = {}) {
  switch (type) {
    case BLOCK_TYPES.heading:
      return new BlockHeading(data);
    case BLOCK_TYPES.paragraph:
      return new BlockParagraph(data);
    case BLOCK_TYPES.image:
      return new BlockImage(data);
    default:
      throw new Error(`Tipus de bloc no suportat: ${type}`);
  }
}

function parseBlock(jsonBlock) {
  const data =
    typeof jsonBlock === "string" ? JSON.parse(jsonBlock) : jsonBlock;
  const block = createBlock(data.type);

  block.parse(data);
  return block;
}

export { createBlock, parseBlock };
