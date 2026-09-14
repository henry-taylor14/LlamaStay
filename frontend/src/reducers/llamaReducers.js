import { ACTION_TYPES } from '../actions/llama';

const initialState = {
  list: [],
};

export const llamaReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.FETCH_ALL:
      return {
        ...state,
        list: [...action.payload],
      };

    case ACTION_TYPES.CREATE:
      return {
        ...state,
        list: [...state.list, action.payload],
      };

    case ACTION_TYPES.UPDATE:
      return {
        ...state,
        list: state.list.map(l =>
          l.id === action.payload.id ? action.payload : l
        ),
      };
    case ACTION_TYPES.REMOVE:
      return {
        ...state,
        list: state.list.filter(l => l.id !== action.payload),
      };

    default:
      return state;
  }
};
