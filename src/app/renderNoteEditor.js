import { BLOCK_TYPES } from "../models/blockTypes";
import escapeHtml from "../utils/escapeHtml";
import { ACTION, DOM_ID } from "./constants";

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
                    ${block.render()}
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

export { renderBlockEditor, renderDetail };
