import request from 'superagent'
import find from 'lodash/find'
import ocbc365 from '../assets/ocbc365.png';
import cimb from '../assets/cimbvisasignature.png';
import standchartsingpost from '../assets/standchartsingpost.png';
import dbsvisadebit from '../assets/dbsvisadebit.jpg';
import citibanksmrt from '../assets/citibanksmrt.png';
// ------------------------------------
// Constants
// ------------------------------------
export const FETCH_ENTITIES_REQUEST = 'FETCH_ENTITIES_REQUEST';
export const FETCH_ENTITIES_SUCCESS = 'FETCH_ENTITIES_SUCCESS';
export const UPDATE_EXPENSE = 'UPDATE_EXPENSE';

// ------------------------------------
// Actions
// ------------------------------------

const apiBase = (path) =>
  request
    .get(`http://localhost:3000/web/${path}`)
    .set('Accept', 'application/vnd.arthop_backend.v1');

const endPointUrls = {
  events: param => 'event_list',
  eventDetails: param => `event/${param}`,
  eventCategories: param => 'event_types',
  spaces: param => 'space_list',
  spaceDetails: param => `space/${param}`,
  spaceCategories: param => 'space_types',
  editorials: param => 'editorial_list',
  editorialDetails: param => `editorial/${param}`,
  editorialFeatured: param => 'editorial_featured',
  homeSlides: param => 'home_slides',
};

const typeToStoreKey = {
  events: 'events',
  eventDetails: 'events',
  spaces: 'spaces',
  spaceDetails: 'spaces',
  editorials: 'editorials',
  editorialDetails: 'editorials',
  editorialFeatured: 'editorialFeatured',
  homeSlides: 'homeSlides',
  eventCategories: 'eventCategories',
  spaceCategories: 'spaceCategories',
};

const apiEntityRequest = ({type, param = ''}) => apiBase(endPointUrls[type](param));

const deriveFreshness = (entities, type, param) => {
  const keyStore = typeToStoreKey[type];
  if (['homeSlides', 'events', 'spaces', 'editorials', 'eventCategories', 'spaceCategories'].indexOf(type) >= 0) {
    return entities[keyStore + 'LastQueried'];
  }
  else if (['eventDetails', 'spaceDetails', 'editorialDetails'].indexOf(type) >= 0) {
    const entity = find(entities[keyStore], {url_path: param});
    if (entity && entity.updatedAt) {
      return entity.updatedAt
    }
  }
  return ''
};

export const fetchEntity = (type, param = '') => (dispatch, getState) => {

  if (Object.keys(endPointUrls).indexOf(type) < 0) return;

  const keyStore = typeToStoreKey[type];

  const freshness = deriveFreshness(getState().entities, type, param);

  dispatch({
    type: 'FETCH_ENTITIES_REQUEST',
    request: {type, param, freshness},
  });

  const queryParams = freshness ? {freshness} : freshness;

  return apiEntityRequest({type, param})
    .query(queryParams)
    .end(
      (err, res) => dispatch({
        type: 'FETCH_ENTITIES_SUCCESS',
        requestType: type,
        key: keyStore,
        response: res.body.data,
        timestamp: res.body.timestamp
      })
    );
};

const timestamp = (time) => time ? (new Date(time)).toISOString() : (new Date()).toISOString();

export function updateExpense(uuid, expense) {
  return {
    type: UPDATE_EXPENSE,
    uuid,
    expense: {updatedAt: timestamp(), ...expense},
  };
}

export const actions = {
  FETCH_ENTITIES_REQUEST,
  FETCH_ENTITIES_SUCCESS
};
// ------------------------------------
// Action Handlers
// ------------------------------------
const isObject = (item) => {
  return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
};

const nthLevelMerge = (target, source, level) => {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {

      // attribute in object is an object too
      if (isObject(source[key])) {

        // Assign when reach level 1 or attribute not present in target
        if (!(key in target) || level === 1)
          Object.assign(output, {[key]: source[key]});

        // Recursive merge if we did not reach max level and attribute is object
        else
          output[key] = nthLevelMerge(target[key], source[key], level - 1);

        //  Merge over if not object
      } else {
        Object.assign(output, {[key]: source[key]});
      }
    });
  }
  return output;
};

