import React from 'react'
import PropTypes from 'prop-types'
import Notification from '../../../shared/components/notification/Notification'
import LoginLink from './LoginLink/LoginLink'
import HelpLink from './HelpLink/HelpLink'

const MoreResultsWhenLoggedIn = ({ excludedResults }) => (
  <Notification type="info">
    <h3 className="c-panel__title">Meer resultaten na inloggen</h3>
    <p className="c-panel__paragraph">
      {'Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om ' +
        `meer te vinden${excludedResults ? `: ${excludedResults}` : ''}. Zie `}
      <HelpLink />.
    </p>
    <p className="c-panel__paragraph">
      <LoginLink />
    </p>
  </Notification>
)

MoreResultsWhenLoggedIn.defaultProps = {
  excludedResults: '',
}

MoreResultsWhenLoggedIn.propTypes = {
  excludedResults: PropTypes.string,
}

export default MoreResultsWhenLoggedIn
