import { DOM_ID, VIEW_MODE } from "./constants";
import { renderList } from "./renderNoteList";
import { renderDelete } from "./renderNoteDelete";
import { renderBlockEditor, renderDetail } from "./renderNoteEditor";

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
