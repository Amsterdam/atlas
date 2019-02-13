/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import DataSelectionFormatter from '../DataSelectionFormatter/DataSelectionFormatter';
import './DataSelectionTable.scss';
import { routing } from '../../../routes';
import { getDetailPageData } from '../../../../store/redux-first-router/actions';

const DataSelectionTable = ({ content }) => {
  const buildLink = (row) => {
    const { id, type, subtype } = getDetailPageData(row.detailEndpoint);
    return {
      type: routing.dataDetail.type,
      payload: {
        type,
        subtype,
        id: `id${id}`
      }
    };
  };

  return (
    (content.body && content.body.length > 0) && (
      <div className="c-ds-table">

        <div className="c-ds-table__head">
          <div className="c-ds-table__row">
            {content.head.map((field, i) => (
              <div key={i} className="c-ds-table__cell">
                {field}
              </div>
            ))}
          </div>
        </div>
        <div className="c-ds-table__body">
          {content.body.map((row) => (
            <Link
              key={row.detailEndpoint}
              className="c-ds-table__row"
              to={buildLink(row)}
            >
              {row.content.map((variables, i) => (
                <div
                  key={`${variables[0].value}_${variables[0].key}_${i}`}
                  className="c-ds-table__cell"
                >
                  <DataSelectionFormatter
                    variables={variables}
                    formatter={content.formatters[i]}
                    template={content.templates[i]}
                  />
                </div>
              ))}
            </Link>
          ))}
        </div>
      </div>)
  );
};

DataSelectionTable.propTypes = {
  content: PropTypes.shape({
    head: PropTypes.array,
    body: PropTypes.array
  }).isRequired
};

export default DataSelectionTable;
