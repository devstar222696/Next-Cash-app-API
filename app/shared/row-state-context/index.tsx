import React, { createContext, useContext, useReducer } from "react";
import { Identifiable, RowStateAction, RowStateMap, RowStateReducer } from "./types";

// Generic row state reducer
const rowStateReducer = <T extends Identifiable>(
  state: RowStateMap<T>,
  action: RowStateAction<T>
): RowStateMap<T> => {
  switch (action.type) {
    case "SET_ORIGINAL_STATE":
      return {
        ...state,
        [action.id]: {
          original: action.data,
          current: action.data, // Initialize current with original
        },
      };
    case "UPDATE_ROW_STATE":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          current: {
            ...state[action.id]?.current,
            ...action.data, // Merge new data into the current state
          },
        },
      };
    case "RESET_ROW_STATE":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          current: state[action.id]?.original, // Reset current to original
        },
      };
    default:
      return state;
  }
};

// Generic context types
interface RowStateContextType<T extends Identifiable> {
  state: RowStateMap<T>;
  dispatch: React.Dispatch<RowStateAction<T>>;
}

// Create contexts with generics
export const RowStateContext = createContext<RowStateContextType<any> | null>(
  null
);

// Provider component
export const RowStateProvider = <T extends Identifiable>({
  children,
}: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer<RowStateReducer<T>>(rowStateReducer, {});

  return (
    <RowStateContext.Provider value={{ state, dispatch }}>
      {children}
    </RowStateContext.Provider>
  );
};

// Custom hooks
export const useRowState = <T extends Identifiable>(): RowStateMap<T> => {
  const context = useContext(RowStateContext);
  if (!context) {
    throw new Error("useRowState must be used within a RowStateProvider");
  }
  return context.state;
};

export const useRowDispatch = <T extends Identifiable>(): React.Dispatch<RowStateAction<T>> => {
  const context = useContext(RowStateContext);
  if (!context) {
    throw new Error("useRowDispatch must be used within a RowStateProvider");
  }
  return context.dispatch;
};

// Helper to initialize a row's state
export const setInitialRowState = <T extends Identifiable>(dispatch: React.Dispatch<RowStateAction<T>>, id: string, data: T) => {
  dispatch({ type: "SET_ORIGINAL_STATE", id, data });
};

// Helper to update a row's state
export const updateRowState = <T extends Identifiable>(dispatch: React.Dispatch<RowStateAction<T>>, id: string, data: T) => {
  dispatch({ type: "UPDATE_ROW_STATE", id, data });
};

// Helper to reset a row's state
export const resetRowState = <T extends Identifiable>(dispatch: React.Dispatch<RowStateAction<T>>, id: string) => {
  dispatch({ type: "RESET_ROW_STATE", id });
};
