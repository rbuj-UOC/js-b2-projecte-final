import { parseBlock } from "./blocks";

class Note {
  constructor({ id, name = "", dateCreated, dateUpdated, blocks = [] } = {}) {
    this.id = id;
    this.name = name;
    this.dateCreated = dateCreated || new Date().toISOString();
    this.dateUpdated = dateUpdated || this.dateCreated;
    this.blocks = blocks;
  }

  setName(name) {
    this.name = String(name || "").trim();
  }

  touch() {
    this.dateUpdated = new Date().toISOString();
  }

  addBlock(block, position = this.blocks.length) {
    const safePosition = Math.max(0, Math.min(position, this.blocks.length));
    this.blocks.splice(safePosition, 0, block);
    this.touch();
  }

  updateBlock(position, block) {
    if (position < 0 || position >= this.blocks.length) {
      throw new Error("La posició del bloc no és vàlida.");
    }

    this.blocks[position] = block;
    this.touch();
  }

  moveBlock(fromPosition, toPosition) {
    if (fromPosition < 0 || fromPosition >= this.blocks.length) {
      return;
    }

    const clampedTarget = Math.max(
      0,
      Math.min(toPosition, this.blocks.length - 1)
    );
    if (fromPosition === clampedTarget) {
      return;
    }

    const [moved] = this.blocks.splice(fromPosition, 1);
    this.blocks.splice(clampedTarget, 0, moved);
    this.touch();
  }

  removeBlock(position) {
    if (position < 0 || position >= this.blocks.length) {
      throw new Error("La posició del bloc no és vàlida.");
    }

    this.blocks.splice(position, 1);
    this.touch();
  }

  parse(jsonNote) {
    const data = typeof jsonNote === "string" ? JSON.parse(jsonNote) : jsonNote;

    this.id = data.id;
    this.name = data.name;
    this.dateCreated = data.date_created;
    this.dateUpdated = data.date_updated;
    this.blocks = (data.blocks || []).map((rawBlock) => parseBlock(rawBlock));
  }

  plain() {
    return {
      id: this.id,
      name: this.name,
      date_created: this.dateCreated,
      date_updated: this.dateUpdated,
      blocks: this.blocks.map((block) => block.plain())
    };
  }

  render() {
    return this.blocks.map((block) => block.render());
  }

  clone() {
    const cloned = new Note();
    cloned.parse(this.plain());
    return cloned;
  }
}

export default Note;
