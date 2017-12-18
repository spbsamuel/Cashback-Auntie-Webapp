import {createSelector} from 'reselect'

export const collateExpenses = state => state.entities.cards;

const iterableCategories = createSelector(
  collateExpenses,
  (expenses) =>
    Object
      .keys(categories)
      .map((key) => categories[key])
);

export const applicableCategories = createSelector(
  (state, props) => state.entities.expenses,
  (state, props) => state.entities.userCards,
  (state, props) => state.entities.cards,
  (state, props) => props.params.uuid,
  (expenses, userCards, cards, uuid) => {
    const expense = expenses[uuid];
    const userCard = userCards[expense['userCardId']];
    const card = cards[userCard['cardId']];
    return card.categories
  }
);

export const currentCategory = createSelector(
  (state, props) => state.entities.expenses,
  (state, props) => props.params.uuid,
  applicableCategories,
  (expenses, uuid, categories) => {
    const expense = expenses[uuid];
    if (!expense['category'] || !expense['cardCategory']) {
      return ''
    }
    return categories[expense['category']][expense['cardCategory']]['name']
  }
);


