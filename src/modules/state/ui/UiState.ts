export type Widget = "pointer" | "textbox" | "image" | "video";
export interface UiState {
  widget: Widget;
  selected: string | null;
}

export const getInitialUiState = (): UiState => {
  return {
    widget: "pointer",
    selected: null,
  };
};

interface UiInitialized {
  type: "uiInitialized";
}

interface WidgetUpdated {
  type: "widgetUpdated";
  widget: Widget;
}

interface NodeSelected {
  type: "nodeSelected";
  id: string;
}

export type UiActions = UiInitialized | WidgetUpdated | NodeSelected;
