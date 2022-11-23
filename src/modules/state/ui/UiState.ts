export type Widget = "pointer" | "textbox" | "image" | "video";
export interface UiState {
  widget: Widget;
  selected: null;
}

export const getInitialUiState = (): UiState => {
  return {
    widget: "pointer",
    selected: null,
  };
};
