import {createSelector} from 'reselect'
import CIMBVisaSignatureWrapper from 'containers/CIMBVisaSignatureContainer'
import StandchartSingPostWrapper from 'containers/StandchartSingPostContainer'
import DBSVisaDebitCardWrapper from 'containers/DBSVisaDebitContainer'
import OCBC365CardWrapper from 'containers/OCBC365Container'
import CITIBankSmrtCardWrapper from 'containers/CitibankSmrtContainer'
import {CIMB_VISA_SIGNATURE, STANDCHART_SINGPOST, DBS_VISA_DEBIT, OCBC_365, CITIBANK_SMRT} from 'modules/BankUUID'

export const getUserCards = createSelector(
  ({entities:{userCards}}) => userCards,
  ({entities:{cards}}) => cards,
  (userCards, cards) => Object
    .keys(userCards)
    .reduce((userCardInfo, id) => ({
      ...userCardInfo,
      [id]: {
        ...userCards[id],
        card: cards[userCards[id]['cardId']]
      }
    }), {})
);

const allWrappers = () => ({
  [CIMB_VISA_SIGNATURE]: CIMBVisaSignatureWrapper,
  [STANDCHART_SINGPOST]: StandchartSingPostWrapper,
  [DBS_VISA_DEBIT]: DBSVisaDebitCardWrapper,
  [OCBC_365]: OCBC365CardWrapper,
  [CITIBANK_SMRT]: CITIBankSmrtCardWrapper
});

export const relevantCardWrappers = createSelector(
  ({entities:{userCards}}) => userCards,
  allWrappers,
  (userCards, wrappersByCardID) => Object
  .keys(userCards)
  .reduce((relevantWrappers, userCardId) => {
    const userCard = userCards[userCardId];
    return({...relevantWrappers, [userCardId]: wrappersByCardID[userCard['cardId']]})
  },{})
);
