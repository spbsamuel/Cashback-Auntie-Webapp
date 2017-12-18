import {createSelector} from 'reselect'
import {
  totalCashback as standChartTotalCashback,
  calculatedCashback as standChartCalculatedCashback
} from './cards/standchart_singpost_cashback'
import {
  totalCashback as cimbTotalCashback,
  calculatedCashback as cimbCalculatedCashback
} from './cards/cimb_visa_signature_cashback'
import {
  totalCashback as dbsTotalCashback,
  calculatedCashback as dbsCalculatedCashback
} from './cards/dbs_visa_debit_cashback'
import {
  totalCashback as ocbc365TotalCashback,
  calculatedCashback as ocbc365CalculatedCashback
} from './cards/ocbc_365_cashback'
import {
  totalCashback as citibankSmrtTotalCashback,
  calculatedCashback as citibankSmrtCalculatedCashback
} from './cards/citibanksmrt_cashback'
import {getUserCards} from './user_cards'

export const totalCashback = createSelector(
  standChartTotalCashback,
  cimbTotalCashback,
  dbsTotalCashback,
  ocbc365TotalCashback,
  citibankSmrtTotalCashback,
  (...cashbackAmounts) => {
    console.log(3)
    return cashbackAmounts.reduce((a, b) => a + b, 0)
  }
);

export const concatExpenses = createSelector(
  standChartCalculatedCashback,
  cimbCalculatedCashback,
  dbsCalculatedCashback,
  ocbc365CalculatedCashback,
  citibankSmrtCalculatedCashback,
  (...expenses) => expenses.reduce((a, b) => a.concat(b), [])
);

export const collateExpenses = state => state.entities.expenses;
export const collateCards = state => state.entities.cards;
export const collateUserCards = state => state.entities.userCards;
export const collateCategories = (state, categories) => categories;

export const iterableExpenses = createSelector(
  collateExpenses,
  (expenses) =>
    Object
      .keys(expenses)
      .map((key) => ({...expenses[key], uuid: key}))
);

export const totalExpenditure = createSelector(
  collateExpenses,
  (expenses) =>
    Object
      .keys(expenses)
      .reduce((sum, key) => expenses[key].amount + sum, 0)
);

const userCardKeyHash = userCards => Object
  .keys(userCards)
  .reduce((idHash,id) => ({...idHash, [id]:[]}) ,{});

export const groupByCard = createSelector(
  iterableExpenses,
  state => state.entities.userCards,
  (expenses, userCards) => {
    console.log(1);
    return expenses.reduce(expensesToCards, userCardKeyHash(userCards))
  }
);

export const groupByCategory = createSelector(
  iterableExpenses,
  collateCategories,
  (expenses, categories) =>
    expenses.reduce(expensesToCategories, {...categories})
);


const expensesToCards = (keyHash, expense) => {
  let userCardId = expense['userCardId'] || 'OTHERS';
  keyHash[userCardId] = keyHash[userCardId] || [];
  return {...keyHash, [userCardId]: [...keyHash[userCardId], expense]}
};

const categories = {
  DINING: 'Dining',
  ONLINE: 'Online Purchases',
  GENERAL: 'General',
  ENTERTAINMENT: 'Entertainment',
  GROCERIES: 'Groceries',
  BILLS: 'Bills'
};

export const expensesByCategories = createSelector(
  concatExpenses,
  expenses => {
    let initialHash = Object.keys(categories).reduce((catHash, cat) => ({...catHash, [cat]: []}), {});
    return expenses.reduce((expenseHash, expense) => {
      const categoryExpense = expenseHash[expense['category']] || [];
      const newcategoryExpense = [...categoryExpense, expense];
      return {...expenseHash, [expense['category']]: newcategoryExpense}
    }, initialHash)
  }
);

const expensesToCategories = (expensesByCat, expense) => {
  let cat = expense['category'] || 'OTHERS';
  let newCatExpenses = [expense['uuid']];
  let category = expensesByCat[cat];
  if (category) {
    let catExpenses = expensesByCat[cat]['expenseIds'] || [];
    newCatExpenses = [...catExpenses, expense['uuid']];
  }
  return {...expensesByCat, [cat]: {...category, expenseIds: newCatExpenses}}
};
