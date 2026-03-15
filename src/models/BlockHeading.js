import { Block } from "./Block";
import { BLOCK_TYPES } from "./blockTypes";
import escapeHtml from "../utils/escapeHtml";

const HEX_6_REGEX = /^[0-9a-fA-F]{6}$/;

class BlockHeading extends Block {
  constructor({ content = "", level = 1, color = "000000" } = {}) {
    super(BLOCK_TYPES.heading, content);
    this.level = 1;
    this.color = "000000";

    this.setLevel(level);
    this.setColor(color);
  }

  setLevel(level) {
    const numericLevel = Number(level);

    if (![1, 2, 3].includes(numericLevel)) {
      throw new Error("El nivell de capçalera ha de ser 1, 2 o 3.");
    }

    this.level = numericLevel;
  }

  setColor(color) {
    const normalizedColor = String(color || "").replace("#", "");

    if (!HEX_6_REGEX.test(normalizedColor)) {
      throw new Error(
        "El color de la capçalera ha de ser un valor hexadecimal de 6 caràcters."
      );
    }

    this.color = normalizedColor.toLowerCase();
  }

  parse(jsonBlock) {
    super.parse(jsonBlock);

    const data =
      typeof jsonBlock === "string" ? JSON.parse(jsonBlock) : jsonBlock;
    const config = data.config || {};

    this.setLevel(config.level ?? 1);
    this.setColor(config.color ?? "000000");
  }

  plain() {
    return {
      type: this.type,
      content: this.content,
      config: {
        level: this.level,
        color: this.color
      }
    };
  }

  render() {
    return `<h${this.level} class="block-heading block-heading-level-${this.level}" style="color:#${escapeHtml(this.color)}">${escapeHtml(this.content)}</h${this.level}>`;
  }
}

export { BlockHeading };
