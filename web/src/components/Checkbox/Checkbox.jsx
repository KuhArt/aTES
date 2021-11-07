import React, { forwardRef, memo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import InputController from 'components/InputController';

import styles from './Checkbox.pcss';

const CheckboxComponent = forwardRef(({
  text, disabled, value, onChange, className, name,
}, ref) => (
  <button
    type="button"
    onClick={onChange}
    className={cn({
      [styles.disabled]: disabled,
    }, styles.container, className)}
  >
    <input
      type="checkbox"
      name={name}
      ref={ref}
      checked={value}
      onChange={onChange}
      disabled={disabled}
      className={styles.input}
    />
    <span
      className={cn({
        [styles.checked]: value,
        [styles.disabled]: disabled,
      }, styles.checkbox)}
    />
    <label
      htmlFor="checkbox"
      className={styles.label}
    >
      {text}
    </label>
  </button>
));

const Checkbox = ({ ...props }) => (
  props.name ? (
    <InputController name={props.name} {...props}>
      <CheckboxComponent name={props.name} />
    </InputController>
  ) : <CheckboxComponent {...props} />
);

CheckboxComponent.propTypes = {
  text: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
};

CheckboxComponent.defaultProps = {
  text: '',
  disabled: false,
  value: null,
  className: null,
  onChange: null,
  name: null,
};

Checkbox.propTypes = {
  name: PropTypes.string,
};

Checkbox.defaultProps = {
  name: null,
};

export default memo(Checkbox);
