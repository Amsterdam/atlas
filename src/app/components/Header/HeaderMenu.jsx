import React from 'react'
import styled from '@datapunt/asc-core'
import { MenuInline, MenuToggle, MenuFlyOut, MenuItem, MenuButton, Link } from '@datapunt/asc-ui'
import { ChevronRight } from '@datapunt/asc-assets'
import PropTypes from 'prop-types'
import RouterLink from 'redux-first-router-link'
import { toArticleDetail, toHelpPage } from '../../../store/redux-first-router/actions'
import truncateString from '../../../shared/services/truncateString/truncateString'
import { OIS_LINKS } from '../Footer/services/footer-links'
import NAVIGATION_LINKS from '../Homepage/services/navigation-links'

const components = {
  default: MenuInline,
  mobile: MenuToggle,
}

const getContactLink = () => {
  const CONTACT_RECIPIENT = 'datapunt@amsterdam.nl'
  const CONTACT_SUBJECT = 'Contact opnemen via data.amsterdam.nl'
  const CONTACT_BODY = `Contact opgenomen via de pagina: ${window.location.href}\n`

  return `mailto:${CONTACT_RECIPIENT}?subject=${window.encodeURIComponent(
    CONTACT_SUBJECT,
  )}&body=${window.encodeURIComponent(CONTACT_BODY)}`
}

// Hotfix, need to be moved to asc-ui MenuButtonStyle
const StyledMenuButton = styled(MenuButton)`
  white-space: normal;
`

const MenuLink = ({ children, as = RouterLink, ...otherProps }) => (
  <StyledMenuButton $as={as} {...otherProps}>
    {children}
  </StyledMenuButton>
)

const HeaderMenu = ({ type, login, logout, user, showFeedbackForm, ...props }) => {
  const Menu = components[type]
  return (
    <Menu {...props}>
      <MenuFlyOut label="Onderdelen">
        {NAVIGATION_LINKS.map(({ id, title, to }) => (
          <MenuLink iconLeft={<ChevronRight />} key={id} title={title} to={to}>
            {title}
          </MenuLink>
        ))}
      </MenuFlyOut>
      <MenuFlyOut label="Over OIS">
        {OIS_LINKS.map(({ title, id, slug }) => (
          <MenuItem key={id}>
            <MenuLink iconLeft={<ChevronRight />} title={title} to={toArticleDetail(id, slug)}>
              {title}
            </MenuLink>
          </MenuItem>
        ))}
        <MenuItem>
          <MenuButton iconLeft={<ChevronRight />} $as={Link} href={getContactLink()}>
            Contact
          </MenuButton>
        </MenuItem>
      </MenuFlyOut>
      <MenuItem>
        <MenuButton type="button" onClick={showFeedbackForm}>
          Feedback
        </MenuButton>
      </MenuItem>
      <MenuItem>
        <MenuLink to={toHelpPage()}>Help</MenuLink>
      </MenuItem>

      {!user.authenticated ? (
        <MenuItem>
          <MenuButton type="button" onClick={login}>
            Inloggen
          </MenuButton>
        </MenuItem>
      ) : (
        <MenuFlyOut data-test="login" label={truncateString(user.name, 9)}>
          <MenuItem>
            <MenuButton type="button" onClick={logout} iconLeft={<ChevronRight />}>
              Uitloggen
            </MenuButton>
          </MenuItem>
        </MenuFlyOut>
      )}
    </Menu>
  )
}

HeaderMenu.propTypes = {
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  showFeedbackForm: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  user: PropTypes.shape({}).isRequired,
}

export default HeaderMenu
