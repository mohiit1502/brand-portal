import {createSelector} from 'reselect'

const getData = (data) => data

export const getClaims = createSelector(
  getData,
  (dataState) => {
    return dataState.claims.claimList;
  }
)
