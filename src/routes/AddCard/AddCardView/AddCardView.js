import React from 'react'
import classes from './AddCardView.scss'
import cx from 'classnames'
import {Link} from 'react-router'
import Dialog from 'material-ui/Dialog'
import DatePicker from 'material-ui/DatePicker'
import RaisedButton from 'material-ui/RaisedButton'
import '../../../styles/core.scss';

class AddCardView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      cardId: '',
      statementStart: ''
    }
  }

  openDialog = cardId => {
    this.setState({cardId, show: true});
  };

  saveCard = () => {
    const {cardId, statementStart} = this.state;
    // this.props.addCard(cardId, statementStart);
    if (statementStart !== '') {
      this.props.history.replace('/card_overview');
    }
  };

  setDate = (e, date) => {
    this.setState({statementStart: date})
  };

  handleClose = () => {
    this.setState({cardId: '', show: false})
  };

  render() {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return (
      <div className={classes.container}>
        <div className="row">
          {Object.keys(this.props.cards)
            .map((key) =>
              <SelectCard
                key={key}
                card_img={this.props.cards[key].image}
                card_id={key} openDialog={this.openDialog}/>
            )}
        </div>
        <Dialog
          modal={false}
          onRequestClose={this.handleClose}
          open={this.state.show}
        >
          <div className="text-center">
            <CardSelected card={this.props.cards[this.state.cardId]}/>
            <p>Add Statement Cycle Start Date</p>
            <DatePicker
              hintText="Statement Cycle Date"
              value={this.state.statementStart}
              onChange={this.setDate}
              autoOk={true}
              hideCalendarDate={true}
              disableYearSelection={true}
              minDate={firstDay}
              maxDate={lastDay}
              cancelLabel='close'
            />
            <RaisedButton onTouchTap={this.saveCard}>Save Card</RaisedButton>
          </div>
        </Dialog>
      </div>
    )
  }
}

const CardSelected = ({card}) => <img src={card ? card['image'] : ''}/>;

const SelectCard = ({
  card_img,
  card_id,
  openDialog
}) => {
  const selectCard = () => {
    openDialog(card_id);
  };

  return (
    <div className={cx("col-xs-6", classes.select_card)}>
      <Link onClick={selectCard}><img src={card_img}/></Link>
    </div>
  )
};


export default AddCardView
