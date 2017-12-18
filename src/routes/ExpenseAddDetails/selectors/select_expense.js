import {createSelector} from 'reselect'
import {hashExpensesWithCashback as standChart} from 'selectors/cards/standchart_singpost_cashback'
import {hashExpensesWithCashback as cimb} from 'selectors/cards/cimb_visa_signature_cashback'
import {hashExpensesWithCashback as dbs} from 'selectors/cards/dbs_visa_debit_cashback'
import {hashExpensesWithCashback as ocbc365} from 'selectors/cards/ocbc_365_cashback'
import {hashExpensesWithCashback as citibank} from 'selectors/cards/citibanksmrt_cashback'
import {CIMB_VISA_SIGNATURE, STANDCHART_SINGPOST, DBS_VISA_DEBIT, OCBC_365, CITIBANK_SMRT} from 'modules/BankUUID'
import isUUID from 'validator/lib/isUUID'
import _get from 'lodash/get'

export const getExpense = createSelector(
  (state, props) => state.entities.expenses,
  (state, props) => props.params.uuid,
  (expenses, uuid) => {
    if (expenses[uuid]) {
      return {...expenses[uuid], uuid};
    }
    else if (isUUID(uuid)) {
      return {
        amount: 0.0,
        uuid
      }
    }
    return {
      error: true
    };
  }
);

const expenseByUUID = (state, props) => state.entities.expenses[props.params.uuid] || {};

const cardIdByExpense = createSelector(
  expenseByUUID,
  state => state.entities.userCards,
  (expense, userCards) => userCards[expense['userCardId']]['cardId']
);

const cashbackSelectorByCard = createSelector(
  state => state,
  cardIdByExpense,
  (state, cardId) => {
    const cardHandlers = {
      [CIMB_VISA_SIGNATURE]: cimb,
      [STANDCHART_SINGPOST]: standChart,
      [DBS_VISA_DEBIT]: dbs,
      [OCBC_365]: ocbc365,
      [CITIBANK_SMRT]: citibank
    };
    return cardHandlers[cardId](state)
  }
);

export const cashbackByExpense = createSelector(
  (state, props) => props.params.uuid || {},
  cashbackSelectorByCard,
  (expenseId, cashbackByCard) => _get(cashbackByCard[expenseId], 'cashback', 0)
);

export default getExpense
