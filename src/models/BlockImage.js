import { Block } from "./Block";
import { BLOCK_TYPES } from "./blockTypes";
import escapeHtml from "../utils/escapeHtml";

const IMAGE_BASE64_REGEX = /^data:image\/(png|jpeg|gif);base64,/i;

class BlockImage extends Block {
  constructor({ content = "", upscale = true, units = "%", maxWidth } = {}) {
    super(BLOCK_TYPES.image, content);

    this.upscale = true;
    this.units = "%";
    this.maxWidth = 100;

    this.setUpscale(upscale);
    this.setUnits(units);
    this.setMaxWidth(maxWidth);

    if (content) {
      this.validateContent(content);
    }
  }

  validateContent(content) {
    super.validateContent(content);

    if (content.length && !IMAGE_BASE64_REGEX.test(content)) {
      throw new Error(
        "El contingut de la imatge ha de ser una URL de dades base64 amb format png, jpeg o gif."
      );
    }
  }

  setUpscale(value) {
    this.upscale = Boolean(value);

    if (
      !this.upscale &&
      (this.maxWidth === 100 ||
        this.maxWidth === undefined ||
        this.maxWidth === null)
    ) {
      this.maxWidth = "auto";
    }
  }

  setUnits(units) {
    if (units !== "%" && units !== "px") {
      throw new Error("Les unitats de la imatge han de ser % o px.");
    }

    this.units = units;
  }

  setMaxWidth(value) {
    if (
      !this.upscale &&
      (value === undefined ||
        value === null ||
        value === "auto" ||
        value === "")
    ) {
      this.maxWidth = "auto";
      return;
    }

    if (value === undefined || value === null || value === "") {
      if (this.upscale && this.units === "%") {
        this.maxWidth = 100;
        return;
      }

      throw new Error(
        "Cal l'amplitud màxima de la imatge en aquesta configuració."
      );
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue) || numericValue <= 0) {
      throw new Error(
        "L'amplitud màxima de la imatge ha de ser un nombre positiu."
      );
    }

    if (this.units === "%" && numericValue > 100) {
      throw new Error(
        "L'amplitud màxima de la imatge no pot superar 100 quan la unitat és %."
      );
    }

    this.maxWidth = numericValue;
  }

  parse(jsonBlock) {
    super.parse(jsonBlock);

    const data =
      typeof jsonBlock === "string" ? JSON.parse(jsonBlock) : jsonBlock;
    const config = data.config || {};

    this.setUpscale(config.upscale ?? true);
    this.setUnits(config.units ?? "%");
    this.setMaxWidth(config.maxWidth);
  }

  plain() {
    return {
      type: this.type,
      content: this.content,
      config: {
        upscale: this.upscale,
        units: this.units,
        maxWidth: this.maxWidth
      }
    };
  }

  render() {
    const maxWidth =
      this.maxWidth === "auto" ? "none" : `${this.maxWidth}${this.units}`;
    const width = this.upscale ? "100%" : "auto";
    return `<img src="${escapeHtml(this.content)}" alt="Vista previa" class="block-image" style="display:block;height:auto;width:${width};max-width:${maxWidth};" />`;
  }
}

export { BlockImage };
