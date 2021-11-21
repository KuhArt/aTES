import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import * as myAccountSelectors from 'resources/myAccount/myAccount.selectors';

import { myAccountActions } from 'resources/myAccount/myAccount.slice';

import styles from './analytics.styles.pcss';

function Home() {
  const dispatch = useDispatch();

  const myAccount = useSelector(myAccountSelectors.selectMyAccount);
  // const user = useSelector(userSelectors.selectUser);

  React.useEffect(() => {
    dispatch(myAccountActions.getMyAccountTotals());
    dispatch(myAccountActions.getMyAccountTasksStats());
  }, [dispatch]);

  return (
    <>
      <h1 className={styles.title}>Analytics</h1>
      <h2 className={styles.subtitle}>
        Earn today:
        {' '}
        {myAccount.totals.amount}
        {' '}
      </h2>
      <h2 className={styles.subtitle}>
        Users with negative balance:
        {' '}
        {myAccount.totals.usersWithNegativeBalance}
        {' '}
      </h2>
      {Object.entries(myAccount.taskStats)
        .map(([date, task]) => {
          return (
            <div
              key={task.jira_id}
              className={styles.meeting}
            >
              <div className={styles.time}>
                #
                {date}
                {' '}
                {task.jira_id}
                {' '}
                {task.title}
              </div>

              <div className={styles.description}>
                {task.description}
              </div>

              <div className={styles['participants-list']}>
                Status:
                {' '}
                {task.status}
              </div>  
              <div className={styles['participants-list']}>
                Price:
                {' '}
                {task.cost.closed}
              </div>

              <div className={styles['participants-list']}>
                Employee id:
                {' '}
                {task.assignedPublicId}
              </div>
              { task.status !== 'просо в миске' && <Button onClick={() => handleCloseTask(task._id)}> Close Task </Button>}

            </div>
          );
        })}
    </>
  );
}

export default React.memo(Home);
