import escapeHtml from "../utils/escapeHtml";
import { ACTION } from "./constants";

function renderDelete(uiState) {
  const noteId = uiState.deletingNoteId;
  if (!noteId) {
    return "";
  }

  const note = uiState.notesState.noteList.find(noteId);
  if (!note) {
    return "";
  }

  return `
    <section class="panel card border-0 shadow-sm narrow-panel">
      <div class="card-body p-3 p-md-4">
        <h2 class="h4 mb-3">Eliminar nota</h2>
        <p>Segur que vols eliminar la nota <strong>${escapeHtml(note.name || note.id)}</strong>?</p>
        <div class="d-flex flex-wrap gap-2 justify-content-end">
          <button type="button" class="btn btn-outline-uoc" data-action="${ACTION.CANCEL_DELETE}">Cancel·la</button>
          <button type="button" class="btn btn-uoc-danger" data-action="${ACTION.CONFIRM_DELETE}">Elimina definitivament</button>
        </div>
      </div>
    </section>
  `;
}

export { renderDelete };
