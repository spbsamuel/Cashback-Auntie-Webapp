import React from 'react'
import classes from './RecommendCardListView.scss'
import cx from 'classnames'
import {Link} from 'react-router'
import '../../../styles/core.scss';
import TextField from 'material-ui/TextField';

const toDecimal = (num) => parseFloat(Math.round(num * 100) / 100).toFixed(2);

export default class RecommendCardListView extends React.Component {
  constructor(props) {
    super(props);
    const {category} = props.params;
    const amount = 100;
    const calculatedCashbacks = props.collatedCalculator(category, amount);
    this.state = {
      calculatedCashbacks,
      amount
    };
  }

  updateCashback = event => {
    const amount = event.target.value;
    const calculatedCashbacks = this.props.collatedCalculator(this.props.params['category'], parseFloat(amount) || 0);
    this.setState({amount, calculatedCashbacks});
  };

  render() {
    const {calculatedCashbacks} = this.state;
    return (
      <div className={classes.container}>
        <div className={classes.amount_field}>
          <TextField
            value={this.state.amount}
            onChange={this.updateCashback}
            floatingLabelText="Amount"
            floatingLabelFixed={true}
            fullWidth={true}
          />
        </div>
        {
          calculatedCashbacks
            .sort((expA, expB) =>
            (expB['newTotalCashback'] - expB['totalCashback']) -
            (expA['newTotalCashback'] - expA['totalCashback']))
            .map(cashback => <CalculatedCashback {...cashback} cards={this.props.cards}/>)
        }
      </div>
    )
  }
}

const CalculatedCashback = ({details, info, totalCashback, newTotalCashback, cards}) => {
  return (
    <div className={classes.calculated_cashback}>
      <div className="row middle-xs">
        <div className="col-xs-3">
          <img src={cards[info['card']]['image']} style={{width: '100%'}}/>
        </div>
        <div className={cx("col-xs-9", classes.details)}>
          <p>
            <strong>
              {details['name']}
            </strong>
            <br/>
            <em>
              {details['terms']}
            </em>
          </p>
          <p>
            Total Cashback: {toDecimal(newTotalCashback)} (+{toDecimal(newTotalCashback - totalCashback)})
          </p>
          <p>
            Expense Cashback: {toDecimal(info['cashback'])}
          </p>
        </div>
      </div>
    </div>
  )
};
