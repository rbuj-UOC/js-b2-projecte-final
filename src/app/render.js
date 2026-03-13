import { BLOCK_TYPES } from "../models/blockTypes";
import formatDate from "../utils/formatDate";
import { ACTION, DOM_ID, VIEW_MODE } from "./constants";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function blockPreviewHtml(block) {
  if (block.type === BLOCK_TYPES.heading) {
    return `<h${block.level} class="block-heading block-heading-level-${block.level}" style="color:#${escapeHtml(block.color)}">${escapeHtml(block.content)}</h${block.level}>`;
  }

  if (block.type === BLOCK_TYPES.image) {
    const maxWidth =
      block.maxWidth === "auto" ? "none" : `${block.maxWidth}${block.units}`;
    const width = block.upscale ? "100%" : "auto";
    return `<img src="${escapeHtml(block.content)}" alt="Vista previa" class="block-image" style="display:block;height:auto;width:${width};max-width:${maxWidth};" />`;
  }

  const paragraphClass = block.highlight
    ? "block-paragraph block-paragraph-highlight"
    : "block-paragraph";
  return `<p class="${paragraphClass}">${escapeHtml(block.content)}</p>`;
}

function renderList(uiState) {
  const sortedNotes = uiState.notesState.noteList.sorted();

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

  return `
    <section class="panel card border-0 shadow-sm">
      <div class="card-body p-3 p-md-4">
        <div class="panel-header d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h2 class="h4 mb-0">Notes</h2>
          <button type="button" class="btn btn-uoc-primary" data-action="${ACTION.START_NEW_NOTE}">Nota nova</button>
        </div>
        <ul class="list-unstyled d-grid gap-2 mb-0">
          ${sortedNotes
            .map(
              (note) => `
                <li class="note-list-item rounded-3 p-3">
                  <button type="button" class="note-link btn btn-link text-start p-0 text-decoration-none" data-action="${ACTION.EDIT_NOTE}" data-note-id="${escapeHtml(note.id)}">
                    <strong>${escapeHtml(note.name || note.id)}</strong>
                    <span class="d-block">${escapeHtml(formatDate(note.dateUpdated))}</span>
                  </button>
                  <button type="button" class="btn btn-sm btn-uoc-danger" data-action="${ACTION.OPEN_DELETE}" data-note-id="${escapeHtml(note.id)}">Elimina</button>
                </li>
              `
            )
            .join("")}
        </ul>
      </div>
    </section>
  `;
}

function renderDetail(uiState) {
  const { editingNote, isNewNote, errorMessage } = uiState.notesState;
  if (!editingNote) {
    return "";
  }

  return `
    <section class="panel card border-0 shadow-sm">
      <div class="card-body p-3 p-md-4">
        <div class="panel-header d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h2 class="h4 mb-0">${isNewNote ? "Nota nova" : `Edita ${escapeHtml(editingNote.id)}`}</h2>
          <div class="header-actions d-flex flex-wrap gap-2 justify-content-end">
            ${
              isNewNote
                ? ""
                : `<button type="button" class="btn btn-uoc-danger" data-action="${ACTION.OPEN_DELETE}" data-note-id="${escapeHtml(editingNote.id)}">Elimina la nota</button>`
            }
            <button type="button" class="btn btn-outline-uoc" data-action="${ACTION.DISCARD_EDITING}">Descarta</button>
            <button type="button" class="btn btn-uoc-primary" data-action="${ACTION.SAVE_NOTE}">Desa la nota</button>
          </div>
        </div>

        <label class="form-row mb-3">
          <span class="form-label fw-semibold">Nom de la nota</span>
          <input id="${DOM_ID.NOTE_NAME_INPUT}" class="form-control" value="${escapeHtml(editingNote.name)}" placeholder="Escriu un nom" />
        </label>

        ${errorMessage ? `<p class="error-message">${escapeHtml(errorMessage)}</p>` : ""}

        <div class="panel-subheader d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h3 class="h5 mb-0">Blocs</h3>
          <div class="block-add-actions d-flex flex-wrap gap-2">
            <button type="button" class="btn btn-sm btn-outline-uoc" data-action="${ACTION.NEW_BLOCK}" data-block-type="heading">+ Encapçalament</button>
            <button type="button" class="btn btn-sm btn-outline-uoc" data-action="${ACTION.NEW_BLOCK}" data-block-type="paragraph">+ Paràgraf</button>
            <button type="button" class="btn btn-sm btn-outline-uoc" data-action="${ACTION.NEW_BLOCK}" data-block-type="image">+ Imatge</button>
          </div>
        </div>

        ${
          !editingNote.blocks.length
            ? '<p class="hint-text">La nota esta buida. Afegeix el primer bloc.</p>'
            : ""
        }

        <ul class="block-list list-unstyled d-grid gap-2 mb-0">
          ${editingNote.blocks
            .map(
              (block, index) => `
                <li class="block-item rounded-3 p-2 p-md-3" draggable="true" data-block-index="${index}">
                  <button type="button" class="block-content btn btn-link text-decoration-none text-start p-0" data-action="${ACTION.EDIT_BLOCK}" data-block-index="${index}">
                    ${blockPreviewHtml(block)}
                  </button>
                  <div class="inline-actions d-flex flex-wrap gap-2 mt-2">
                    <button type="button" class="btn btn-sm btn-outline-uoc" data-action="${ACTION.EDIT_BLOCK}" data-block-index="${index}">Edita</button>
                    <button type="button" class="btn btn-sm btn-outline-uoc" data-action="${ACTION.INSERT_BEFORE}" data-block-index="${index}">+ Abans</button>
                    <button type="button" class="btn btn-sm btn-outline-uoc" data-action="${ACTION.INSERT_AFTER}" data-block-index="${index}">+ Després</button>
                  </div>
                </li>
              `
            )
            .join("")}
        </ul>
      </div>
    </section>
  `;
}

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

