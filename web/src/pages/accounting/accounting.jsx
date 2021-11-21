import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import * as myAccountSelectors from 'resources/myAccount/myAccount.selectors';

import * as userSelectors from 'resources/user/user.selectors';
import { myAccountActions } from 'resources/myAccount/myAccount.slice';


import styles from './accounting.styles.pcss';

function Home() {
  const dispatch = useDispatch();

  const myAccount = useSelector(myAccountSelectors.selectMyAccount);
  // const user = useSelector(userSelectors.selectUser);

  React.useEffect(() => {
    dispatch(myAccountActions.getMyAccountTotals());
  }, [dispatch]);


  return (
    <>
      <h1 className={styles.title}>My Account</h1>
      <h2 className={styles.title}>Amount {myAccount.totals.amount}</h2>
      <h2 className={styles.title}>Negative balance users {myAccount.usersWithNegativeBalance}</h2>
    </>
  );
}

export default React.memo(Home);
