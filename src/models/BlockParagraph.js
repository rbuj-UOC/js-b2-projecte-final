import { Block } from "./Block";
import { BLOCK_TYPES } from "./blockTypes";
import escapeHtml from "../utils/escapeHtml";

class BlockParagraph extends Block {
  constructor({ content = "", highlight = false } = {}) {
    super(BLOCK_TYPES.paragraph, content);
    this.highlight = Boolean(highlight);
  }

  setHighlight(value) {
    this.highlight = Boolean(value);
  }

  parse(jsonBlock) {
    super.parse(jsonBlock);

    const data =
      typeof jsonBlock === "string" ? JSON.parse(jsonBlock) : jsonBlock;
    const config = data.config || {};

    this.setHighlight(config.highlight ?? false);
  }

  plain() {
    return {
      type: this.type,
      content: this.content,
      config: {
        highlight: this.highlight
      }
    };
  }

  render() {
    const paragraphClass = this.highlight
      ? "block-paragraph block-paragraph-highlight"
      : "block-paragraph";
    return `<p class="${paragraphClass}">${escapeHtml(this.content)}</p>`;
  }
}

export { BlockParagraph };
