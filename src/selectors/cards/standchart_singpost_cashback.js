import {createSelector} from 'reselect'
import expenseHelpers from 'selectors/expense_selectors'
import {STANDCHART_SINGPOST} from 'modules/BankUUID'

export const cardUserCardId = expenseHelpers.cardUserCardId(STANDCHART_SINGPOST);

const cardExpenses = expenseHelpers.cardExpenses(cardUserCardId);

export const totalCardExpenditure = expenseHelpers.totalCardExpenditure(cardExpenses);

const cashbackAlgo = (expenses, totalExpense) => {
  const HIT_MIN_SPENT = totalExpense >= 600;
  const MAX_LTD_CBK = 60;
  let accumLtdCbk = 0;
  return expenses
    .sort((expA, expB) => new Date(expB['dateOfPurchase']) - new Date(expA['dateOfPurchase']))
    .map(expense => {
      let cashback = expense['amount'] * 0.002;
      const ValidFor7pc = 'ONLINE' === expense['cardCategory'] &&  HIT_MIN_SPENT;
      const ValidFor2pc = 'GROCERIES' === expense['cardCategory'] &&  HIT_MIN_SPENT;
      if (ValidFor7pc) {
        cashback = expense['amount'] * 0.07;
      }else if (ValidFor2pc){
        cashback = expense['amount'] * 0.02;
      }
      accumLtdCbk += cashback;
      cashback = accumLtdCbk <= MAX_LTD_CBK ? cashback : cashback - (accumLtdCbk - MAX_LTD_CBK);
      return {...expense, cashback}
    })
};

export const calculatedCashback = createSelector(
  cardExpenses,
  totalCardExpenditure,
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
      const totalExpense = expenseHelpers.sumExpenditure(newExpenses);
      const expenseCashback = cashbackAlgo(newExpenses, totalExpense);
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


// export const cashbackCalculator = state => expense => {
//   const {expenses} = state.entities;
//   const cardExpenses = Object
//     .keys(expenses)
//     .map(key => expenses[key])
//     .filter(ex => ex['card'] === STANDCHART_SINGPOST);
//   const newCardExpenses = [...cardExpenses, expense];
//   const totalCardExpenditure = newCardExpenses.reduce((sum, exp) => exp.amount + sum, 0);
//   const expenseCashback = cashbackAlgo(newCardExpenses, totalCardExpenditure);
//   return (
//     {
//       info: expenseCashback.filter(exp => exp['uuid'] === expense['uuid'])[0],
//       newTotalCashback: expenseCashback.reduce((sum, expense) => expense.cashback + sum, 0),
//       totalCashback: totalCashback(state)
//     }
//   )
// };

// export const totalCashback = createSelector(
//   calculatedCashback,
//   expensesWithCashback => expensesWithCashback.reduce((sum, expense) => expense.cashback + sum, 0)
// );
//
// export const hashExpensesWithCashback = createSelector(
//   calculatedCashback,
//   (expenses) => expenses.reduce((expenseHash, expense) => ({...expenseHash, [expense['uuid']]: expense}), {})
// );
//
// const stdchartSingPostCardInfo = state => state.entities.cards[STANDCHART_SINGPOST];
//
// const extractStdchartSingPostExpense = (stdchartSingPostInfo, expense) => {
//   let cardId = expense['card'];
//   if (cardId === STANDCHART_SINGPOST) {
//     let cardExpenses = stdchartSingPostInfo['expenseIds'] || [];
//     let newCardExpenses = [...cardExpenses, expense['uuid']];
//     return {...stdchartSingPostInfo, expenseIds: newCardExpenses}
//   }
//   return stdchartSingPostInfo
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
// export const stdchartSingPostInfo = createSelector(
//   iterableExpenses,
//   stdchartSingPostCardInfo,
//   (expenses, stdchartSingPostCard) =>
//     expenses.reduce(extractStdchartSingPostExpense, {...stdchartSingPostCard})
// );
//
// const stdchartSingPostExpenses = createSelector(
//   stdchartSingPostInfo,
//   collateExpenses,
//   (card, expenses) =>
//     card['expenseIds']
//       .map(id => ({...expenses[id], uuid: id}))
// );
//
// export const totalCardExpenditure = createSelector(
//   stdchartSingPostExpenses,
//   (expenses) =>
//     expenses.reduce((sum, expense) => expense.amount + sum, 0)
// );
