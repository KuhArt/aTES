import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import * as taskSelectors from 'resources/task/task.selectors';

import * as userSelectors from 'resources/user/user.selectors';
import { taskActions } from 'resources/task/task.slice';

import Button from 'components/Button';

import styles from './tasks.styles.pcss';

function Home() {
  const dispatch = useDispatch();

  const tasks = useSelector(taskSelectors.selectTasks);
  const user = useSelector(userSelectors.selectUser);

  React.useEffect(() => {
    dispatch(taskActions.listTasks());
  }, [dispatch]);

  const handleCloseTask = (id) => {
    dispatch(taskActions.closeTask(id));
  };

  return (
    <>
      <h1 className={styles.title}>My Tasks</h1>
      <div>
        {tasks
          .filter(({ assignedPublicId }) => assignedPublicId === user.publicId)
          .map((task) => {
            return (
              <div
                key={task.jira_id}
                className={styles.meeting}
              >
                <div className={styles.time}>
                  #
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
                  Employee id:
                  {' '}
                  {task.assignedPublicId}
                </div>
                { task.status !== 'просо в миске' && <Button onClick={() => handleCloseTask(task._id)}> Close Task </Button>}

              </div>
            );
          })}
      </div>
    </>
  );
}

export default React.memo(Home);
