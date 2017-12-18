import {createSelector} from 'reselect'
import {CIMB_VISA_SIGNATURE, STANDCHART_SINGPOST, DBS_VISA_DEBIT, OCBC_365, CITIBANK_SMRT} from 'modules/BankUUID'
import {cashbackCalculator as standChartCashbackCalculator}from 'selectors/cards/standchart_singpost_cashback'
import {cashbackCalculator as cimbCashbackCalculator}from 'selectors/cards/cimb_visa_signature_cashback'
import {cashbackCalculator as dbsCashbackCalculator}from 'selectors/cards/dbs_visa_debit_cashback'
import {cashbackCalculator as ocbc365CashbackCalculator}from 'selectors/cards/ocbc_365_cashback'
import {cashbackCalculator as citibankSmrtCashbackCalculator}from 'selectors/cards/citibanksmrt_cashback'

export const catList = ['DINING', 'ONLINE', 'GENERAL', 'ENTERTAINMENT', 'GROCERIES', 'BILLS'];

export const collatedCategories = createSelector(
  state => Object.keys(state.entities.cards).map(key => state.entities.cards[key]),
  cards => catList
    .reduce((collated, cat) => {
      collated[cat] = cards
        .reduce((group, card) => {
          group[card['card_id']] = card['categories'][cat];
          return group
        }, {});
      return collated
    }, {})
);

export const cashbackCalculators = state => ({
  [STANDCHART_SINGPOST]: standChartCashbackCalculator(state),
  [CIMB_VISA_SIGNATURE]: cimbCashbackCalculator(state),
  [DBS_VISA_DEBIT]: dbsCashbackCalculator(state),
  [OCBC_365]: ocbc365CashbackCalculator(state),
  [CITIBANK_SMRT]: citibankSmrtCashbackCalculator(state)
});

export const collatedCalculator = state => {
  const categories = collatedCategories(state);
  const calculators = cashbackCalculators(state);
  return (
    (parentCategory, amount = 100) => {
      const expense = {
        amount,
        category: parentCategory,
        currency: 'SGD',
        createdAt: (new Date()).toISOString(),
        uuid: 'f8d2946a-162b-4424-b700-1e10ae59bd3d'
      };
      const categoryGroup = categories[parentCategory];
      return (
        Object.keys(categoryGroup)
          .reduce((results, cardId) =>
            Object.keys(categoryGroup[cardId])
              .map(cardCategory => {
                const catInfo = categoryGroup[cardId][cardCategory];
                const cardExpense = {...expense, card: cardId, cardCategory};
                return ({...calculators[cardId](cardExpense), details: catInfo});
              })
              .concat(results), [])
      )
    }
  )
};