function renderBlockEditor(uiState) {
  if (!uiState.blockEditor.open) {
    return "";
  }

  const { index } = uiState.blockEditor;
  const d = uiState.blockDraft;

  return `
    <div class="sheet-overlay" role="dialog" aria-modal="true">
      <section class="sheet card border-0 shadow">
        <div class="card-body p-3 p-md-4">
          <h3 class="h5 mb-3">${index === null ? "Bloc nou" : "Edita el bloc"}</h3>
          <label class="form-row mb-3">
            <span class="form-label fw-semibold">Tipus de bloc</span>
            <select class="form-select" id="${DOM_ID.BLOCK_TYPE_SELECT}">
              <option value="heading" ${d.type === BLOCK_TYPES.heading ? "selected" : ""}>Encapçalament</option>
              <option value="paragraph" ${d.type === BLOCK_TYPES.paragraph ? "selected" : ""}>Paràgraf</option>
              <option value="image" ${d.type === BLOCK_TYPES.image ? "selected" : ""}>Imatge</option>
            </select>
          </label>

          ${
            d.type !== BLOCK_TYPES.image
              ? `<label class="form-row mb-3"><span class="form-label fw-semibold">Contingut</span><textarea id="${DOM_ID.BLOCK_CONTENT}" class="form-control" rows="4" placeholder="Escriu el contingut del bloc">${escapeHtml(d.content)}</textarea></label>`
              : ""
          }

          ${
            d.type === BLOCK_TYPES.heading
              ? `<label class="form-row mb-3"><span class="form-label fw-semibold">Nivell</span><select id="${DOM_ID.HEADING_LEVEL}" class="form-select"><option value="1" ${d.headingLevel === 1 ? "selected" : ""}>Nivell 1</option><option value="2" ${d.headingLevel === 2 ? "selected" : ""}>Nivell 2</option><option value="3" ${d.headingLevel === 3 ? "selected" : ""}>Nivell 3</option></select></label>
                 <label class="form-row mb-3"><span class="form-label fw-semibold">Color HEX (6 caracters)</span><input id="${DOM_ID.HEADING_COLOR}" class="form-control" maxlength="6" value="${escapeHtml(d.headingColor)}" placeholder="000000" /></label>`
              : ""
          }

          ${
            d.type === BLOCK_TYPES.paragraph
              ? `<label class="checkbox-row form-check mb-3"><input id="${DOM_ID.PARAGRAPH_HIGHLIGHT}" class="form-check-input" type="checkbox" ${d.paragraphHighlight ? "checked" : ""} /><span class="form-check-label">Destaca el paràgraf</span></label>
                 <div class="speech-row d-flex flex-wrap align-items-center gap-2 mb-3"><button type="button" class="btn btn-outline-uoc" data-action="${ACTION.TOGGLE_DICTATION}">${uiState.speechState.active ? "Atura el dictat" : "Inicia el dictat"}</button><small>Mode dictat amb Web Speech API</small></div>`
              : ""
          }

          ${
            d.type === BLOCK_TYPES.image
              ? `<label class="form-row mb-3"><span class="form-label fw-semibold">Fitxer d'imatge</span><input id="${DOM_ID.IMAGE_FILE}" class="form-control" type="file" accept="image/png,image/jpeg,image/gif" /></label>
                 <label class="checkbox-row form-check mb-3"><input id="${DOM_ID.IMAGE_UPSCALE}" class="form-check-input" type="checkbox" ${d.imageUpscale ? "checked" : ""} /><span class="form-check-label">Escala a tota l'amplada disponible</span></label>
                 <label class="form-row mb-3"><span class="form-label fw-semibold">Unitats</span><select id="${DOM_ID.IMAGE_UNITS}" class="form-select"><option value="%" ${d.imageUnits === "%" ? "selected" : ""}>%</option><option value="px" ${d.imageUnits === "px" ? "selected" : ""}>px</option></select></label>
                 <label class="form-row mb-3"><span class="form-label fw-semibold">Amplada maxima</span><input id="${DOM_ID.IMAGE_MAX_WIDTH}" class="form-control" type="number" value="${escapeHtml(d.imageMaxWidth)}" placeholder="${d.imageUpscale && d.imageUnits === "%" ? "100" : "Obligatori"}" /></label>
                 ${d.content ? `<img src="${escapeHtml(d.content)}" alt="Vista previa" class="image-preview" />` : ""}`
              : ""
          }

          ${uiState.blockError ? `<p class="error-message">${escapeHtml(uiState.blockError)}</p>` : ""}

          <footer class="sheet-actions d-flex flex-wrap justify-content-end gap-2 mt-3">
            ${
              index !== null && index !== undefined
                ? `<button type="button" class="btn btn-uoc-danger" data-action="${ACTION.DELETE_BLOCK}">Elimina el bloc</button>`
                : ""
            }
            <button type="button" class="btn btn-outline-uoc" data-action="${ACTION.CLOSE_BLOCK_EDITOR}">Descarta</button>
            <button type="button" class="btn btn-uoc-primary" data-action="${ACTION.SAVE_BLOCK}">Desa el bloc</button>
          </footer>
        </div>
      </section>
    </div>
  `;
}

