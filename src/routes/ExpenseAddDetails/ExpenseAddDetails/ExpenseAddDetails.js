import React from 'react'
import classes from './ExpenseAddDetails.scss'
import cx from 'classnames'
import {Link} from 'react-router'
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Dropzone from 'react-dropzone';
import format from 'date-fns/format'
import '../../../styles/core.scss';

const toDecimal = (num) => parseFloat(Math.round(num * 100) / 100).toFixed(2);

class ChooseCardView extends React.Component {
  constructor() {
    super();
    this.state = {
      expenseAmt: '0'
    };
  }

  render() {
    return (
      <div className={classes.container}>
        <div className={classes.overview}>
          <p>
            Total Spent: {"$ " + toDecimal(this.props.amount)}
          </p>
          <p>
            Cashback: {"$ " + toDecimal(this.props.cashback)}
          </p>
          <p>
            Category: {this.props.currentCategory}
          </p>
          <p>
            Date of purchase: {format(new Date(this.props.dateOfPurchase), 'D MMM, h:mm a')}
          </p>
        </div>
        <div className={cx("row", classes.pad_20)}>
          {Object.keys(this.props.applicableCategories).map(key => {
              const category = this.props.applicableCategories[key];
              return (
                <ChooseCategory
                  updateExpense={this.props.updateExpense}
                  expenseId={this.props.uuid}
                  category={category}
                  parentGroup={key}
                  key={key}
                />
              )
            }
          )}
        </div>
        <div className={cx("row", classes.pad_20)}>
          <AddNote
            updateExpense={this.props.updateExpense}
            expenseId={this.props.uuid}
            description={this.props.description}
            notes={this.props.notes}
          />
          <AddReceipt/>
          <ChangeDate
            updateExpense={this.props.updateExpense}
            dateOfPurchase={this.props.dateOfPurchase}
            expenseId={this.props.uuid}
          />
        </div>
        <div className="row">
          <CancelBtn updateExpense={this.props.updateExpense}
                     expenseId={this.props.uuid}
                     expenseSaved={this.props.saved}
          />
          <SaveBtn updateExpense={this.props.updateExpense}
                   expenseId={this.props.uuid}/>
        </div>
      </div>
    )
  }
}

class ChooseCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    const {
      updateExpense,
      expenseId,
      category,
      parentGroup
    } = this.props;
    const selectCategory = (cardCategory) => {
      const updatedAt = (new Date()).toISOString();
      this.setState({open: false});
      updateExpense(
        expenseId,
        {
          cardCategory,
          category: parentGroup,
          updatedAt
        });
    };
    const defaultCategory = Object
      .keys(category)
      .map(key => ({key, ...category[key]}))
      .filter(subCat => subCat['default'])[0];
    return (
      <div className="col-xs-6">
        <div className={classes.category_btn_group}>
          <button
            className={classes.category_btn}
            onClick={selectCategory.bind(this, defaultCategory['key'])}>
            {defaultCategory['name']}
          </button>
          <button className={classes.category_menu} onClick={this.handleOpen}>
            <i className="material-icons">menu</i>
          </button>
        </div>
        <Dialog
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          {Object.keys(category).map(key =>
            <SubCategories
              key={key}
              onClick={selectCategory.bind(this, key)}
              {...category[key]}
            />
          )}
        </Dialog>
      </div>
    )
  }
}

const SubCategories = ({
  name,
  terms,
  finePrint,
  onClick
}) =>
  <div>
    <button className={classes.sub_category_btn} onTouchTap={onClick}>
      {name}
    </button>
    <p>
      {terms}
    </p>
  </div>;


class AddNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      description: this.props.description || '',
      notes: this.props.notes || '',
    };
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    const {description, notes} = this.props;
    this.setState({open: false, description, notes});
  };

  handleSave = () => {
    const {expenseId, updateExpense} = this.props;
    const updatedAt = (new Date()).toISOString();
    const {description, notes} = this.state;
    updateExpense(expenseId,
      {
        updatedAt,
        description,
        notes
      });
    this.setState({open: false});
  };

  handleDescriptionChange = (event) => {
    this.setState({
      description: event.target.value,
    });
  };

  handleNoteChange = (event) => {
    this.setState({
      notes: event.target.value,
    });
  };

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Save"
        primary={true}
        onTouchTap={this.handleSave}
      />];
    return (
      <div className={cx("col-xs-4", classes.icon_btn)}>
        <button onClick={this.handleOpen}>
          <i className="material-icons">note_add</i>
          <strong>Add Note</strong>
        </button>
        <Dialog
          modal={false}
          actions={actions}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          <div>
            <TextField
              hintText="Name of the item purchased"
              floatingLabelText="Description"
              fullWidth={true}
              value={this.state.description}
              onChange={this.handleDescriptionChange}
            />
            <TextField
              floatingLabelText="Notes"
              multiLine={true}
              fullWidth={true}
              rows={4}
              value={this.state.notes}
              onChange={this.handleNoteChange}
            />
          </div>
        </Dialog>
      </div>
    )
  }
}

class AddReceipt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      files: []
    };
  }

  onDrop = (acceptedFiles) => {
    this.setState({
      files: acceptedFiles
    });
  };

  setImagePreview = () => {

  };


  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Save"
        primary={true}
        onTouchTap={this.handleSave}
      />];
    const imagePreview = !!this.state.files[0];
    const fadeForPreview = imagePreview ? classes.faded_fonts : '';
    return (
      <div className={cx("col-xs-4", classes.icon_btn)}>
        <Dropzone onDrop={this.onDrop} style={{}}>
          <button className={cx(classes.image_bg, fadeForPreview)}
                  style={{backgroundImage: `url(${imagePreview ? this.state.files[0].preview : ''})`}}>
            <i className="material-icons">camera</i>
            <strong>Receipt</strong>
          </button>
        </Dropzone>
      </div>
    )
  }
}

class ChangeDate extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      controlledDate: this.props.dateOfPurchase,
    };
  }

  handleChange = (event, date) => {
    this.setState({
      controlledDate: date,
    }, this.openTimePicker);
    const updatedAt = (new Date()).toISOString();
    this.props.updateExpense(this.props.expenseId,
      {
        updatedAt,
        dateOfPurchase: date.toISOString()
      });
  };


  openDatePicker = () => {
    this.refs.datepicker.openDialog()
  };
  openTimePicker = () => {
    this.refs.timepicker.openDialog()
  };
  handleChangeTimePicker12 = (event, date) => {
    this.setState({controlledDate: date});
    const updatedAt = (new Date()).toISOString();
    this.props.updateExpense(this.props.expenseId,
      {
        updatedAt,
        dateOfPurchase: date.toISOString()
      });
  };

  render() {
    return (
      <div className={cx("col-xs-4", classes.icon_btn)}>
        <button onClick={this.openDatePicker}>
          <i className="material-icons">date_range</i>
          <strong>Change<br/>Date</strong>
        </button>
        <div className={classes.hidden_forms}>
          <DatePicker
            hintText="Controlled Date Input"
            value={this.state.controlledDate}
            onChange={this.handleChange}
            autoOk={true}
            ref='datepicker'
            cancelLabel='close'
          />
          <TimePicker
            format="ampm"
            hintText="12hr Format"
            value={this.state.controlledDate}
            ref='timepicker'
            onChange={this.handleChangeTimePicker12}
          />
        </div>
      </div>
    )
  }
}

const CancelBtn = ({updateExpense, expenseId, expenseSaved}) => {
  const cancelExpense = () => {
    if (!expenseSaved) {
      updateExpense(expenseId, {delete: true})
    }
  };
  return (
    <div className="col-xs-6">
      <Link to="/" onClick={cancelExpense}>
        <div className={classes.cancel_btn}>
          <strong>Delete</strong>
        </div>
      </Link>
    </div>)
};

const SaveBtn = ({updateExpense, expenseId}) => {
  const saveExpense = () => {
    updateExpense(expenseId, {saved: true, updatedAt: (new Date()).toISOString()})
  };
  return (
    <div className="col-xs-6">
      <Link to="/" onClick={saveExpense}>
        <div className={classes.save_btn}>
          <strong>Done</strong>
        </div>
      </Link>
    </div>)
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
