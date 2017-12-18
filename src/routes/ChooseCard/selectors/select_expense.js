import {createSelector} from 'reselect'
import isUUID from 'validator/lib/isUUID'

export const getExpense = createSelector(
  (state, props) => state.entities.expenses,
  (state, props) => props.params.uuid,
  (expenses, uuid) => {
    if (expenses[uuid]) {
      return {...expenses[uuid], uuid};
    }
    else if (isUUID(uuid)) {
      return {
        amount: 0.0,
        uuid
      }
    }
    return {
      error: true
    };
  }
);

export default getExpense
