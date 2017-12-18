import React from 'react'
import classes from './AddExpenseView.scss'
import cx from 'classnames'
import '../../../styles/core.scss';
import range from 'lodash/range'
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover/Popover';
import {Menu, MenuItem} from 'material-ui/Menu';
import currencyFormatter from 'currency-formatter'

const timestamp = (time) => time ? (new Date(time)).toISOString():(new Date()).toISOString();

class AddExpenseView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expenseAmt: String(props.expense.amount),
      currency: props.expense.currency || 'SGD'
    };
  }

  handleNumeric = (num) => {
    let newExpenseAmt = this.state.expenseAmt + num;
    if (newExpenseAmt.length > 1 && newExpenseAmt[0] === '0' && newExpenseAmt.indexOf('.') < 0) {
      newExpenseAmt = newExpenseAmt.slice(1);
    }
    this.setState({expenseAmt: newExpenseAmt})
  };
  handleBackspace = () => {
    const newExpenseAmt = this.state.expenseAmt.slice(0, -1);
    this.setState({expenseAmt: newExpenseAmt})
  };
  handleSubmit = () => {
    const {uuid, updateExpense, history, expense} = this.props;
    const path = '/add_expense/' + uuid + (expense.card ? '/details':'/card');
    const {expenseAmt, currency} = this.state;
    const createdAt = expense.createdAt || timestamp();
    const dateOfPurchase = expense.dateOfPurchase || timestamp();
    if (parseFloat(expenseAmt) > 0) {
      updateExpense(uuid, {amount: parseFloat(expenseAmt), currency, createdAt, dateOfPurchase});
      history.push(path);
    }
  };
  handlePeriod = () => {
    const {expenseAmt} = this.state;
    if (expenseAmt.indexOf('.') == -1 && expenseAmt.length > 0)
      this.setState({expenseAmt: expenseAmt + '.'});
  };
  handleCurrencyChange = currency => {
    this.setState({currency})
  };

  render() {
    return (
      <div className={classes.container}>
        <div className="row middle-xs">
          <div className="col-xs-8">
            <NumericDisplay currency={this.state.currency} expenseAmt={this.state.expenseAmt}/>
          </div>
          <div className="col-xs-4 text-center">
            <BackspaceBtn symbol={'Del'} handleBackspace={this.handleBackspace}/>
          </div>
        </div>
        <NumericKeypad
          handleNumeric={this.handleNumeric}
          handleSubmit={this.handleSubmit}
          handlePeriod={this.handlePeriod}
        />
        <ChangeCurrency currency={this.state.currency} handleCurrencyChange={this.handleCurrencyChange}/>
      </div>
    )
  }
}


const NumericDisplay = ({currency, expenseAmt}) => {
  const currencySymbol = currencyFormatter.findCurrency(currency)['symbol'];
  const prefix = currencySymbol === '$' && currency !== 'SGD' ? currency : '';
  return (
    <div className={classes.input_panel}>
      {prefix + currencySymbol} {expenseAmt}
    </div>
  )
};

const NumericKeypad = ({handleNumeric, handlePeriod, handleSubmit}) =>
  <div className="row middle-xs center-xs">
    {range(1, 10).map((num) => <KeypadBtn key={num} symbol={num} onClick={handleNumeric}/>)}
    <KeypadBtn symbol={'.'} onClick={handlePeriod}/>
    <KeypadBtn symbol={0} onClick={handleNumeric}/>
    <SubmitExpenseBtn handleSubmit={handleSubmit}/>
  </div>;

const KeypadBtn = ({symbol, onClick}) =>
  <div className="col-xs-4">
    <button className={classes.keypad_btn} onClick={onClick.bind(this, symbol)}>
      {symbol}
    </button>
  </div>;

const SubmitExpenseBtn = ({handleSubmit}) =>
  <div className="col-xs-4">
    <button onClick={handleSubmit} className={classes.submit_btn}>
      <i className="material-icons">done</i>
    </button>
  </div>;

const BackspaceBtn = ({handleBackspace}) =>
  <button className={(classes.backspace_btn)} onClick={handleBackspace}>
    <i className="material-icons">backspace</i>
  </button>;

class ChangeCurrency extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };
  handleCurrencySelected = (currency) => {
    this.props.handleCurrencyChange(currency);
    this.setState({
      open: false,
    });
  };

  render() {
    const {currency, handleCurrencyChange} = this.props;
    return (
      <div className="row middle-xs center-xs">
        <div className={cx("col-xs-8", classes.currency_btn)}>
          <RaisedButton
            onTouchTap={this.handleTouchTap}
            label="Change Currency"
            fullWidth={true}
            icon={<i className="material-icons">compare_arrows</i>}
          />
        </div>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: "middle", vertical: "top"}}
          targetOrigin={{horizontal: "middle", vertical: "bottom"}}
          onRequestClose={this.handleRequestClose}
        >
          <Menu maxHeight={400}>
            {
              ['SGD', 'USD', 'MYR', 'EUR', 'JPY', 'AUD', 'GBP', 'CNY', 'HKD']
                .map(ccy =>
                  <MenuItem key={ccy} primaryText={ccy} insetChildren={true} checked={ccy === currency}
                            onTouchTap={this.handleCurrencySelected.bind(this, ccy)}/>
                )
            }
          </Menu>
        </Popover>
      </div>
    )
  }
}


export default AddExpenseView
