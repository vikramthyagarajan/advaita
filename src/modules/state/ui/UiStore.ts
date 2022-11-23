import { Dispatch, useReducer } from "react";
import { getInitialUiState, UiActions, UiState, Widget } from "./UiState";

const UiReducer = (state: UiState, action: UiActions) => {
  switch (action.type) {
    case "widgetUpdated":
      state = { ...state, widget: action.widget };
      break;
  }
  return state;
};

let _dispatch: Dispatch<UiActions> | null = null;
export const useUiStore = () => {
  const [state, dispatch] = useReducer(UiReducer, getInitialUiState());
  _dispatch = dispatch;
  return state;
};

export const getUiDispatch = () => {
  if (!_dispatch) throw new Error("Ui Dispatch not found");
  return _dispatch!;
};
