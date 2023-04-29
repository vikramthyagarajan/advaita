export type Widget = "pointer" | "textbox" | "image" | "video";

export type User = {
  name: string;
  avatar: string;
  uuid: string;
};

export interface UiState {
  widget: Widget;
  selectedNode: string | null;
  selectedChild: string | null;
  urlPreview: string | null;
  user: User | null;
}

export const getInitialUiState = (): UiState => {
  return {
    widget: "pointer",
    selectedNode: null,
    selectedChild: null,
    urlPreview: null,
    user: null,
  };
};

interface UserUpdated {
  type: "userUpdated";
  user: User;
}

interface UiInitialized {
  type: "uiInitialized";
}

interface WidgetUpdated {
  type: "widgetUpdated";
  widget: Widget;
}

interface NodeSelected {
  type: "nodeSelected";
  id: string | null;
  childId?: string;
}

interface UrlPreviewUpdated {
  type: "urlPreviewUpdated";
  url: string;
}

export type UiActions =
  | UiInitialized
  | WidgetUpdated
  | NodeSelected
  | UserUpdated
  | UrlPreviewUpdated;
