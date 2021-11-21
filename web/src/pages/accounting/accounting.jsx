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
      <h1 className={styles.title}>Accounting</h1>
      <h2 className={styles.subtitle}>
        Earn today:
        {' '}
        {myAccount.totals.amount}
        {' '}
      </h2>
      {/* <h2 className={styles.title}>
        Users with negative balance:
        {' '}
        {myAccount.totals.usersWithNegativeBalance}
        {' '}
      </h2> */}
      {myAccount.totals.transactions
        .map((transaction) => {
          return (
            <div
              key={transaction._id}
              className={styles.meeting}
            >
              <div className={styles.time}>
                #
                {transaction.description.toUpperCase()}
              </div>

              <div className={styles['participants-list']}>
                Amount:
                {transaction.type === 'credit' ? '-' : '+'}
                {transaction.amount}
              </div>
            </div>
          );
        })}
    </>
  );
}

export default React.memo(Home);
