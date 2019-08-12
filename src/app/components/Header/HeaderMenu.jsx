import React from 'react'
import { MenuInline, MenuToggle, MenuFlyOut, MenuItem, MenuButton } from '@datapunt/asc-ui'
import { ChevronRight } from '@datapunt/asc-assets'
import PropTypes from 'prop-types'
import Link from 'redux-first-router-link'
import {
  toApisPage,
  toAvailabilityPage,
  toDatasets,
  toHelpPage,
  toMaintentancePage,
  toMap,
  toPanoramaAndPreserveQuery,
  toPrivacyPage,
} from '../../../store/redux-first-router/actions'
import truncateString from '../../../shared/services/truncateString/truncateString'

const toPanoramaAction = toPanoramaAndPreserveQuery(undefined, undefined, undefined, 'home')
const toMapAction = toMap(true)
const toDatasetsAction = toDatasets()
const toApisAction = toApisPage()
const toPrivacyAction = toPrivacyPage()
const toAvailabilityAction = toAvailabilityPage()
const toMaintentanceAction = toMaintentancePage()
const toHelpAction = toHelpPage()

const components = {
  default: MenuInline,
  mobile: MenuToggle,
}

const StyledLink = ({ children, ...otherProps }) => (
  <MenuButton $as={Link} {...otherProps}>
    {children}
  </MenuButton>
)

const HeaderMenu = ({ type, login, logout, user, showFeedbackForm, ...props }) => {
  const Menu = components[type]

  return (
    <Menu {...props}>
      <MenuFlyOut label="Onderdelen">
        <MenuItem>
          <StyledLink iconLeft={<ChevronRight />} to={toMapAction}>
            Kaart
          </StyledLink>
        </MenuItem>
        <MenuItem>
          <StyledLink iconLeft={<ChevronRight />} to={toPanoramaAction}>
            Panoramabeelden
          </StyledLink>
        </MenuItem>
        <MenuItem>
          <StyledLink iconLeft={<ChevronRight />} to={toDatasetsAction}>
            Datasets
          </StyledLink>
        </MenuItem>
        <MenuItem>
          <StyledLink iconLeft={<ChevronRight />} to={toApisAction}>
            Data services
          </StyledLink>
        </MenuItem>
      </MenuFlyOut>
      <MenuFlyOut label="Over">
        <MenuItem>
          <StyledLink iconLeft={<ChevronRight />} to={toPrivacyAction}>
            Privacy en informatiebeveiliging
          </StyledLink>
        </MenuItem>
        <MenuItem>
          <StyledLink iconLeft={<ChevronRight />} to={toAvailabilityAction}>
            Beschikbaarheid en kwaliteit data
          </StyledLink>
        </MenuItem>
        <MenuItem>
          <StyledLink iconLeft={<ChevronRight />} to={toMaintentanceAction}>
            Technisch beheer en werkwijze
          </StyledLink>
        </MenuItem>
        <MenuItem>
          <MenuButton iconLeft={<ChevronRight />} href="mailto:datapunt@amsterdam.nl">
            Contact
          </MenuButton>
        </MenuItem>
      </MenuFlyOut>
      <MenuItem>
        <MenuButton onClick={showFeedbackForm}>Feedback</MenuButton>
      </MenuItem>
      <MenuItem>
        <StyledLink to={toHelpAction}>Help</StyledLink>
      </MenuItem>

      {!user.authenticated ? (
        <MenuItem>
          <MenuButton onClick={login}>Inloggen</MenuButton>
        </MenuItem>
      ) : (
        <MenuFlyOut data-test="login" label={truncateString(user.name, 9)}>
          <MenuItem>
            <MenuButton onClick={logout} iconLeft={<ChevronRight />}>
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
