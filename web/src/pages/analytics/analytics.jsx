import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as myAccountSelectors from 'resources/myAccount/myAccount.selectors';
import { myAccountActions } from 'resources/myAccount/myAccount.slice';
import _ from 'lodash';
import moment from 'moment';
import styles from './analytics.styles.pcss';

function Home() {
  const dispatch = useDispatch();

  const myAccount = useSelector(myAccountSelectors.selectMyAccount);
  // const user = useSelector(userSelectors.selectUser);

  React.useEffect(() => {
    dispatch(myAccountActions.getMyAccountTotals());
    dispatch(myAccountActions.getMyAccountTasksStats());
  }, [dispatch]);

  const tasksByMonth = _(Object.values(myAccount.taskStats))
    .groupBy((task) => {
      return moment(task.createdOn).format('YYYY-MM');
    })
    .mapValues((tasksGroup) => {
      return _.sortBy(tasksGroup, 'cost.closed').slice(-1)[0];
    })
    .value();
  const tasksByWeek = _(Object.values(myAccount.taskStats))
    .groupBy((task) => {
      return moment(task.createdOn).format('YYYY-WW');
    })
    .mapValues((tasksGroup) => {
      return _.sortBy(tasksGroup, 'cost.closed').slice(-1)[0];
    })
    .value();

  const renderTask = ([date, task], showDate) => {
    return (
      <div
        key={task.jira_id}
        className={styles.meeting}
      >
        {
          showDate
          && (
          <div className={styles.time}>
            #
            {date}
          </div>
          )
        }
        <div className={styles['participants-list']}>
          Title:
          {' '}
          {task.title}
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

      </div>
    );
  };

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
      <h2 className={styles.subtitle}> Tasks stats: </h2>
      <h2 className={styles.subtitle2}> By month: </h2>
      {Object.entries(tasksByMonth).map(([date, task]) => renderTask([date, task]))}
      <h2 className={styles.subtitle2}> By week: </h2>
      {Object.entries(tasksByWeek).map(([date, task]) => renderTask([date, task]))}
      <h2 className={styles.subtitle2}> By day: </h2>
      {Object.entries(myAccount.taskStats).map(([date, task]) => renderTask([date, task], true))}
    </>
  );
}

export default React.memo(Home);
