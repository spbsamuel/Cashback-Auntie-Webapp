import {createSelector} from 'reselect'
import expenseHelpers from 'selectors/expense_selectors'
import {CIMB_VISA_SIGNATURE} from 'modules/BankUUID'

export const cardUserCardId = expenseHelpers.cardUserCardId(CIMB_VISA_SIGNATURE);

const cardExpenses = expenseHelpers.cardExpenses(cardUserCardId);

export const totalCardExpenditure = expenseHelpers.totalCardExpenditure(cardExpenses);

const numExpensesAbove30 = createSelector(
  cardExpenses,
  (expenses) =>
    expenses.reduce((numValid, expense) => expense['amount'] >= 30 ? numValid + 1 : numValid, 0)
);

const cashbackAlgo = (expenses, totalExpense, expensesAbove30) => {
  const ENUF_ABV_30 = expensesAbove30 >= 8;
  const HIT_MIN_SPENT = totalExpense >= 500;
  const MAX_LTD_CBK = 60;
  let accumLtdCbk = 0;
  return expenses
    .sort((expA, expB) => new Date(expB['dateOfPurchase']) - new Date(expA['dateOfPurchase']))
    .map(expense => {
      let cashback = expense['amount'] * 0.002;
      const validCategory = expense['cardCategory'] === 'DINING' || (expense['cardCategory'] === 'ONLINE' && expense['currency'] !== 'SGD');
      if (ENUF_ABV_30 && accumLtdCbk <= MAX_LTD_CBK && HIT_MIN_SPENT && validCategory) {
        cashback = expense['amount'] * 0.1;
        accumLtdCbk += cashback;
        cashback = accumLtdCbk <= MAX_LTD_CBK ? cashback : cashback - (accumLtdCbk - MAX_LTD_CBK);
        cashback = cashback < (expense['amount'] * 0.002) ? (expense['amount'] * 0.002) : cashback;
      }
      return {...expense, cashback}
    })
};

export const calculatedCashback = createSelector(
  cardExpenses,
  totalCardExpenditure,
  numExpensesAbove30,
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
      const expensesAbove30 = numExpensesAbove30(newExpenses)(state);
      const expenseCashback = cashbackAlgo(newExpenses, totalExpense, expensesAbove30);
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


// const test = {
//   "saved": true,
//   "amount": 400,
//   "notes": "",
//   "description": "",
//   "attachment": "",
//   "category": "DINING",
//   "currency": "SGD",
//   "cardCategory": "DINING",
//   "card": "90b4dba4-84e1-45df-b98a-4962b52d4e21",
//   "createdAt": "2017-03-26T12:46:01.393Z",
//   "updatedAt": "2017-03-26T12:46:01.393Z",
//   "uuid": "6bc7f8ac-7d49-45be-8a91-ea45a360cbf3",
//   "cashback": 0.064
// };


// export const collateExpenses = state => state.entities.expenses;
//
// const iterableExpenses = createSelector(
//   collateExpenses,
//   (expenses) =>
//     Object
//       .keys(expenses)
//       .map((key) => ({...expenses[key], uuid: key}))
// );

// export const cimbInfo = createSelector(
//   iterableExpenses,
//   cimbCardInfo,
//   (expenses, cimbCard) =>
//     expenses.reduce(extractCimbExpense(cimbCard['userCardId']), {...cimbCard['card']})
// );

// const cimbExpenses = createSelector(
//   cimbInfo,
//   collateExpenses,
//   (card, expenses) =>
//     card['expenseIds']
//       .map(id => ({...expenses[id], uuid: id}))
// );
