import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import config from 'config';
import { routes } from 'routes';

import * as userSelectors from 'resources/user/user.selectors';
import { userActions } from 'resources/user/user.slice';

import Input from 'components/Input';
import Button from 'components/Button';
import Form from 'components/Form';

import styles from './sign-up.pcss';

function SignUp() {
  const dispatch = useDispatch();

  const user = useSelector(userSelectors.selectUser);

  const [values, setValues] = React.useState({});
  const [registered, setRegistered] = React.useState(false);

  const [signupToken, setSignupToken] = React.useState();

  console.log(values);
  const handleSubmit = async (submitValues) => {
    console.log('submitValues: ', values)
    const response = await dispatch(userActions.signUp(values));
    if (response.signupToken) setSignupToken(response.signupToken);
    setRegistered(true);
    setValues(submitValues);
  };

  if (user) {
    return <Redirect to={routes.home.url()} />;
  }

  if (registered) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>
          Thanks!
        </h1>
        <div className={styles.row}>
          We just sent an email with a confirmation link to
          {' '}
          <b>{values.email}</b>
          .
        </div>
        <div className={styles.row}>
          Please follow the instructions from the email to complete a sign up process.
        </div>
        {signupToken && (
          <div className={styles.links}>
            <div className={styles.row}>
              You look like a cool developer.
              {' '}
              <a href={`${config.apiUrl}/account/verify-email?token=${signupToken}`}>
                Verify email
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Form
      onSubmit={handleSubmit}
      className={styles.container}
    >
      <h1 className={styles.title}>
        Sign Up
      </h1>
      <div className={styles.row}>
        <Input
          type="text"
          name="firstName"
          onChange={(event) => {
            console.log('event.target.value: ', event.target.value)
            setValues({...values, firstName: event.target.value})
          }}
          placeholder="First Name"
          label="First Name"
        />
      </div>
      <div className={styles.row}>
        <Input
          type="text"
          name="lastName"
          onChange={(event) => {
            setValues({...values, lastName: event.target.value})
          }}
          label="Last Name"
          placeholder="Last Name"
        />
      </div>
      <div className={styles.row}>
        <Input
          type="email"
          name="email"
          placeholder="Email"
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
          onChange={(event) => {
            setValues({...values, password: event.target.value})
          }}
          placeholder="Password"
        />
      </div>
      <div className={styles.row}>
        <Button
          htmlType="submit"
        >
          Sign up
        </Button>
      </div>
      <div className={styles.links}>
        <div className={styles.row}>
          Already have an account?
          {' '}
          <Link to={routes.signIn.url()}>
            Sign in
          </Link>
        </div>
      </div>
    </Form>
  );
}

export default React.memo(SignUp);