const mapCardsToState = (state, action) => {
  return {...state, cards: action.cards}
};

const mapUserCardsToState = (state, action) => {
  return {...state, userCards: action.userCards}
};

const mapResponseToState = (state, action) => {
  let append = {};
  if (['homeSlides', 'events', 'spaces', 'editorials', 'eventCategories', 'spaceCategories'].indexOf(action.requestType) >= 0) {
    append[action.key + 'LastQueried'] = action.timestamp;
  }
  if (action.response.constructor === Object) {
    return {...state, [action.key]: nthLevelMerge(state[action.key], action.response, 2), ...append}
  }
  else if (action.response.constructor === Array) {
    return {...state, [action.key]: action.response, ...append}
  }
  else {
    return state
  }
};

const expenseFactory = () =>
  ({
    amount: 0.0,
    notes: '',
    description: '',
    attachment: '',
    category: 'GENERAL',
    currency: 'SGD',
    cardCategory: 'GENERAL',
    card: null,
    createdAt: '',
    updatedAt: ''
  });

const mapUpdateToExpense = (state, action) => {
  const {uuid, expense} = action;
  const initialExpense = state['expenses'][uuid] || expenseFactory();
  if (expense['delete']) {
    const {[uuid]: deletedExpense, ...restOfExpenses} = state.expenses;
    return {...state, expenses: restOfExpenses}
  }
  return {...state, expenses: {...state['expenses'], [uuid]: {...initialExpense, ...expense}}}
};

const ACTION_HANDLERS = {
  [FETCH_ENTITIES_REQUEST]: (state, action) => state,
  [FETCH_ENTITIES_SUCCESS]: mapResponseToState,
  'FETCH_CARDS_SUCCESS': mapCardsToState,
  'FETCH_USER_CARDS_SUCCESS': mapUserCardsToState,
  [UPDATE_EXPENSE]: mapUpdateToExpense
};

