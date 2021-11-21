import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import * as taskSelectors from 'resources/task/task.selectors';
import { taskActions } from 'resources/task/task.slice';
import * as userSelectors from 'resources/user/user.selectors';

import Button from 'components/Button';

import styles from './home.styles.pcss';

function Home() {
  const dispatch = useDispatch();

  const tasks = useSelector(taskSelectors.selectTasks);
  const user = useSelector(userSelectors.selectUser);

  React.useEffect(() => {
    dispatch(taskActions.listTasks());
  }, []);

  const handleCreateTask = () => {
    dispatch(taskActions.createTask());
  };

  const handleShuffle = () => {
    dispatch(taskActions.shuffleTasks());
  };

  return (
    <>
      <h1 className={styles.title}>Tasks</h1>
      <div className={styles.buttons}> 
        <Button onClick={handleCreateTask}>Create Task</Button>
        &nbsp;
        { user.role !== 'employee' && <Button onClick={handleShuffle}> Shuffle </Button> }
      </div>
      <div>
        {tasks.map((task) => {
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

              <div className={styles['participants-list']}>
                Description:
                {' '}
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

            </div>
          );
        })}
      </div>
    </>
  );
}

export default React.memo(Home);
