import {createSelector} from 'reselect'
import expenseHelpers from 'selectors/expense_selectors'
import {CITIBANK_SMRT} from 'modules/BankUUID'

export const cardUserCardId = expenseHelpers.cardUserCardId(CITIBANK_SMRT);

const cardExpenses = expenseHelpers.cardExpenses(cardUserCardId);

export const totalCardExpenditure = expenseHelpers.totalCardExpenditure(cardExpenses);

const totalQualifyingCardExpenditure = createSelector(
  cardExpenses,
  (expenses) =>
    expenses.reduce((sum, expense) => expense.amount + sum, 0)
);

const derivePotentialFullCashback = (expense) => {
  const categories = {
    ONLINE: 0.027,
    COFFEE: 0.047,
    DINING: 0.047,
    MOVIES: 0.047,
    TOYSNBOOKS: 0.047,
    TOWNCOUNCIL: 0.047,
    TELECOMMS: 0.007,
    INSURANCE: 0.007,
    NEWSPAPER: 0.007,
    HEALTHNBEAUTY: 0.017,
    PETS: 0.047,
    GROCERIES: 0.027,
    EZLINK: 0.007
  };
  if (expense['cardCategory'] === 'GROCERIES' && expense['amount'] >= 50) {
    return 0.047
  }
  else if (expense['cardCategory'] === 'EZLINK' && expense['amount'] >= 30) {
    return 0.017
  }
  return categories[expense['cardCategory']] || 0
};

const cashbackAlgo = (expenses, totalQualifyingExpense) => {
  const HIT_MIN_SPENT = totalQualifyingExpense >= 300;
  const MAX_LTD_CBK = 600;
  let accumLtdCbk = 0;
  return expenses
    .sort((expA, expB) => new Date(expB['dateOfPurchase']) - new Date(expA['dateOfPurchase']))
    .map(expense => {
      let cashback = expense['amount'] * derivePotentialFullCashback(expense);
      if (HIT_MIN_SPENT) {
        cashback += expense['amount'] * 0.003;
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


// const citibankSmrtCardInfo = state => state.entities.cards[CITIBANK_SMRT];
//
// const extractCitibankSmrtExpense = (citibankSmrtInfo, expense) => {
//   if (expense['card'] === CITIBANK_SMRT) {
//     let cardExpenses = citibankSmrtInfo['expenseIds'] || [];
//     let newCardExpenses = [...cardExpenses, expense['uuid']];
//     return {...citibankSmrtInfo, expenseIds: newCardExpenses}
//   }
//   return citibankSmrtInfo
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
// export const citibankSmrtInfo = createSelector(
//   iterableExpenses,
//   citibankSmrtCardInfo,
//   (expenses, citibankSmrtCard) => {
//     return expenses.reduce(extractCitibankSmrtExpense, {...citibankSmrtCard})
//   }
// );

// export const totalCitiBankCashback = createSelector(
//   calculatedCashback,
//   expensesWithCashback => expensesWithCashback.reduce((sum, expense) => expense.cashback + sum, 0)
// );
//
// export const hashExpensesWithCashback = createSelector(
//   calculatedCashback,
//   (expenses) => expenses.reduce((expenseHash, expense) => ({...expenseHash, [expense['uuid']]: expense}), {})
// );
