import { Block } from "./Block";
import { BLOCK_TYPES } from "./blockTypes";

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
    return {
      type: "p",
      text: this.content,
      className:
        `block-paragraph ${this.highlight ? "block-paragraph-highlight" : ""}`.trim()
    };
  }
}

export { BlockParagraph };
