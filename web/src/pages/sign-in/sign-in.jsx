import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import { routes } from 'routes';

import * as userSelectors from 'resources/user/user.selectors';
import { userActions } from 'resources/user/user.slice';

import Input from 'components/Input';
import Button from 'components/Button';
import Form from 'components/Form';

import styles from './sign-in.pcss';

function SignIn() {
  const user = useSelector(userSelectors.selectUser);
  const [values, setValues] = React.useState({});

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    await dispatch(userActions.signIn(values));
  };

  if (user) {
    const redirectPath = new URLSearchParams(window.location.search).get('to');

    return <Redirect to={redirectPath || routes.home.url()} />;
  }

  return (
    <Form
      onSubmit={handleSubmit}
      className={styles.container}
    >
      <h1 className={styles.title}>
        Sign In
      </h1>
      <div className={styles.row}>
        <Input
          type="email"
          placeholder="Email"
          name="email"
          label="Email"
          onChange={(event) => {
            setValues({...values, email: event.target.value})
          }}
        />
      </div>
      <div className={styles.row}>
        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Password"
          onChange={(event) => {
            setValues({...values, password: event.target.value})
          }}
        />
      </div>
      <div className={styles.row}>
        <Button
          htmlType="submit"
        >
          Sign in
        </Button>
      </div>
      <div className={styles.links}>
        <div className={styles.row}>
          Don’t have an account?
          {' '}
          <Link to={routes.signUp.url()}>
            Sign up
          </Link>
        </div>
        <div className={styles.row}>
          <Link to={routes.forgot.url()}>
            Forgot password?
          </Link>
        </div>
      </div>
    </Form>
  );
}

export default React.memo(SignIn);
