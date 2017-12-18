import {createSelector} from 'reselect'

export const collateExpenses = state => state.entities.expenses;

export const totalExpenditure = createSelector(
  collateExpenses,
  (expenses) => Object.keys(expenses).reduce((sum, key) => expenses[key].amount + sum, 0)
);

export const totalCashback = createSelector(
  totalExpenditure,
  (expenditure) => expenditure * 0.05
);
