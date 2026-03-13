import { BLOCK_TYPES } from "../models/blockTypes";
import { createBlock } from "../models/blocksFactory";
import { NOTES_EVENTS } from "../services/notesController";
import { SPEECH_EVENTS } from "../services/speechController";
import {
  ACTION,
  BLOCK_DRAFT_INPUT_IDS,
  DOM_ID,
  IMAGE_ALLOWED_TYPES,
  IMAGE_MAX_SIZE_BYTES,
  VIEW_MODE
} from "./constants";

function updateBlockDraftFromInputs(rootElement, uiState) {
  const typeSelect = rootElement.querySelector(`#${DOM_ID.BLOCK_TYPE_SELECT}`);
  const content = rootElement.querySelector(`#${DOM_ID.BLOCK_CONTENT}`);
  const headingLevel = rootElement.querySelector(`#${DOM_ID.HEADING_LEVEL}`);
  const headingColor = rootElement.querySelector(`#${DOM_ID.HEADING_COLOR}`);
  const paragraphHighlight = rootElement.querySelector(
    `#${DOM_ID.PARAGRAPH_HIGHLIGHT}`
  );
  const imageUpscale = rootElement.querySelector(`#${DOM_ID.IMAGE_UPSCALE}`);
  const imageUnits = rootElement.querySelector(`#${DOM_ID.IMAGE_UNITS}`);
  const imageMaxWidth = rootElement.querySelector(`#${DOM_ID.IMAGE_MAX_WIDTH}`);

  uiState.blockDraft = {
    ...uiState.blockDraft,
    type: typeSelect ? typeSelect.value : uiState.blockDraft.type,
    content: content ? content.value : uiState.blockDraft.content,
    headingLevel: headingLevel
      ? Number(headingLevel.value)
      : uiState.blockDraft.headingLevel,
    headingColor: headingColor
      ? headingColor.value.replace("#", "")
      : uiState.blockDraft.headingColor,
    paragraphHighlight: paragraphHighlight
      ? paragraphHighlight.checked
      : uiState.blockDraft.paragraphHighlight,
    imageUpscale: imageUpscale
      ? imageUpscale.checked
      : uiState.blockDraft.imageUpscale,
    imageUnits: imageUnits ? imageUnits.value : uiState.blockDraft.imageUnits,
    imageMaxWidth: imageMaxWidth
      ? imageMaxWidth.value
      : uiState.blockDraft.imageMaxWidth
  };
}

