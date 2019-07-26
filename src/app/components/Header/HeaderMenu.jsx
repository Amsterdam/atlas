import React from 'react'
import { MenuInline, MenuToggle, MenuFlyOut, MenuItem } from '@datapunt/asc-ui'
import { ReactComponent as ChevronRight } from '@datapunt/asc-assets/lib/Icons/ChevronRight.svg'
import PropTypes from 'prop-types'
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
import linkAttributesFromAction from '../../../shared/services/link-attributes-from-action/linkAttributesFromAction'
import truncateString from '../../../shared/services/truncateString/truncateString'

const toPanoramaAction = toPanoramaAndPreserveQuery(
  undefined,
  undefined,
  undefined,
  'home',
)
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

const HeaderMenu = ({
  type,
  login,
  logout,
  user,
  showFeedbackForm,
  ...props
}) => {
  const Menu = components[type]

  return (
    <Menu {...props}>
      <MenuFlyOut label="Onderdelen">
        <MenuItem {...linkAttributesFromAction(toMapAction)}>Kaart</MenuItem>
        <MenuItem {...linkAttributesFromAction(toPanoramaAction)}>
          Panoramabeelden
        </MenuItem>
        <MenuItem {...linkAttributesFromAction(toDatasetsAction)}>Datasets</MenuItem>
        <MenuItem {...linkAttributesFromAction(toApisAction)}>Data services</MenuItem>
      </MenuFlyOut>
      <MenuFlyOut label="Over">
        <MenuItem {...linkAttributesFromAction(toPrivacyAction)}>
          Privacy en informatiebeveiliging
        </MenuItem>
        <MenuItem {...linkAttributesFromAction(toAvailabilityAction)}>
          Beschikbaarheid en kwaliteit data
        </MenuItem>
        <MenuItem {...linkAttributesFromAction(toMaintentanceAction)}>
          Technisch beheer en werkwijze
        </MenuItem>
        <MenuItem href="mailto:datapunt@amsterdam.nl">Contact</MenuItem>
      </MenuFlyOut>
      <MenuItem onClick={showFeedbackForm}>Feedback</MenuItem>
      <MenuItem {...linkAttributesFromAction(toHelpAction)}>Help</MenuItem>

      {!user.authenticated ? (
        <MenuItem onClick={login}>Inloggen</MenuItem>
      ) : (
        <MenuFlyOut label={truncateString(user.name, 9)}>
          <MenuItem icon={<ChevronRight />} onClick={logout}>
            Uitloggen
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
