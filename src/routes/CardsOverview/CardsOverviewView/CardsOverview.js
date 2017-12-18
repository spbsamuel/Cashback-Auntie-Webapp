import React from 'react'
import classes from './CardsOverview.scss'
import cx from 'classnames'
import {Link} from 'react-router'
import '../../../styles/core.scss';

class ChooseCardView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Saved Cards</h1>
        <div className={classes.cards_list}>
          {Object.keys(this.props.cards).map((key) =>
            <SelectCard key={key} card_img={this.props.cards[key].image}
                        card_id={key} uuid={this.props.uuid}
                        expense_id={this.props.uuid}
                        updateExpense={this.props.updateExpense}
                        push={this.props.history.push}/>)}
        </div>
        <Link to="/add_card">
          <div className={cx("row middle-xs center-xs", classes.add_card_btn)}>
            <div className="col-xs-3">
              <i className="material-icons">credit_card</i>
            </div>
            <div className="col-xs-6">
              <p>
                Add Card
              </p>
            </div>
            <div className="col-xs-3">
              <i className="material-icons">keyboard_arrow_right</i>
            </div>
          </div>
        </Link>
      </div>
    )
  }
}

const SelectCard = ({
  card_img,
  card_id,
  expense_id,
  updateExpense,
  push,
  uuid
}) => {
  const updateExpenseWithCard = () => {
    const path = '/add_expense/' + expense_id + '/details';
    updateExpense(uuid, {card: card_id});
    push(path);
  };
  return (
    <div className="row">
      <div className={cx("col-xs-4", classes.select_card)}>
        <Link onClick={updateExpenseWithCard}><img src={card_img}/></Link>
      </div>
      <div className="col-xs-8">

      </div>
    </div>
  )
};


const StatusCard = ({name, value, color}) =>
  <Link>
    <div className={cx(classes.status_card, 'row')} style={{backgroundColor: color}}>
      <div className="col-xs-5">
        <h2>
          {name}:
        </h2>
      </div>
      <div className={cx(classes.field_value, "col-xs-7")}>
        <p>
          {value}
        </p>
      </div>
    </div>
  </Link>;


export default ChooseCardView
