class Block {
  constructor(type, content = "") {
    this.type = type;
    this.content = content;
  }

  assertType(expectedType) {
    if (this.type !== expectedType) {
      throw new Error(
        `El tipus de bloc no coincideix. S'esperava ${expectedType} i s'ha rebut ${this.type}`
      );
    }
  }

  validateContent(content) {
    if (typeof content !== "string") {
      throw new Error("El contingut del bloc ha de ser una cadena de text.");
    }
  }

  parse(jsonBlock) {
    const data =
      typeof jsonBlock === "string" ? JSON.parse(jsonBlock) : jsonBlock;

    if (!data || typeof data !== "object") {
      throw new Error("El bloc no és un objecte vàlid.");
    }

    this.assertType(data.type);
    this.validateContent(data.content);

    this.content = data.content;
  }

  plain() {
    return {
      type: this.type,
      content: this.content,
      config: {}
    };
  }

  render() {
    return "";
  }
}

export { Block };
