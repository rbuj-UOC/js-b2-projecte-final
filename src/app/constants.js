import { BLOCK_TYPES } from "../models/blockTypes";

export const VIEW_MODE = {
  LIST: "list",
  DETAIL: "detail",
  DELETE: "delete"
};

export const ACTION = {
  START_NEW_NOTE: "start-new-note",
  EDIT_NOTE: "edit-note",
  SAVE_NOTE: "save-note",
  DISCARD_EDITING: "discard-editing",
  OPEN_DELETE: "open-delete",
  CANCEL_DELETE: "cancel-delete",
  CONFIRM_DELETE: "confirm-delete",
  NEW_BLOCK: "new-block",
  EDIT_BLOCK: "edit-block",
  INSERT_BEFORE: "insert-before",
  INSERT_AFTER: "insert-after",
  CLOSE_BLOCK_EDITOR: "close-block-editor",
  DELETE_BLOCK: "delete-block",
  TOGGLE_DICTATION: "toggle-dictation",
  SAVE_BLOCK: "save-block"
};

export const DOM_ID = {
  NOTE_NAME_INPUT: "note-name-input",
  BLOCK_TYPE_SELECT: "block-type-select",
  BLOCK_CONTENT: "block-content",
  HEADING_LEVEL: "heading-level",
  HEADING_COLOR: "heading-color",
  PARAGRAPH_HIGHLIGHT: "paragraph-highlight",
  IMAGE_FILE: "image-file",
  IMAGE_UPSCALE: "image-upscale",
  IMAGE_UNITS: "image-units",
  IMAGE_MAX_WIDTH: "image-max-width"
};

export const BLOCK_DRAFT_INPUT_IDS = [
  DOM_ID.BLOCK_CONTENT,
  DOM_ID.HEADING_LEVEL,
  DOM_ID.HEADING_COLOR,
  DOM_ID.PARAGRAPH_HIGHLIGHT,
  DOM_ID.IMAGE_UPSCALE,
  DOM_ID.IMAGE_UNITS,
  DOM_ID.IMAGE_MAX_WIDTH
];

export const IMAGE_MAX_SIZE_BYTES = 300 * 1024;
export const IMAGE_ALLOWED_TYPES = ["image/png", "image/jpeg", "image/gif"];

export const DEFAULT_NEW_BLOCK_TYPE = BLOCK_TYPES.paragraph;
