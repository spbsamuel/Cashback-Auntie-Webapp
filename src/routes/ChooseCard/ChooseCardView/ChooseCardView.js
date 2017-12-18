import React from 'react'
import classes from './ChooseCardView.scss'
import cx from 'classnames'
import {Link} from 'react-router'
import '../../../styles/core.scss';

class ChooseCardView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={classes.container}>
        <StatusCard
          name="Total Spent"
          value={"$ " + parseFloat(this.props.amount)}
          color="#EAEAEA"
        />
        <div className="row">
          {Object.keys(this.props.userCardInfo).map((key) => <SelectCard key={key} card_img={this.props.userCardInfo[key]['card']['image']} userCardId={key} uuid={this.props.uuid}
                                                                  expense_id={this.props.uuid} updateExpense={this.props.updateExpense} push={this.props.history.push} />)}
        </div>
      </div>
    )
  }
}

const SelectCard = ({
  card_img,
  userCardId,
  expense_id,
  updateExpense,
  push,
  uuid
}) => {
  const updateExpenseWithCard = () => {
    const path = '/add_expense/' + expense_id + '/details';
    updateExpense(uuid, {userCardId});
    push(path);
  };
  return(
    <div className={cx("col-xs-6", classes.select_card)}>
      <Link onClick={updateExpenseWithCard}><img src={card_img}/></Link>
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