// ------------------------------------
// Reducer
// ------------------------------------
export const initialState = {
  expenses: {
    'f7fd3835-c7fc-4530-9c1b-2b0376817333': {
      saved: true,
      amount: 32.0,
      notes: '',
      description: '',
      attachment: '',
      category: 'DINING',
      currency: 'SGD',
      cardCategory: 'DINING',
      userCardId: 'bbe42427-2ec5-49be-b7cf-01100c529d21',
      createdAt: "2017-03-26T12:46:01.393Z",
      updatedAt: "2017-03-26T12:46:01.393Z",
      dateOfPurchase: "2017-03-26T12:46:01.393Z",
      uuid: 'f7fd3835-c7fc-4530-9c1b-2b0376817333'
    },
    '2407754e-dc74-44c1-b9b7-dfd5bf21e7dc': {
      saved: true,
      amount: 32.0,
      notes: '',
      description: '',
      attachment: '',
      category: 'DINING',
      currency: 'SGD',
      cardCategory: 'DINING',
      userCardId: 'cd00892e-fff6-4c19-82da-a7f39d8bab50',
      createdAt: "2017-03-26T12:46:01.393Z",
      updatedAt: "2017-03-26T12:46:01.393Z",
      dateOfPurchase: "2017-03-26T12:46:01.393Z",
      uuid: '2407754e-dc74-44c1-b9b7-dfd5bf21e7dc'
    },
    'd3db38ce-e546-44f3-916e-296218b7fe1d': {
      saved: true,
      amount: 32.0,
      notes: '',
      description: '',
      attachment: '',
      category: 'GENERAL',
      currency: 'SGD',
      cardCategory: 'GENERAL',
      userCardId: 'cd00892e-fff6-4c19-82da-a7f39d8bab50',
      createdAt: "2017-03-26T12:46:01.393Z",
      updatedAt: "2017-03-26T12:46:01.393Z",
      dateOfPurchase: "2017-03-26T12:46:01.393Z",
      uuid: 'd3db38ce-e546-44f3-916e-296218b7fe1d'
    },
    // 'eadd47c9-6244-4e2f-be07-d1e2df53d340': {
    //   saved: true,
    //   amount: 32.0,
    //   notes: '',
    //   description: '',
    //   attachment: '',
    //   category: 'ONLINE',
    //   currency: 'SGD',
    //   cardCategory: 'ONLINE',
    //   card: '90b4dba4-84e1-45df-b98a-4962b52d4e21',
    //   createdAt: "2017-03-26T12:46:01.393Z",
    //   updatedAt: "2017-03-26T12:46:01.393Z",
    //   dateOfPurchase: "2017-03-26T12:46:01.393Z"
    // },
    // '945cbfdd-c89a-4357-957a-e3bb5f6a4b3f': {
    //   saved: true,
    //   amount: 32.0,
    //   notes: '',
    //   description: '',
    //   attachment: '',
    //   category: 'DINING',
    //   currency: 'SGD',
    //   cardCategory: 'DINING',
    //   card: '90b4dba4-84e1-45df-b98a-4962b52d4e21',
    //   createdAt: "2017-03-26T12:46:01.393Z",
    //   updatedAt: "2017-03-26T12:46:01.393Z",
    //   dateOfPurchase: "2017-03-26T12:46:01.393Z"
    // },
    // '431ae01a-f7f0-4e4a-8199-a1b1db751aa0': {
    //   saved: true,
    //   amount: 32.0,
    //   notes: '',
    //   description: '',
    //   attachment: '',
    //   category: 'DINING',
    //   currency: 'SGD',
    //   cardCategory: 'DINING',
    //   card: '90b4dba4-84e1-45df-b98a-4962b52d4e21',
    //   createdAt: "2017-03-26T12:46:01.393Z",
    //   updatedAt: "2017-03-26T12:46:01.393Z",
    //   dateOfPurchase: "2017-03-26T12:46:01.393Z"
    // },
    // '271c11df-4663-4860-b5e1-1be39cb6c79a': {
    //   saved: true,
    //   amount: 32.0,
    //   notes: '',
    //   description: '',
    //   attachment: '',
    //   category: 'DINING',
    //   currency: 'SGD',
    //   cardCategory: 'DINING',
    //   card: '90b4dba4-84e1-45df-b98a-4962b52d4e21',
    //   createdAt: "2017-03-26T12:46:01.393Z",
    //   updatedAt: "2017-03-26T12:46:01.393Z",
    //   dateOfPurchase: "2017-03-26T12:46:01.393Z"
    // },
    // '4405d916-135b-4ea3-9b45-a095ddda23bb': {
    //   saved: true,
    //   amount: 32.0,
    //   notes: '',
    //   description: '',
    //   attachment: '',
    //   category: 'DINING',
    //   currency: 'SGD',
    //   cardCategory: 'DINING',
    //   card: '90b4dba4-84e1-45df-b98a-4962b52d4e21',
    //   createdAt: "2017-03-26T12:46:01.393Z",
    //   updatedAt: "2017-03-26T12:46:01.393Z",
    //   dateOfPurchase: "2017-03-26T12:46:01.393Z"
    // },
    // '5326a732-f2b0-4161-bf32-328641833b46': {
    //   saved: true,
    //   amount: 32.0,
    //   notes: '',
    //   description: '',
    //   attachment: '',
    //   category: 'DINING',
    //   currency: 'SGD',
    //   cardCategory: 'DINING',
    //   card: '252e8610-f1e2-49da-910b-bac8b457d282',
    //   createdAt: "2017-03-26T12:46:01.393Z",
    //   updatedAt: "2017-03-26T12:46:01.393Z",
    //   dateOfPurchase: "2017-03-26T12:46:01.393Z"
    // },
    // '92b739f7-0cef-4609-a1ff-0806482404ea': {
    //   saved: true,
    //   amount: 32.0,
    //   notes: '',
    //   description: '',
    //   attachment: '',
    //   category: 'DINING',
    //   currency: 'SGD',
    //   cardCategory: 'DINING',
    //   card: '80b81724-9687-4cd2-950b-8c8a663b5881',
    //   createdAt: "2017-03-26T12:46:01.393Z",
    //   updatedAt: "2017-03-26T12:46:01.393Z",
    //   dateOfPurchase: "2017-03-26T12:46:01.393Z"
    // },
    // 'b94d4eee-4bf0-497e-8348-58ec6f784413': {
    //   saved: true,
    //   amount: 32.0,
    //   notes: '',
    //   description: '',
    //   attachment: '',
    //   category: 'DINING',
    //   currency: 'SGD',
    //   cardCategory: 'DINING',
    //   card: 'adda3c5a-ab83-4e78-aa2a-ae6d3c3073ba',
    //   createdAt: "2017-03-26T12:46:01.393Z",
    //   updatedAt: "2017-03-26T12:46:01.393Z",
    //   dateOfPurchase: "2017-03-26T12:46:01.393Z"
    // },
    // '6bc7f8ac-7d49-45be-8a91-ea45a360cbf3': {
    //   saved: true,
    //   amount: 32.0,
    //   notes: '',
    //   description: '',
    //   attachment: '',
    //   category: 'DINING',
    //   currency: 'SGD',
    //   cardCategory: 'DINING',
    //   card: '90b4dba4-84e1-45df-b98a-4962b52d4e21',
    //   createdAt: "2017-03-26T12:46:01.393Z",
    //   updatedAt: "2017-03-26T12:46:01.393Z",
    //   dateOfPurchase: "2017-03-26T12:46:01.393Z"
    // },
  },
  userCards: {
    // 'bbe42427-2ec5-49be-b7cf-01100c529d21': {
    //   cardId:'90b4dba4-84e1-45df-b98a-4962b52d4e21',
    //   statementDate: 1,
    //   paymentDueDate:20,
    //   createdAt:'',
    //   updatedAt:'',
    //   dateActivated:''
    // },
    // 'cd00892e-fff6-4c19-82da-a7f39d8bab50': {
    //   cardId:'80b81724-9687-4cd2-950b-8c8a663b5881',
    //   statementDate: 1,
    //   paymentDueDate:20,
    //   createdAt:'',
    //   updatedAt:'',
    //   dateActivated:''
    // }
  },
  cards: {
    //   '252e8610-f1e2-49da-910b-bac8b457d282': {
    //     name: 'OCBC 365',
    //     bank: 'OCBC',
    //     type: 'CREDIT',
    //     image: ocbc365,
    //   },
    //   '90b4dba4-84e1-45df-b98a-4962b52d4e21': {
    //     name: 'CIMB Visa Signature',
    //     bank: 'CIMB',
    //     type: 'CREDIT',
    //     image: cimb
    //   },
    //   'adda3c5a-ab83-4e78-aa2a-ae6d3c3073ba': {
    //     name: 'Standard Charted Singapore Post',
    //     bank: 'STANDCHART',
    //     type: 'CREDIT',
    //     image: standchartsingpost
    //   },
    //   '80b81724-9687-4cd2-950b-8c8a663b5881': {
    //     name: 'DBS Visa',
    //     bank: 'DBS',
    //     type: 'DEBIT',
    //     image: dbsvisadebit
    //   },
    //   'f8d2946a-162b-4424-a700-1e10ae59bd3d': {
    //     name: 'Citibank SMRT Platinum Visa',
    //     bank: 'Citibank',
    //     type: 'CREDIT',
    //     image: citibanksmrt
  }
};


