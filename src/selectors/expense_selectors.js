import {createSelector} from 'reselect'

const getExpenses = createSelector(
  state => state,
  ({entities: {expenses}}) => expenses
);

const mapExpenseToArray = expenses =>
  Object
    .keys(expenses)
    .map(key => ({...expenses[key]}));

const expensesArray = createSelector(
  getExpenses,
  mapExpenseToArray
);

const findUserCardId = (userCards, cardUUID)=> Object
  .keys(userCards)
  .find(id => userCards[id]['cardId'] === cardUUID);

const matchCardId = userCardId => expense => expense['userCardId'] === userCardId;

const cardUserCardId = cardUUID => createSelector(
  state => state,
  ({entities: {userCards}}) => {
    console.log(2);
    const hehe = findUserCardId(userCards, cardUUID);
    return(hehe);}
);

const cardExpenses = cardUserCardId => createSelector(
  expensesArray,
  cardUserCardId,
  (expenses, userCardId) => expenses.filter(matchCardId(userCardId))
);

const sumByAttribute = attr => expenses => expenses.reduce((sum, expense) => expense[attr] + sum, 0);

const sumExpenditure = sumByAttribute('amount');

const sumCashback = sumByAttribute('cashback');

const totalCardExpenditure = cardExpenses => createSelector(
  cardExpenses,
  sumExpenditure
);

const totalCashback = calculatedCashback => createSelector(
  calculatedCashback,
  sumCashback
);

const hashExpensesWithCashback = calculatedCashback => createSelector(
  calculatedCashback,
  (expenses) => expenses.reduce((expenseHash, expense) => ({...expenseHash, [expense['uuid']]: expense}), {})
);

const expenseHelpers = {
  cardUserCardId,
  cardExpenses,
  totalCardExpenditure,
  totalCashback,
  hashExpensesWithCashback,
  sumExpenditure,
  sumCashback
};

export default expenseHelpers
