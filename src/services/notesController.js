import Note from "../models/Note";
import Notes from "../models/Notes";

const NOTES_EVENTS = {
  change: "notes:change",
  error: "notes:error"
};

class NotesController extends EventTarget {
  constructor(storageApi) {
    super();
    this.storageApi = storageApi;
    this.state = {
      noteList: new Notes(),
      editingNote: null,
      isNewNote: false,
      errorMessage: ""
    };

    this.load();
  }

  getState() {
    return this.state;
  }

  emitChange() {
    this.dispatchEvent(
      new CustomEvent(NOTES_EVENTS.change, {
        detail: this.getState()
      })
    );
  }

  emitError(message) {
    this.state = {
      ...this.state,
      errorMessage: message
    };

    this.dispatchEvent(
      new CustomEvent(NOTES_EVENTS.error, {
        detail: { message }
      })
    );

    this.emitChange();
  }

  clearError() {
    if (!this.state.errorMessage) {
      return;
    }

    this.state = {
      ...this.state,
      errorMessage: ""
    };
    this.emitChange();
  }

  load() {
    const noteList = this.storageApi.loadNotes();
    this.state = {
      ...this.state,
      noteList
    };
    this.emitChange();
  }

  saveNoteList(noteList) {
    this.storageApi.saveNotes(noteList);
    this.state = {
      ...this.state,
      noteList
    };
  }

  startNewNote() {
    const note = new Note({
      id: this.state.noteList.nextId(),
      name: "",
      blocks: []
    });

    this.state = {
      ...this.state,
      editingNote: note,
      isNewNote: true
    };
    this.emitChange();
  }

  editNote(noteId) {
    const note = this.state.noteList.find(noteId);
    if (!note) {
      return false;
    }

    this.state = {
      ...this.state,
      editingNote: note.clone(),
      isNewNote: false
    };
    this.emitChange();
    return true;
  }

  discardDraft() {
    this.state = {
      ...this.state,
      editingNote: null,
      isNewNote: false
    };
    this.emitChange();
  }

  saveDraft() {
    try {
      const { editingNote, isNewNote, noteList } = this.state;

      if (!editingNote) {
        return false;
      }

      if (!editingNote.name.trim()) {
        throw new Error("El nom de la nota és obligatori.");
      }

      const nextEditingNote = editingNote.clone();
      nextEditingNote.touch();

      const nextNoteList = isNewNote
        ? noteList.add(nextEditingNote)
        : noteList.update(nextEditingNote);

      this.saveNoteList(nextNoteList);
      this.state = {
        ...this.state,
        editingNote: null,
        isNewNote: false
      };
      this.emitChange();
      return true;
    } catch (error) {
      this.emitError(error.message);
      return false;
    }
  }

  removeNote(noteId) {
    const nextNoteList = this.state.noteList.remove(noteId);
    this.saveNoteList(nextNoteList);

    const shouldClearDraft =
      this.state.editingNote && this.state.editingNote.id === noteId;

    this.state = {
      ...this.state,
      editingNote: shouldClearDraft ? null : this.state.editingNote,
      isNewNote: shouldClearDraft ? false : this.state.isNewNote
    };

    this.emitChange();
  }

  setDraftName(name) {
    if (!this.state.editingNote) {
      return;
    }

    const next = this.state.editingNote.clone();
    next.setName(name);
    this.state = {
      ...this.state,
      editingNote: next
    };
    this.emitChange();
  }

  upsertDraftBlock(block, index, insertIndex = null) {
    if (!this.state.editingNote) {
      return;
    }

    const nextNote = this.state.editingNote.clone();

    if (index === null || index === undefined) {
      if (insertIndex === null || insertIndex === undefined) {
        nextNote.addBlock(block, nextNote.blocks.length);
      } else {
        nextNote.addBlock(block, insertIndex);
      }
    } else {
      nextNote.updateBlock(index, block);
    }

    this.state = {
      ...this.state,
      editingNote: nextNote
    };
    this.emitChange();
  }

  deleteDraftBlock(index) {
    if (!this.state.editingNote) {
      return;
    }

    try {
      const nextNote = this.state.editingNote.clone();
      nextNote.removeBlock(index);
      this.state = {
        ...this.state,
        editingNote: nextNote
      };
      this.emitChange();
    } catch (error) {
      this.emitError(error.message);
    }
  }

  moveDraftBlock(from, to) {
    if (!this.state.editingNote) {
      return;
    }

    const nextNote = this.state.editingNote.clone();
    nextNote.moveBlock(from, to);
    this.state = {
      ...this.state,
      editingNote: nextNote
    };
    this.emitChange();
  }
}

export { NOTES_EVENTS, NotesController };
