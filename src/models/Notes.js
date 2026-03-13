import Note from "./Note";

class Notes {
  constructor(notes = []) {
    this.notes = [...notes];
  }

  sorted() {
    return [...this.notes].sort(
      (first, second) =>
        new Date(second.dateUpdated) - new Date(first.dateUpdated)
    );
  }

  find(id) {
    return this.notes.find((note) => note.id === id) || null;
  }

  nextId() {
    const maxNumericId = this.notes.reduce((maxId, note) => {
      const match = String(note.id || "").match(/^note_(\d+)$/);
      if (!match) {
        return maxId;
      }
      return Math.max(maxId, Number(match[1]));
    }, 0);

    return `note_${maxNumericId + 1}`;
  }

  add(note) {
    return new Notes([...this.notes, note]);
  }

  update(note) {
    return new Notes(this.notes.map((n) => (n.id === note.id ? note : n)));
  }

  remove(id) {
    return new Notes(this.notes.filter((note) => note.id !== id));
  }

  parse(data) {
    const arr = typeof data === "string" ? JSON.parse(data) : data;

    this.notes = arr.map((item) => {
      const note = new Note();
      note.parse(item);
      return note;
    });

    return this;
  }

  plain() {
    return this.notes.map((note) => note.plain());
  }
}

export default Notes;
