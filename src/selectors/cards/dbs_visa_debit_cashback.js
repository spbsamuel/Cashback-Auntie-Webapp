import {createSelector} from 'reselect'
import expenseHelpers from 'selectors/expense_selectors'
import {DBS_VISA_DEBIT} from 'modules/BankUUID'

export const cardUserCardId = expenseHelpers.cardUserCardId(DBS_VISA_DEBIT);

const cardExpenses = expenseHelpers.cardExpenses(cardUserCardId);

export const totalCardExpenditure = expenseHelpers.totalCardExpenditure(cardExpenses);

const cashbackAlgo = (expenses) => {
  const MAX_LTD_CBK = 50;
  let accumLtdCbk = 0;
  return expenses
    .sort((expA, expB) => new Date(expB['dateOfPurchase']) - new Date(expA['dateOfPurchase']))
    .map(expense => {
      let cashback = 0;
      const ValidFor5pc = expense['cardCategory'] !== 'EXCLUDED' && expense['amount'] <= 100;
      if (ValidFor5pc) {
        cashback = expense['amount'] * 0.05;
      }
      accumLtdCbk += cashback;
      cashback = accumLtdCbk <= MAX_LTD_CBK ? cashback : cashback - (accumLtdCbk - MAX_LTD_CBK);
      return {...expense, cashback}
    })
};

export const calculatedCashback = createSelector(
  cardExpenses,
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
      const expenseCashback = cashbackAlgo(newExpenses);
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


// const dbsVisaDebitCardInfo = state => state.entities.cards[DBS_VISA_DEBIT];
// const extractDbsVisaDebitExpense = (dbsVisaDebitInfo, expense) => {
//   let cardId = expense['card'];
//   if (cardId === DBS_VISA_DEBIT) {
//     let cardExpenses = dbsVisaDebitInfo['expenseIds'] || [];
//     let newCardExpenses = [...cardExpenses, expense['uuid']];
//     return {...dbsVisaDebitInfo, expenseIds: newCardExpenses}
//   }
//   if (!dbsVisaDebitInfo['expenseIds']) {
//     return {...dbsVisaDebitInfo, expenseIds: []}
//   }
//   return dbsVisaDebitInfo
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

// export const dbsVisaDebitInfo = createSelector(
//   iterableExpenses,
//   dbsVisaDebitCardInfo,
//   (expenses, dbsVisaDebitCard) =>
//     expenses.reduce(extractDbsVisaDebitExpense, {...dbsVisaDebitCard})
// );
// const dbsVisaDebitExpenses = createSelector(
//   dbsVisaDebitInfo,
//   collateExpenses,
//   (card, expenses) =>
//     card['expenseIds']
//       .map(id => ({...expenses[id], uuid: id}))
// );
//
// export const totalCardExpenditure = createSelector(
//   dbsVisaDebitExpenses,
//   (expenses) =>
//     expenses.reduce((sum, expense) => expense.amount + sum, 0)
// );

//
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
