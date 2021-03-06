/* eslint-disable react/no-array-index-key,react/jsx-no-bind */
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import IconButton from 'components/IconButton';
import ArrowRightIcon from 'static/icons/arrow-right.svg';
import ArrowLeftIcon from 'static/icons/arrow-left.svg';

import styles from './TableFooter.pcss';

const PageNumber = ({ number, onClick, isCurrent }) => {
  const handleClick = () => {
    onClick(number);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        styles.pageNumber,
        { [styles.current]: isCurrent },
      )}
    >
      {number}
    </button>
  );
};

PageNumber.propTypes = {
  number: PropTypes.number.isRequired,
  isCurrent: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const TableFooter = ({
  page, pageSize, totalPages,
  itemsCount, totalCount, onGoToPage,
}) => {
  if (!itemsCount) {
    return null;
  }

  const firstItemIndex = (page - 1) * pageSize + 1;
  const itemsStr = `${firstItemIndex}-${firstItemIndex + itemsCount - 1}`;

  function handlePrevPageClick() {
    onGoToPage(page - 1);
  }

  function handleNextPageClick() {
    onGoToPage(page + 1);
  }

  const renderPages = () => {
    if (totalPages <= 7) {
      return (
        [...Array(totalPages)].map((_, i) => (
          <PageNumber
            onClick={onGoToPage}
            number={i + 1}
            isCurrent={page === i + 1}
            key={i}
          />
        ))
      );
    }
    return (
      <>
        {[...Array(3)].map((_, i) => (
          <PageNumber
            onClick={onGoToPage}
            number={i + 1}
            isCurrent={page === i + 1}
            key={i}
          />
        ))}
        <div>...</div>
        {([...Array(3)].map((_, i) => (
          <PageNumber
            onClick={onGoToPage}
            number={totalPages - i}
            isCurrent={page === totalPages - i}
            key={totalPages - i - 1}
          />
        ))).reverse()}
      </>
    );
  };

  return (
    <div className={styles.tableFooter}>

      <div>
        {`Showing ${itemsStr} of ${totalCount} results`}
      </div>

      {totalPages > 1 ? (
        <div className={styles.controls}>
          <IconButton
            Icon={ArrowLeftIcon}
            disabled={page === 1}
            onClick={handlePrevPageClick}
          />
          {renderPages()}
          <IconButton
            Icon={ArrowRightIcon}
            disabled={page === totalPages}
            onClick={handleNextPageClick}
          />
        </div>
      ) : <div />}
    </div>
  );
};

TableFooter.propTypes = {
  pageSize: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  itemsCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onGoToPage: PropTypes.func.isRequired,
};

export default TableFooter;