function attachAppHandlers({
  rootElement,
  uiState,
  notesController,
  speechController,
  render,
  openBlockEditor,
  closeBlockEditor,
  createDefaultBlockDraft
}) {
  const handleNoteChangeEvent = () => {
    uiState.notesState = notesController.getState();
    render();
  };

  const handleSpeechChangeEvent = () => {
    uiState.speechState = speechController.getState();
    render();
  };

  const handleSpeechErrorEvent = (event) => {
    uiState.blockError = event.detail.message;
    uiState.speechState = speechController.getState();
    render();
  };

  const handleInputEvent = (event) => {
    if (event.target.id === DOM_ID.NOTE_NAME_INPUT) {
      notesController.setDraftName(event.target.value);
      return;
    }

    if (BLOCK_DRAFT_INPUT_IDS.includes(event.target.id)) {
      updateBlockDraftFromInputs(rootElement, uiState);
    }
  };

  const handleChangeEvent = async (event) => {
    if (event.target.id === DOM_ID.BLOCK_TYPE_SELECT) {
      const current = uiState.blockDraft;
      const nextType = event.target.value;
      const nextDraft = createDefaultBlockDraft(nextType);
      nextDraft.content = current.content;
      uiState.blockDraft = nextDraft;
      uiState.blockError = "";
      render();
      return;
    }

    if (event.target.id === DOM_ID.IMAGE_FILE) {
      try {
        const file = event.target.files?.[0];
        if (!file) {
          return;
        }

        if (!IMAGE_ALLOWED_TYPES.includes(file.type)) {
          throw new Error("Només es permeten imatges PNG, JPEG i GIF.");
        }

        if (file.size > IMAGE_MAX_SIZE_BYTES) {
          throw new Error("La imatge no pot superar 300 KB.");
        }

        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onerror = () =>
            reject(new Error("No s'ha pogut llegir la imatge."));
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });

        uiState.blockDraft = {
          ...uiState.blockDraft,
          content: String(base64 || "")
        };
        uiState.blockError = "";
      } catch (error) {
        uiState.blockError = error.message;
      }
      render();
    }
  };

  const handleClickEvent = (event) => {
    const actionNode = event.target.closest("[data-action]");
    if (!actionNode) {
      return;
    }

    const action = actionNode.dataset.action;
    const noteId = actionNode.dataset.noteId;
    const blockIndex = actionNode.dataset.blockIndex;

    switch (action) {
      case ACTION.START_NEW_NOTE:
        notesController.startNewNote();
        notesController.clearError();
        uiState.view = VIEW_MODE.DETAIL;
        render();
        return;
      case ACTION.EDIT_NOTE: {
        const opened = notesController.editNote(noteId);
        if (!opened) {
          return;
        }
        notesController.clearError();
        uiState.view = VIEW_MODE.DETAIL;
        render();
        return;
      }
      case ACTION.SAVE_NOTE: {
        const saved = notesController.saveDraft();
        if (saved) {
          notesController.clearError();
          uiState.view = VIEW_MODE.LIST;
        }
        render();
        return;
      }
      case ACTION.DISCARD_EDITING:
        notesController.discardDraft();
        notesController.clearError();
        uiState.view = VIEW_MODE.LIST;
        closeBlockEditor();
        return;
      case ACTION.OPEN_DELETE:
        uiState.deletingNoteId = noteId;
        uiState.view = VIEW_MODE.DELETE;
        render();
        return;
      case ACTION.CANCEL_DELETE:
        uiState.deletingNoteId = null;
        uiState.view = uiState.notesState.editingNote
          ? VIEW_MODE.DETAIL
          : VIEW_MODE.LIST;
        render();
        return;
      case ACTION.CONFIRM_DELETE:
        if (uiState.deletingNoteId) {
          notesController.removeNote(uiState.deletingNoteId);
        }
        uiState.deletingNoteId = null;
        uiState.view = VIEW_MODE.LIST;
        render();
        return;
      case ACTION.NEW_BLOCK:
        openBlockEditor({
          index: null,
          type: actionNode.dataset.blockType,
          insertIndex: null
        });
        return;
      case ACTION.EDIT_BLOCK:
        openBlockEditor({
          index: Number(blockIndex),
          type: null,
          insertIndex: null
        });
        return;
      case ACTION.INSERT_BEFORE:
        openBlockEditor({
          index: null,
          type: BLOCK_TYPES.paragraph,
          insertIndex: Number(blockIndex)
        });
        return;
      case ACTION.INSERT_AFTER:
        openBlockEditor({
          index: null,
          type: BLOCK_TYPES.paragraph,
          insertIndex: Number(blockIndex) + 1
        });
        return;
      case ACTION.CLOSE_BLOCK_EDITOR:
        closeBlockEditor();
        return;
      case ACTION.DELETE_BLOCK: {
        const index = uiState.blockEditor.index;
        if (index !== null && index !== undefined) {
          notesController.deleteDraftBlock(index);
        }
        closeBlockEditor();
        return;
      }
      case ACTION.TOGGLE_DICTATION:
        speechController.toggle(uiState.blockEditor.index, (transcript) => {
          uiState.blockDraft = {
            ...uiState.blockDraft,
            content: `${uiState.blockDraft.content} ${transcript}`.trim()
          };
          render();
        });
        return;
      case ACTION.SAVE_BLOCK:
        try {
          updateBlockDraftFromInputs(rootElement, uiState);
          const draft = uiState.blockDraft;
          const block = createBlock(draft.type, { content: draft.content });

          if (draft.type === BLOCK_TYPES.heading) {
            block.setLevel(draft.headingLevel);
            block.setColor(draft.headingColor);
          }

          if (draft.type === BLOCK_TYPES.paragraph) {
            block.setHighlight(draft.paragraphHighlight);
          }

          if (draft.type === BLOCK_TYPES.image) {
            block.setUpscale(draft.imageUpscale);
            block.setUnits(draft.imageUnits);
            block.setMaxWidth(draft.imageMaxWidth);
          }

          notesController.upsertDraftBlock(
            block,
            uiState.blockEditor.index,
            uiState.blockEditor.insertIndex
          );
          closeBlockEditor();
        } catch (error) {
          uiState.blockError = error.message;
          render();
        }
        return;
      default:
        return;
    }
  };

  const handleDragStartEvent = (event) => {
    const item = event.target.closest("[data-block-index]");
    if (!item) {
      return;
    }

    uiState.draggingBlockIndex = Number(item.dataset.blockIndex);
  };

  const handleDragOverEvent = (event) => {
    if (event.target.closest("[data-block-index]")) {
      event.preventDefault();
    }
  };

  const handleDropEvent = (event) => {
    const item = event.target.closest("[data-block-index]");
    if (!item) {
      return;
    }

    event.preventDefault();
    const to = Number(item.dataset.blockIndex);
    const from = uiState.draggingBlockIndex;

    if (from === null || from === undefined || Number.isNaN(to)) {
      return;
    }

    notesController.moveDraftBlock(from, to);
    uiState.draggingBlockIndex = null;
    render();
  };

  notesController.addEventListener(NOTES_EVENTS.change, handleNoteChangeEvent);
  notesController.addEventListener(NOTES_EVENTS.error, handleNoteChangeEvent);
  speechController.addEventListener(
    SPEECH_EVENTS.change,
    handleSpeechChangeEvent
  );
  speechController.addEventListener(
    SPEECH_EVENTS.error,
    handleSpeechErrorEvent
  );

  rootElement.addEventListener("input", handleInputEvent);
  rootElement.addEventListener("change", handleChangeEvent);
  rootElement.addEventListener("click", handleClickEvent);
  rootElement.addEventListener("dragstart", handleDragStartEvent);
  rootElement.addEventListener("dragover", handleDragOverEvent);
  rootElement.addEventListener("drop", handleDropEvent);

  return () => {
    notesController.removeEventListener(
      NOTES_EVENTS.change,
      handleNoteChangeEvent
    );
    notesController.removeEventListener(
      NOTES_EVENTS.error,
      handleNoteChangeEvent
    );
    speechController.removeEventListener(
      SPEECH_EVENTS.change,
      handleSpeechChangeEvent
    );
    speechController.removeEventListener(
      SPEECH_EVENTS.error,
      handleSpeechErrorEvent
    );

    rootElement.removeEventListener("input", handleInputEvent);
    rootElement.removeEventListener("change", handleChangeEvent);
    rootElement.removeEventListener("click", handleClickEvent);
    rootElement.removeEventListener("dragstart", handleDragStartEvent);
    rootElement.removeEventListener("dragover", handleDragOverEvent);
    rootElement.removeEventListener("drop", handleDropEvent);
  };
}

export { attachAppHandlers };
