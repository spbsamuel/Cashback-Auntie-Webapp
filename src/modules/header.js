// ------------------------------------
// Constants
// ------------------------------------
export const COUNTRY_SELECTED = 'COUNTRY_SELECTED';

// ------------------------------------
// Actions
// ------------------------------------
export function selectCountry (country) {
  return {
    type: COUNTRY_SELECTED,
    country: country
  };
}

export const actions = {
  selectCountry
};
// ------------------------------------
// Action Handlers
// ------------------------------------

const ACTION_HANDLERS = {
  [COUNTRY_SELECTED]: (state, action) => action.country
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = 'international';
export default function headerReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
