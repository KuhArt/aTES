import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import * as myAccountSelectors from 'resources/myAccount/myAccount.selectors';

import * as userSelectors from 'resources/user/user.selectors';
import { myAccountActions } from 'resources/myAccount/myAccount.slice';


import styles from './myAccount.styles.pcss';

function Home() {
  const dispatch = useDispatch();

  const myAccount = useSelector(myAccountSelectors.selectMyAccount);
  const user = useSelector(userSelectors.selectUser);

  React.useEffect(() => {
    dispatch(myAccountActions.getMyAccountStats());
  }, [dispatch]);


  return (
    <>
      <h1 className={styles.title}>My Account</h1>
      <h2 className={styles.subtitle}>Balance {myAccount.balance}</h2>
      <div>
        {myAccount.transactions
          .map((transaction) => {
            return (
              <div
                key={transaction._id}
                className={styles.meeting}
              >
                <div className={styles.time}>
                  #{transaction.description.toUpperCase()}
                </div>

                <div className={styles['participants-list']}>
                  Amount:
                  {transaction.type === 'debit' ? '-' : '+'}
                  {transaction.amount}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default React.memo(Home);
