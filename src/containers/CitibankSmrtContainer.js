import {connect} from 'react-redux';
import CreditCardCashback from 'components/CashbackWrapper';
import {cardUserCardId, totalCardExpenditure, totalCashback, hashExpensesWithCashback, cashbackCalculator} from 'selectors/cards/citibanksmrt_cashback'
import {getUserCards}  from 'selectors/user_cards'

const mapActionCreators = {};

const mapStateToProps = (state) => {
  return ({
    expensesWithCashback: hashExpensesWithCashback(state),
    cardInfo: getUserCards(state)[cardUserCardId(state)],
    totalCardExpenditure: totalCardExpenditure(state),
    totalCashback: totalCashback(state)
  })
};

export default connect(mapStateToProps, mapActionCreators)(CreditCardCashback);
