import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link, styles, svgFill, themeColor } from '@datapunt/asc-ui'
import { connect } from 'react-redux'
import { authenticateRequest } from '../../../../shared/ducks/user/user'

const StyledLinkInverted = styled(Link)`
  color: ${themeColor('tint', 'level1')};
  background-color: transparent;

  ${styles.IconStyle} {
    ${svgFill('tint', 'level1')};
  }

  &:hover {
    cursor: pointer;
    color: ${themeColor('tint', 'level1')};
    text-decoration: underline;

    ${styles.IconStyle} {
      ${svgFill('tint', 'level1')};
    }
  }
`

const StyledLink = styled(Link)`
  background-color: ${themeColor('tint', 'level1')};
`

export const LoginLink = ({ login, linkType, children, inverted }) => (
  <div>
    {inverted ? (
      <StyledLinkInverted forwardedAs="button" onClick={login} linkType={linkType}>
        {children || 'Inloggen'}
      </StyledLinkInverted>
    ) : (
      <StyledLink forwardedAs="button" onClick={login} linkType={linkType}>
        {children || 'Inloggen'}
      </StyledLink>
    )}
  </div>
)

LoginLink.defaultProps = {
  linkType: 'with-chevron',
  inverted: true,
}

LoginLink.propTypes = {
  login: PropTypes.func.isRequired,
  linkType: PropTypes.string,
  inverted: PropTypes.bool,
}

export const mapDispatchToProps = (dispatch) => ({
  login: (e) => {
    e.preventDefault()
    dispatch(authenticateRequest('inloggen'))
    window.auth.login()
  },
})

const LoginLinkContainer = connect(null, mapDispatchToProps)(LoginLink)

export default LoginLinkContainer
