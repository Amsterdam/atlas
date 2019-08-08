import React from 'react'
import PropTypes from 'prop-types'
import HelpLink from '../PanelMessages/HelpLink/HelpLink'

const NoResultsForSearchType = ({ message, authMessage }) => {
  return (
    <div className="c-link__wrapper--inine-block">
      <div className="u-margin__bottom--1">Geen resultaten van deze soort</div>
      {message}
      {authMessage && (
        <span>
          &nbsp;Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om meer gegevens te
          zien. <HelpLink />.
        </span>
      )}
    </div>
  )
}

NoResultsForSearchType.defaultProps = {
  message: '',
  authMessage: false,
}

NoResultsForSearchType.propTypes = {
  message: PropTypes.string,
  authMessage: PropTypes.bool,
}

export default NoResultsForSearchType
