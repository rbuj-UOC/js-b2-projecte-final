import { createBlock } from "../models/blocksFactory";
import { DEFAULT_NEW_BLOCK_TYPE } from "./constants";

function normalizeBlockDraft(block) {
  return {
    type: block.type,
    content: block.content || "",
    headingLevel: block.level || 1,
    headingColor: block.color || "000000",
    paragraphHighlight: Boolean(block.highlight),
    imageUpscale: block.upscale ?? true,
    imageUnits: block.units || "%",
    imageMaxWidth:
      block.maxWidth === "auto" || block.maxWidth === undefined
        ? ""
        : String(block.maxWidth)
  };
}

function createDefaultBlockDraft(type = DEFAULT_NEW_BLOCK_TYPE) {
  return normalizeBlockDraft(createBlock(type));
}

function createBlockDraftFromBlock(block) {
  return normalizeBlockDraft(block);
}

export { createBlockDraftFromBlock, createDefaultBlockDraft };