function restoreNoteInputFocus(rootElement, activeElement) {
  const shouldRestoreFocus =
    activeElement instanceof HTMLInputElement &&
    activeElement.id === DOM_ID.NOTE_NAME_INPUT;

  if (!shouldRestoreFocus) {
    return;
  }

  const noteInputSelectionStart = activeElement.selectionStart;
  const noteInputSelectionEnd = activeElement.selectionEnd;

  const noteNameInput = rootElement.querySelector(`#${DOM_ID.NOTE_NAME_INPUT}`);
  if (noteNameInput instanceof HTMLInputElement) {
    noteNameInput.focus();

    const selectionStart = Math.min(
      noteInputSelectionStart ?? noteNameInput.value.length,
      noteNameInput.value.length
    );
    const selectionEnd = Math.min(
      noteInputSelectionEnd ?? noteNameInput.value.length,
      noteNameInput.value.length
    );

    noteNameInput.setSelectionRange(selectionStart, selectionEnd);
  }
}

function renderApp(rootElement, uiState) {
  const activeElement = document.activeElement;

  const mainContent =
    uiState.view === VIEW_MODE.LIST
      ? renderList(uiState)
      : uiState.view === VIEW_MODE.DETAIL
        ? renderDetail(uiState)
        : renderDelete(uiState);

  rootElement.innerHTML = `
    <main class="app-shell container-fluid py-4 py-md-5">
      <header class="page-header mb-4 mb-md-5 text-center text-md-start">
        <h1 class="display-6 fw-bold mb-2">Aplicació per gestionar notes</h1>
        <p class="lead mb-0">Pràctica final JavaScript B2 amb persistència LocalStorage i blocs configurables.</p>
      </header>
      ${mainContent}
    </main>
    ${renderBlockEditor(uiState)}
  `;

  restoreNoteInputFocus(rootElement, activeElement);
}

export { renderApp };
