export interface Identifiable {
  id: string; // or number, depending on your use case
}

// Row state structure with the id constraint
export interface RowState<T extends Identifiable> {
  original: T; // The original data
  current: T;  // The current state after edits
}

// Context state map
export type RowStateMap<T extends Identifiable> = {
  [id: string]: RowState<T>;
};

// Actions for state updates
export type RowStateAction<T extends Identifiable> =
  | { type: "SET_ORIGINAL_STATE"; id: string; data: T }
  | { type: "UPDATE_ROW_STATE"; id: string; data: Partial<T> }
  | { type: "RESET_ROW_STATE"; id: string };

// Reducer function
export type RowStateReducer<T extends Identifiable> = (
  state: RowStateMap<T>,
  action: RowStateAction<T>
) => RowStateMap<T>;