// categories: {
//   '252e8610-f1e2-49da-910b-bac8b457d282DINING': {
//     card: '252e8610-f1e2-49da-910b-bac8b457d282',
//       parentGroup: 'DINING',
//   default: 'DINING',
//       validCategories: {
//       'DINING': {
//         readableName: 'Dining',
//           readableTerms: 'All restaurants, cafes, fast food outlets, caterers not located within country clubs and hotels',
//           finePrint: ''
//       },
//       'GENERAL': {
//         readableName: 'Non-qualifying Dining',
//           readableTerms: 'Non-qualifying F&B outlets',
//           finePrint: ''
//       }
//     }
//   },
//   '252e8610-f1e2-49da-910b-bac8b457d282ONLINE': {
//     card: '252e8610-f1e2-49da-910b-bac8b457d282',
//       parentGroup: 'ONLINE',
//   default: 'ONLINE',
//       validCategories: {
//       'ONLINE': {
//         readableName: 'Online Purchases',
//           readableTerms: 'Online purchases that do not fall under excluded transactions',
//           finePrint: ''
//       },
//       'GENERAL': {
//         readableName: 'Non-qualifying Online Purchases',
//           readableTerms: 'Non generic online purchases, see fine print',
//           finePrint: ''
//       }
//     }
//   },
//   '252e8610-f1e2-49da-910b-bac8b457d282GROCERIES': {
//     card: '252e8610-f1e2-49da-910b-bac8b457d282',
//       parentGroup: 'GROCERIES',
//   default: 'GROCERIES',
//       validCategories: {
//       'GROCERIES': {
//         readableName: 'Groceries',
//           readableTerms: 'Supermarkets island-wide',
//           finePrint: ''
//       },
//       'GENERAL': {
//         readableName: 'Non-qualifying Groceries',
//           readableTerms: 'Merchants not classified as grocery stores or supermarkets',
//           finePrint: ''
//       }
//     }
//   },
//   '252e8610-f1e2-49da-910b-bac8b457d282BILLS': {
//     card: '252e8610-f1e2-49da-910b-bac8b457d282',
//       parentGroup: 'BILLS',
//   default: 'GENERAL',
//       validCategories: {
//       'TELECOMMS': {
//         readableName: 'Telco Bills',
//           readableTerms: 'Registered recurring bill payments to Singtel, StarHub or M1',
//           finePrint: ''
//       },
//       'GENERAL': {
//         readableName: 'Bills',
//           readableTerms: 'Any Bill payments',
//           finePrint: ''
//       },
//       'EXCLUDED': {
//         readableName: 'Non-qualifying Bills',
//           readableTerms: 'Bill payments that are excluded from the computation of the minimum monthly spent',
//           finePrint: ''
//       }
//     }
//   },
//   '252e8610-f1e2-49da-910b-bac8b457d282GENERAL': {
//     card: '252e8610-f1e2-49da-910b-bac8b457d282',
//       parentGroup: 'GENERAL',
//   default: 'GENERAL',
//       validCategories: {
//       'GENERAL': {
//         readableName: 'General',
//           readableTerms: 'Any purchase that does not fall under the other qualifying categories',
//           finePrint: ''
//       },
//       'EXCLUDED': {
//         readableName: 'Non-qualifying General',
//           readableTerms: 'General purchases that are excluded from the computation of the minimum monthly spent',
//           finePrint: ''
//       }
//     }
//   },
//   '90b4dba4-84e1-45df-b98a-4962b52d4e21DINING': {
//     card: '90b4dba4-84e1-45df-b98a-4962b52d4e21',
//       parentGroup: 'DINING',
//   default: 'DINING',
//       validCategories: {
//       'DINING': {
//         readableName: 'Dining',
//           readableTerms: 'Caterers, Bars, Lounges, Clubs, FastFood Restaurants, Eating Places & Other Restaurants only',
//           finePrint: ''
//       },
//       'GENERAL': {
//         readableName: 'Non-qualifying Dining',
//           readableTerms: 'Wedding banquets, bar, lounge, club, restaurant, and other eating places within Hotels',
//           finePrint: ''
//       }
//     }
//   },
//   '90b4dba4-84e1-45df-b98a-4962b52d4e21ONLINE': {
//     card: '90b4dba4-84e1-45df-b98a-4962b52d4e21',
//       parentGroup: 'ONLINE',
//   default: 'ONLINE',
//       validCategories: {
//       'ONLINE': {
//         readableName: 'Online Purchases',
//           readableTerms: 'Payments over the internet',
//           finePrint: ''
//       },
//       'GENERAL': {
//         readableName: 'Non-qualifying Online Purchase',
//           readableTerms: '',
//           finePrint: ''
//       }
//     }
//   },
//   '90b4dba4-84e1-45df-b98a-4962b52d4e21GROCERIES': {
//     card: '90b4dba4-84e1-45df-b98a-4962b52d4e21',
//       parentGroup: 'GROCERIES',
//   default: 'GROCERIES',
//       validCategories: {
//       'GROCERIES': {
//         readableName: 'Groceries',
//           readableTerms: 'Purchases from supermarkets',
//           finePrint: ''
//       }
//     }
//   },
//   '90b4dba4-84e1-45df-b98a-4962b52d4e21BILLS': {
//     card: '90b4dba4-84e1-45df-b98a-4962b52d4e21',
//       parentGroup: 'BILLS',
//   default: 'GENERAL',
//       validCategories: {
//       'GENERAL': {
//         readableName: 'Bills',
//           readableTerms: '',
//           finePrint: ''
//       },
//       'EXCLUDED': {
//         readableName: 'Non-qualifying Bills',
//           readableTerms: 'Payments covered in exclusion',
//           finePrint: ''
//       }
//     }
//   },
//   '90b4dba4-84e1-45df-b98a-4962b52d4e21GENERAL': {
//     card: '90b4dba4-84e1-45df-b98a-4962b52d4e21',
//       parentGroup: 'GENERAL',
//   default: 'GENERAL',
//       validCategories: {
//       'GENERAL': {
//         readableName: 'General',
//           readableTerms: 'Day to day purchases not covered in other categories',
//           finePrint: ''
//       },
//       'EXCLUDED': {
//         readableName: 'Non-qualifying General',
//           readableTerms: 'General purchases covered in exclusion',
//           finePrint: ''
//       }
//     }
//   },
//   'adda3c5a-ab83-4e78-aa2a-ae6d3c3073baDINING': {
//     card: 'adda3c5a-ab83-4e78-aa2a-ae6d3c3073ba',
//       parentGroup: 'DINING',
//   default: 'DINING',
//       validCategories: {
//       'DINING': {
//         readableName: 'Dining',
//           readableTerms: '',
//           finePrint: ''
//       }
//     }
//   },
//   'adda3c5a-ab83-4e78-aa2a-ae6d3c3073baONLINE': {
//     card: 'adda3c5a-ab83-4e78-aa2a-ae6d3c3073ba',
//       parentGroup: 'ONLINE',
//   default: 'ONLINE',
//       validCategories: {
//       'ONLINE': {
//         readableName: 'Online Purchases',
//           readableTerms: 'online transaction based on codes assigned by Visa',
//           finePrint: ''
//       },
//       'GENERAL': {
//         readableName: 'Non-qualifying Online Purchases',
//           readableTerms: 'Online purchases not classified as online transactions by Visa',
//           finePrint: ''
//       },
//     }
//   },
//   'adda3c5a-ab83-4e78-aa2a-ae6d3c3073baGROCERIES': {
//     card: 'adda3c5a-ab83-4e78-aa2a-ae6d3c3073ba',
//       parentGroup: 'GROCERIES',
//   default: 'GROCERIES',
//       validCategories: {
//       'GROCERIES': {
//         readableName: 'Groceries',
//           readableTerms: 'NTUC Fairprice, Cold Storage, Giant, and Sheng Shiong',
//           finePrint: ''
//       },
//       'GENERAL': {
//         readableName: 'Non-qualifying Groceries',
//           readableTerms: 'Other supermarkets',
//           finePrint: ''
//       }
//     }
//   },
//   'adda3c5a-ab83-4e78-aa2a-ae6d3c3073baBILLS': {
//     card: 'adda3c5a-ab83-4e78-aa2a-ae6d3c3073ba',
//       parentGroup: 'BILLS',
//   default: 'GENERAL',
//       validCategories: {
//       'GENERAL': {
//         readableName: 'Bills',
//           readableTerms: '',
//           finePrint: ''
//       },
//       'EXCLUDED': {
//         readableName: 'Non-qualifying Bills',
//           readableTerms: 'Payments covered in exclusion',
//           finePrint: ''
//       }
//     }
//   },
//   'adda3c5a-ab83-4e78-aa2a-ae6d3c3073baGENERAL': {
//     card: 'adda3c5a-ab83-4e78-aa2a-ae6d3c3073ba',
//       parentGroup: 'GENERAL',
//   default: 'GENERAL',
//       validCategories: {
//       'GENERAL': {
//         readableName: 'General',
//           readableTerms: 'Day to day purchases not covered in other categories',
//           finePrint: ''
//       },
//       'EXCLUDED': {
//         readableName: 'Non-qualifying General',
//           readableTerms: 'General purchases covered in exclusion',
//           finePrint: ''
//       }
//     }
//   },
//   '80b81724-9687-4cd2-950b-8c8a663b5881DINING': {
//     card: '80b81724-9687-4cd2-950b-8c8a663b5881',
//       parentGroup: 'DINING',
//   default: 'DINING',
//       validCategories: {
//       'DINING': {
//         readableName: 'Dining',
//           readableTerms: 'Paid with Visa PayWave',
//           finePrint: ''
//       },
//       'EXCLUDED': {
//         readableName: 'Non-qualifying Dining',
//           readableTerms: 'Other payment method',
//           finePrint: ''
//       }
//     }
//   },
//   '80b81724-9687-4cd2-950b-8c8a663b5881ONLINE': {
//     card: '80b81724-9687-4cd2-950b-8c8a663b5881',
//       parentGroup: 'ONLINE',
//   default: 'EXCLUDED',
//       validCategories: {
//       'EXCLUDED': {
//         readableName: 'Online Purchases',
//           readableTerms: '',
//           finePrint: ''
//       }
//     }
//   },
//   '80b81724-9687-4cd2-950b-8c8a663b5881GROCERIES': {
//     card: '80b81724-9687-4cd2-950b-8c8a663b5881',
//       parentGroup: 'GROCERIES',
//   default: 'GROCERIES',
//       validCategories: {
//       'GROCERIES': {
//         readableName: 'Groceries',
//           readableTerms: 'Paid with Visa PayWave',
//           finePrint: ''
//       },
//       'EXCLUDED': {
//         readableName: 'Non-qualifying Groceries',
//           readableTerms: 'Other payment method',
//           finePrint: ''
//       }
//     }
//   },
//   '80b81724-9687-4cd2-950b-8c8a663b5881BILLS': {
//     card: '80b81724-9687-4cd2-950b-8c8a663b5881',
//       parentGroup: 'BILLS',
//   default: 'EXCLUDED',
//       validCategories: {
//       'EXCLUDED': {
//         readableName: 'Bills',
//           readableTerms: '',
//           finePrint: ''
//       }
//     }
//   },
//   '80b81724-9687-4cd2-950b-8c8a663b5881GENERAL': {
//     card: '80b81724-9687-4cd2-950b-8c8a663b5881',
//       parentGroup: 'GENERAL',
//   default: 'GENERAL',
//       validCategories: {
//       'GENERAL': {
//         readableName: 'General',
//           readableTerms: 'Paid with Visa PayWave',
//           finePrint: ''
//       },
//       'EXCLUDED': {
//         readableName: 'Non-qualifying General',
//           readableTerms: 'Other payment method',
//           finePrint: ''
//       }
//     }
//   },
//
//   'f8d2946a-162b-4424-a700-1e10ae59bd3dDINING': {
//     card: 'f8d2946a-162b-4424-a700-1e10ae59bd3d',
//       parentGroup: 'DINING',
//   default: 'GENERAL',
//       validCategories: {
//       'DINING': {
//         readableName: 'Fast Food',
//           readableTerms: 'BreadTalk, Burger King, KFC, McDonald\'s, Pizza Hut, PastaMania, Sakae Sushi, Subway, Toast Box',
//           finePrint: ''
//       },
//       'COFFEE': {
//         readableName: 'Coffee',
//           readableTerms: 'Coffee Club, Dome Café, Gloria Jean\'s Coffee, Starbucks Coffee, Coffee Bean & Tea Leaf, The Connoisseur Concerto (tcc)',
//           finePrint: ''
//       },
//       'GENERAL': {
//         readableName: 'Other Dining',
//           readableTerms: 'Non-qualifying F&B outlets',
//           finePrint: ''
//       }
//     }
//   },
//   'f8d2946a-162b-4424-a700-1e10ae59bd3dONLINE': {
//     card: 'f8d2946a-162b-4424-a700-1e10ae59bd3d',
//       parentGroup: 'ONLINE',
//   default: 'ONLINE',
//       validCategories: {
//       'ONLINE': {
//         readableName: 'Online Purchases',
//           readableTerms: 'Online purchases that do not fall under excluded transactions',
//           finePrint: ''
//       },
//       'GENERAL': {
//         readableName: 'Non-qualifying Online Purchases',
//           readableTerms: 'Excludes all travel-related merchant worldwide',
//           finePrint: ''
//       }
//     }
//   },
//   'f8d2946a-162b-4424-a700-1e10ae59bd3dGROCERIES': {
//     card: 'f8d2946a-162b-4424-a700-1e10ae59bd3d',
//       parentGroup: 'GROCERIES',
//   default: 'GROCERIES',
//       validCategories: {
//       'GROCERIES': {
//         readableName: 'Groceries',
//           readableTerms: 'FairPrice, Giant, Sheng Siong',
//           finePrint: ''
//       },
//       'GENERAL': {
//         readableName: 'Non-qualifying Groceries',
//           readableTerms: 'Other supermarkets',
//           finePrint: ''
//       }
//     }
//   },
//   'f8d2946a-162b-4424-a700-1e10ae59bd3dBILLS': {
//     card: 'f8d2946a-162b-4424-a700-1e10ae59bd3d',
//       parentGroup: 'BILLS',
//   default: 'GENERAL',
//       validCategories: {
//       'GENERAL': {
//         readableName: 'Bills',
//           readableTerms: 'Any Bill payments',
//           finePrint: ''
//       },
//       'EZLINK': {
//         readableName: 'EZ-Link',
//           readableTerms: 'EZ-Reload Auto Top-up',
//           finePrint: ''
//       },
//       'TOWNCOUNCIL': {
//         readableName: 'Town councils',
//           readableTerms: 'Bill payments that are excluded from the computation of the minimum monthly spent',
//           finePrint: ''
//       },
//       'TELECOMMS': {
//         readableName: 'Telco Bills',
//           readableTerms: 'M1, Singtel, Starhub',
//           finePrint: ''
//       },
//       'INSURANCE': {
//         readableName: 'Insurance',
//           readableTerms: 'ACE Insurance, Prudential',
//           finePrint: ''
//       },
//       'NEWSPAPER': {
//         readableName: 'Newspaper Subscription',
//           readableTerms: 'Bills from Singapore Press Holdings',
//           finePrint: ''
//       }
//     }
//   },
//   'f8d2946a-162b-4424-a700-1e10ae59bd3dGENERAL': {
//     card: 'f8d2946a-162b-4424-a700-1e10ae59bd3d',
//       parentGroup: 'GENERAL',
//   default: 'GENERAL',
//       validCategories: {
//       'GENERAL': {
//         readableName: 'General',
//           readableTerms: 'Any purchase that does not fall under the other categories',
//           finePrint: ''
//       },
//       'TOYSNBOOKS': {
//         readableName: 'Toys & Books',
//           readableTerms: 'POPULAR Bookstores, Toys"R"Us',
//           finePrint: ''
//       },
//       'HEALTHNBEAUTY': {
//         readableName: 'Health & Beauty',
//           readableTerms: 'GNC, Guardian, Nature\'s Farm, NTUC Unity Healthcare, Watson\'s',
//           finePrint: ''
//       },
//       'PETS': {
//         readableName: 'Pet Essentials',
//           readableTerms: 'Purchases from Pet Lovers Centre',
//           finePrint: ''
//       },
//       'EXCLUDED': {
//         readableName: 'Non-qualifying General',
//           readableTerms: 'General purchases that are excluded from getting cashback',
//           finePrint: ''
//       }
//     }
//   },
//   'f8d2946a-162b-4424-a700-1e10ae59bd3dENTERTAINMENT': {
//     card: 'f8d2946a-162b-4424-a700-1e10ae59bd3d',
//       parentGroup: 'ENTERTAINMENT',
//   default: 'GENERAL',
//       validCategories: {
//       'MOVIES': {
//         readableName: 'Movies',
//           readableTerms: 'Cathay Cineplexes, Filmgarde, Golden Village, Shaw Theatres',
//           finePrint: ''
//       },
//       'GENERAL': {
//         readableName: 'Other Entertainment',
//           readableTerms: '',
//           finePrint: ''
//       }
//     }
//   },
// }

export const entitiesReducer = (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
};

// export const entities = {key: 'entities', reducer: entitiesReducer};

export default entitiesReducer

