import {createSelector} from 'reselect'
import expenseHelpers from 'selectors/expense_selectors'
import {OCBC_365} from 'modules/BankUUID'

export const cardUserCardId = expenseHelpers.cardUserCardId(OCBC_365);

const cardExpenses = expenseHelpers.cardExpenses(cardUserCardId);

export const totalCardExpenditure = expenseHelpers.totalCardExpenditure(cardExpenses);

export const totalQualifyingCardExpenditure = createSelector(
  cardExpenses,
  (expenses) =>
    expenses.reduce((sum, expense) => expense.amount + sum, 0)
);

const derivePotentialFullCashback = (expense) => {
  const categories = {
    ONLINE: 0.03,
    GROCERIES: 0.05,
    TELECOMMS: 0.03,
    GENERAL: 0.003,
    EXCLUDED: 0.003,
  };
  if (expense['cardCategory'] === 'DINING') {
    let cashback = 0.03;
    if (expense['currency'] === 'SGD') {
      //TODO: Change to purchased date when date picker is up lol
      const day = (new Date(expense['createdAt'])).getDay();
      if (day === 6 || day === 0) {
        cashback = 0.06;
      }
    }
    return cashback
  } else {
    return categories[expense['cardCategory']] || 0.003
  }
};

const cashbackAlgo = (expenses, totalQualifyingExpense) => {
  const HIT_MIN_SPENT = totalQualifyingExpense >= 600;
  const MAX_LTD_CBK = 80;
  let accumLtdCbk = 0;
  return expenses
    .sort((expA, expB) => new Date(expB['dateOfPurchase']) - new Date(expA['dateOfPurchase']))
    .map(expense => {
      let cashback = expense['amount'] * 0.003;
      if (HIT_MIN_SPENT) {
        cashback = expense['amount'] * derivePotentialFullCashback(expense);
      }
      if (accumLtdCbk < MAX_LTD_CBK) {
        accumLtdCbk += cashback;
        cashback = accumLtdCbk <= MAX_LTD_CBK ? cashback : cashback - (accumLtdCbk - MAX_LTD_CBK);
      }
      return {...expense, cashback}
    })
};

export const calculatedCashback = createSelector(
  cardExpenses,
  totalQualifyingCardExpenditure,
  cashbackAlgo
);

export const totalCashback = expenseHelpers.totalCashback(calculatedCashback);

export const hashExpensesWithCashback = expenseHelpers.hashExpensesWithCashback(calculatedCashback);

export const cashbackCalculator = state => {
  const expenses = cardExpenses(state);
  return (
    expense => {
      const {uuid} = expense;
      const newExpenses = [...expenses, expense];
      const totalQualifyingCardExpenditure = newExpenses.reduce((sum, expense) => expense.amount + sum, 0);
      const expenseCashback = cashbackAlgo(newExpenses, totalQualifyingCardExpenditure);
      return (
        {
          info: expenseCashback.find(expense => expense['uuid'] === uuid),
          newTotalCashback: expenseHelpers.sumCashback(expenseCashback),
          totalCashback: totalCashback(state)
        }
      )
    }
  )
};

//
// export const totalCashback = createSelector(
//   calculatedCashback,
//   expensesWithCashback => expensesWithCashback.reduce((sum, expense) => expense.cashback + sum, 0)
// );
//
// export const hashExpensesWithCashback = createSelector(
//   calculatedCashback,
//   (expenses) => expenses.reduce((expenseHash, expense) => ({...expenseHash, [expense['uuid']]: expense}), {})
// );

// const ocbc365CardInfo = state => state.entities.cards[OCBC_365];
//
// const extractOcbc365Expense = (ocbc365Info, expense) => {
//   if (expense['card'] === OCBC_365) {
//     let cardExpenses = ocbc365Info['expenseIds'] || [];
//     let newCardExpenses = [...cardExpenses, expense['uuid']];
//     return {...ocbc365Info, expenseIds: newCardExpenses}
//   }
//   return ocbc365Info
// };
//
// export const collateExpenses = state => state.entities.expenses;
//
// const iterableExpenses = createSelector(
//   collateExpenses,
//   (expenses) =>
//     Object
//       .keys(expenses)
//       .map((key) => ({...expenses[key], uuid: key}))
// );
//
// export const ocbc365Info = createSelector(
//   iterableExpenses,
//   ocbc365CardInfo,
//   (expenses, ocbc365Card) => {
//     return expenses.reduce(extractOcbc365Expense, {...ocbc365Card})
//   }
// );
//
// const ocbc365Expenses = createSelector(
//   ocbc365Info,
//   collateExpenses,
//   (card, expenses) => {
//     return card['expenseIds'].map(id => ({...expenses[id], uuid: id}))
//   }
// );
//
// export const totalCardExpenditure = createSelector(
//   ocbc365Expenses,
//   (expenses) =>
//     expenses.reduce((sum, expense) => expense.amount + sum, 0)
// );
