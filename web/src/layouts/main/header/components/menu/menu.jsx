import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as userSelectors from 'resources/user/user.selectors';

import { routes } from 'routes';

import styles from './menu.styles.pcss';

const links = [
  {
    label: 'Tasks',
    to: routes.home.url(),
  },
  {
    label: 'My Tasks',
    to: routes.myTasks.url(),
  },
  {
    label: 'My Account',
    to: routes.myAccount.url(),
  },
  {
    label: 'Accounting',
    to: routes.home.url(),
  },
  {
    label: 'Analytics',
    to: routes.home.url(),
  },
];

const getLinksByRole = ({ role }) => {
  const defaultLinks = [
    {
      label: 'Tasks',
      to: routes.home.url(),
    },
  ];

  const employeeLinks = [
    {
      label: 'My Tasks',
      to: routes.myTasks.url(),
    },
    {
      label: 'My Account',
      to: routes.myAccount.url(),
    },
  ];

  const managerLinks = [
    {
      label: 'Accounting',
      to: routes.accounting.url(),
    },
    {
      label: 'Analytics',
      to: routes.analytics.url(),
    },
  ];

  if (role === 'employee') {
    return [...defaultLinks, ...employeeLinks];
  }

  return [...defaultLinks, ...managerLinks];
};

function Menu() {
  const user = useSelector(userSelectors.selectUser);
  console.log(user);
  const linksByRole = getLinksByRole({ links, role: user.role });
  return (
    <ul className={styles.menu}>
      {linksByRole.map((link) => (
        <li key={link.label} className={styles.menu__item}>
          <NavLink
            to={link.to}
            exact
            className={styles.menu__link}
            activeClassName={styles.menu__link_active}
          >
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default React.memo(Menu);
