import formatDate from "../utils/formatDate";
import escapeHtml from "../utils/escapeHtml";
import { ACTION } from "./constants";

function renderList(uiState) {
  const sortedNotes = uiState.notesState.noteList.sorted();

  // Si no hi ha notes, mostrem un missatge per crear la primera nota
  if (!sortedNotes.length) {
    return `
      <section class="panel card border-0 shadow-sm">
        <div class="card-body p-3 p-md-4">
          <div class="panel-header d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h2 class="h4 mb-0">Notes</h2>
            <button type="button" class="btn btn-uoc-primary" data-action="${ACTION.START_NEW_NOTE}">Nota nova</button>
          </div>
          <div class="empty-state text-center p-4 rounded-4 border border-2 border-dashed">
            <h3 class="h5">Encara no hi ha cap nota</h3>
            <p class="mb-3">Comença creant la teva primera nota per afegir-hi blocs de contingut.</p>
            <button type="button" class="btn btn-uoc-primary" data-action="${ACTION.START_NEW_NOTE}">Crea la primera nota</button>
          </div>
        </div>
      </section>
    `;
  }

  // Si hi ha notes, les mostrem ordenades per data de modificació més recent
  return `
    <section class="panel card border-0 shadow-sm">
      <div class="card-body p-3 p-md-4">
        <div class="panel-header d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h2 class="h4 mb-0">Notes</h2>
          <button type="button" class="btn btn-uoc-primary" data-action="${ACTION.START_NEW_NOTE}">Nota nova</button>
        </div>
        <ul class="list-unstyled d-grid gap-2 mb-0">
          ${sortedNotes
            .map((note) => {
              // Per cada nota, mostrem el nom, la data de modificació i una previsualització dels blocs (renderedBlocks)
              const renderedBlocks = note.render().join("");
              return `
                <li class="note-list-item rounded-3 p-3">
                  <div class="d-flex justify-content-between align-items-start gap-2">
                    <button type="button" class="note-link btn btn-link text-start p-0 text-decoration-none" data-action="${ACTION.EDIT_NOTE}" data-note-id="${escapeHtml(note.id)}">
                      <strong>${escapeHtml(note.name || note.id)}</strong>
                      <span class="d-block">${escapeHtml(formatDate(note.dateUpdated))}</span>
                    </button>
                    <button type="button" class="btn btn-sm btn-uoc-danger flex-shrink-0" data-action="${ACTION.OPEN_DELETE}" data-note-id="${escapeHtml(note.id)}">Elimina</button>
                  </div>
                  ${
                    renderedBlocks
                      ? `<div class="note-blocks-preview mt-2" data-action="${ACTION.EDIT_NOTE}" data-note-id="${escapeHtml(note.id)}" role="button" tabindex="0">
                          ${renderedBlocks}
                        </div>`
                      : ""
                  }
                </li>
              `;
            })
            .join("")}
        </ul>
      </div>
    </section>
  `;
}

export { renderList };
