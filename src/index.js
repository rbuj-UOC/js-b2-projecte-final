import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import StorageAPI from "./services/storageApi";
import { NotesController } from "./services/notesController";
import { speechController } from "./services/speechController";
import { DEFAULT_NEW_BLOCK_TYPE, VIEW_MODE } from "./app/constants";
import {
  createBlockDraftFromBlock,
  createDefaultBlockDraft
} from "./app/blockDraft";
import { renderApp } from "./app/render";
import { attachAppHandlers } from "./app/handlers";

function initApp(rootElement = document.getElementById("root")) {
  if (!rootElement) {
    return null;
  }

  const notesController = new NotesController(new StorageAPI());
  const uiState = {
    view: VIEW_MODE.LIST,
    deletingNoteId: null,
    draggingBlockIndex: null,
    blockEditor: {
      open: false,
      index: null,
      insertIndex: null
    },
    blockDraft: createDefaultBlockDraft(DEFAULT_NEW_BLOCK_TYPE),
    blockError: "",
    notesState: notesController.getState(),
    speechState: speechController.getState()
  };

  const closeBlockEditor = () => {
    speechController.stop();
    uiState.blockEditor = {
      open: false,
      index: null,
      insertIndex: null
    };
    uiState.blockDraft = createDefaultBlockDraft(DEFAULT_NEW_BLOCK_TYPE);
    uiState.blockError = "";
    render();
  };

  const openBlockEditor = ({ index, type, insertIndex }) => {
    const { editingNote } = uiState.notesState;
    if (!editingNote) {
      return;
    }

    if (index === null || index === undefined) {
      uiState.blockDraft = createDefaultBlockDraft(
        type || DEFAULT_NEW_BLOCK_TYPE
      );
    } else {
      uiState.blockDraft = createBlockDraftFromBlock(editingNote.blocks[index]);
    }

    uiState.blockEditor = {
      open: true,
      index,
      insertIndex: insertIndex ?? null
    };
    uiState.blockError = "";
    render();
  };

  const render = () => {
    renderApp(rootElement, uiState);
  };

  const detachHandlers = attachAppHandlers({
    rootElement,
    uiState,
    notesController,
    speechController,
    render,
    openBlockEditor,
    closeBlockEditor,
    createDefaultBlockDraft
  });

  render();

  return {
    destroy() {
      detachHandlers();
      speechController.stop();
      rootElement.innerHTML = "";
    }
  };
}

if (import.meta.env.MODE !== "test") {
  initApp();
}

export { initApp };
