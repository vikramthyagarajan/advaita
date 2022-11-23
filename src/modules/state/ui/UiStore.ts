import { getInitialUiState, UiState, Widget } from "./UiState";

let _state: UiState;
export default class UiStore {
  static initialize() {
    _state = getInitialUiState();
  }

  private static get state() {
    if (!_state) this.initialize();
    return _state!;
  }

  public static get widget() {
    return this.state.widget;
  }

  public static set widget(widget: Widget) {
    this.state.widget = widget;
  }
}
