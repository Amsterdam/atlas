import React, { useMemo, useState } from 'react'
import queryString from 'querystring'
import { ChevronDown } from '@datapunt/asc-assets'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import styled, { css } from 'styled-components'
import {
  Paragraph,
  Checkbox,
  Icon,
  Label,
  styles,
  themeColor,
  themeSpacing,
} from '@datapunt/asc-ui'
import { useSelector } from 'react-redux'
import MAP_CONFIG from '../../services/map.config'
import LoginLinkContainer from '../../../app/components/Links/LoginLink/LoginLinkContainer'

import { isPrintOrEmbedMode } from '../../../shared/ducks/ui/ui'

const isAuthorised = (layer, user) =>
  !layer.authScope || (user.authenticated && user.scopes.includes(layer.authScope))

const isInsideZoomLevel = (layer, zoomLevel) =>
  zoomLevel >= layer.minZoom && zoomLevel <= layer.maxZoom

const TitleWrapper = styled.div`
  display: flex;
`
const StyledLabel = styled(Label)`
  width: 100%;
`

const CollectionLabel = styled(StyledLabel)`
  font-weight: 700;
`

const StyledCheckbox = styled(Checkbox)`
  padding: 0px;
  padding-right: ${themeSpacing(2)};
`

const NonSelectableLegendParagraph = styled(Paragraph)`
  margin-bottom: ${themeSpacing(2)};
`

// We cannot use a button because of IE11
const LayerButton = styled.div.attrs({
  role: 'button',
})`
  display: flex;
  cursor: pointer;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 12px;
  background-color: ${themeColor('tint', 'level2')};

  & > ${styles.IconStyle} {
    margin-right: 3px;
    transition: transform 0.2s ease-in-out;
    ${({ isOpen }) =>
      isOpen &&
      css`
        transform: rotate(180deg);
      `}
  }
`

const constructLegendIconUrl = (mapLayer, legendItem) => {
  if (legendItem.iconUrl) {
    return legendItem.iconUrl
  }

  return [
    MAP_CONFIG.OVERLAY_ROOT,
    `${mapLayer.url || legendItem.url}?`,
    `version=${MAP_CONFIG.VERSION_NUMBER}&`,
    'service=WMS&',
    'request=GetLegendGraphic&',
    `sld_version=${MAP_CONFIG.SLD_VERSION}&`,
    `layer=${
      (legendItem.layers && legendItem.layers[0]) || (mapLayer.layers && mapLayer.layers[0])
    }&`,
    'format=image/svg%2Bxml&',
    legendItem.params ? `${queryString.stringify(legendItem.params)}&` : '',
    `rule=${encodeURIComponent(legendItem.imageRule || legendItem.title)}`,
  ].join('')
}

const MapLegend = ({
  activeMapLayers,
  onLayerVisibilityToggle,
  user,
  zoomLevel,
  printMode,
  onLayerToggle,
  title,
  overlays,
}) => {
  const ref = React.createRef()
  const { trackEvent } = useMatomo()

  const isPrintOrEmbedView = useSelector(isPrintOrEmbedMode)
  const [isOpen, setOpen] = useState(isPrintOrEmbedView ?? false)

  // Open the MapLegend and scroll it into the current view
  const handleSetOpen = (open) => {
    if (open && ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }

    setOpen(open)
  }

  // Todo: This need to be refactored on redux level, so MapLayers and LegendItems will get a isVisible option there.
  const mapLayers = useMemo(
    () =>
      activeMapLayers.map((mapLayer) => ({
        ...mapLayer,
        legendItems: [
          ...(mapLayer.legendItems?.map((legendItem) => ({
            ...legendItem,
            isVisible: overlays.some(
              (overlay) =>
                (overlay.id === legendItem.id && overlay.isVisible) || legendItem.notSelectable,
            ),
          })) || []),
        ],
        isVisible: overlays.some((overlay) =>
          [{ id: mapLayer.id }, ...(mapLayer.legendItems || [])].some(
            (legendItem) => overlay.id === legendItem.id && overlay.isVisible,
          ),
        ),
        isEmbedded: overlays.some((overlay) =>
          [{ id: mapLayer.id }, ...(mapLayer.legendItems || [])].some(
            (legendItem) => overlay.id === legendItem.id && isPrintOrEmbedView,
          ),
        ),
      })),
    [overlays, activeMapLayers],
  )

  const allInvisible = mapLayers.every(({ isVisible }) => !isVisible)
  const collectionIndeterminate =
    mapLayers.some(
      ({ isVisible, legendItems }) =>
        !isVisible || legendItems.some(({ isVisible: legendVisibility }) => !legendVisibility),
    ) && !allInvisible

  const handleLayerToggle = (checked, mapLayer) => {
    onLayerToggle(mapLayer)

    // Only track the event when the mapLayer gets checked
    if (checked) {
      // Sanitize the collection title to use it as action
      const action = mapLayer.title.toLowerCase().replace(/[: ][ ]*/g, '_')

      // eslint-disable-next-line no-unused-expressions
      mapLayer?.legendItems.forEach(({ title: legendItemTitle }) =>
        trackEvent({
          category: 'kaartlaag',
          action,
          name: legendItemTitle,
        }),
      )
    }
  }

  const handleOnChangeCollection = (e) => {
    // We want to check all the layers when user clicks on an indeterminate checkbox
    if (!e.currentTarget.checked && collectionIndeterminate) {
      mapLayers
        .filter(({ isVisible }) => !isVisible)
        .forEach((mapLayer) => {
          handleLayerToggle(e.currentTarget.checked, mapLayer)
        })

      mapLayers.forEach((mapLayer) => {
        // eslint-disable-next-line no-unused-expressions
        mapLayer.legendItems?.length > 0
          ? mapLayer.legendItems
              .filter(({ isVisible }) => !isVisible)
              .forEach((legendItem) => onLayerVisibilityToggle(legendItem.id, false))
          : null
      })
      handleSetOpen(true)
    } else {
      activeMapLayers.forEach((mapLayer) => {
        handleLayerToggle(e.currentTarget.checked, mapLayer)
      })
      handleSetOpen(e.currentTarget.checked)
    }
  }

  return (
    <>
      {(!isPrintOrEmbedView ||
        (isPrintOrEmbedView && mapLayers.some(({ isEmbedded }) => isEmbedded))) && ( // Also display the collection title when maplayer is embedded
        <LayerButton ref={ref} onClick={() => handleSetOpen(!isOpen)} isOpen={isOpen}>
          <TitleWrapper>
            <CollectionLabel key={title} htmlFor={title} label={title}>
              {!isPrintOrEmbedView ? (
                <StyledCheckbox
                  id={title}
                  className="checkbox"
                  name={title}
                  indeterminate={collectionIndeterminate}
                  checked={!allInvisible}
                  onChange={handleOnChangeCollection}
                />
              ) : null}
            </CollectionLabel>
          </TitleWrapper>
          <Icon size={15}>
            <ChevronDown />
          </Icon>
        </LayerButton>
      )}
      {isOpen && (
        <ul className="map-legend">
          {mapLayers &&
            mapLayers
              .filter(({ isEmbedded }) => (isPrintOrEmbedView ? isEmbedded : true)) // Only include the embedded layers when in certain views
              .map((mapLayer, mapLayerIndex) => {
                const layerIsChecked = mapLayer.isVisible
                const layerIsIndeterminate =
                  mapLayer.legendItems.some(({ isVisible }) => !isVisible) && layerIsChecked

                const hasLegendItems = mapLayer.legendItems.length > 0

                return (
                  <li
                    className="map-legend__map-layer"
                    // eslint-disable-next-line react/no-array-index-key
                    key={mapLayerIndex}
                  >
                    <div
                      className={`
                    map-legend__category
                    map-legend__category--${
                      !hasLegendItems &&
                      mapLayer.legendItems.some((legendItem) => legendItem.notSelectable)
                        ? 'un'
                        : ''
                    }selectable-legend
                  `}
                    >
                      <StyledLabel key={mapLayer.id} htmlFor={mapLayer.id} label={mapLayer.title}>
                        <>
                          {!hasLegendItems ? (
                            <div
                              className={`
                            map-legend__image
                            map-legend__image--selectable
                          `}
                            >
                              <img
                                alt={mapLayer.title}
                                src={constructLegendIconUrl(mapLayer, mapLayer)}
                              />
                            </div>
                          ) : null}
                          <StyledCheckbox
                            id={mapLayer.id}
                            className="checkbox"
                            variant="tertiary"
                            checked={layerIsChecked}
                            indeterminate={layerIsIndeterminate}
                            name={mapLayer.title}
                            onChange={
                              /* istanbul ignore next */
                              (e) => {
                                // Sometimes we dont want the active maplayers to be deleted from the query parameters in the url
                                if (isPrintOrEmbedView || layerIsIndeterminate) {
                                  return mapLayer.legendItems.length > 0 &&
                                    mapLayer.legendItems.some(({ id }) => id !== null)
                                    ? mapLayer.legendItems
                                        .filter(({ isVisible }) =>
                                          layerIsIndeterminate ? !isVisible : true,
                                        )
                                        .forEach(({ id }) => {
                                          onLayerVisibilityToggle(
                                            id,
                                            layerIsIndeterminate ? false : !e.currentTarget.checked,
                                          )
                                        })
                                    : onLayerVisibilityToggle(mapLayer.id, !e.currentTarget.checked)
                                }
                                return handleLayerToggle(e.currentTarget.checked, mapLayer)
                              }
                            }
                          />
                        </>
                      </StyledLabel>
                    </div>
                    {!isAuthorised(mapLayer, user) && (
                      <div className="map-legend__notification">
                        <span>
                          <LoginLinkContainer linkType="blank">
                            Zichtbaar na inloggen
                          </LoginLinkContainer>
                        </span>
                      </div>
                    )}
                    {isAuthorised(mapLayer, user) && !isInsideZoomLevel(mapLayer, zoomLevel) && (
                      <div className="map-legend__notification">
                        <span>
                          {`Zichtbaar bij verder ${
                            zoomLevel < mapLayer.minZoom ? 'inzoomen' : 'uitzoomen'
                          }`}
                        </span>
                      </div>
                    )}
                    {isAuthorised(mapLayer, user) &&
                      layerIsChecked &&
                      isInsideZoomLevel(mapLayer, zoomLevel) &&
                      !mapLayer.disabled && (
                        <ul className="map-legend__items">
                          {hasLegendItems
                            ? mapLayer.legendItems.map((legendItem, legendItemIndex) => {
                                const legendItemIsVisible = legendItem.isVisible
                                const LegendLabel = !legendItem.notSelectable
                                  ? StyledLabel
                                  : NonSelectableLegendParagraph
                                return !legendItemIsVisible && printMode ? null : (
                                  <li
                                    className="map-legend__item"
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={legendItemIndex}
                                  >
                                    <LegendLabel
                                      key={legendItem.id}
                                      htmlFor={legendItem.id}
                                      label={legendItem.title}
                                    >
                                      <div
                                        className={`
                            map-legend__image
                            map-legend__image--${
                              legendItem.notSelectable ? 'not-selectable' : 'selectable'
                            }
                          `}
                                      >
                                        <img
                                          alt={legendItem.title}
                                          src={constructLegendIconUrl(mapLayer, legendItem)}
                                        />
                                      </div>
                                      {!legendItem.notSelectable ? (
                                        <StyledCheckbox
                                          id={legendItem.id}
                                          className="checkbox"
                                          variant="tertiary"
                                          checked={legendItemIsVisible}
                                          name={legendItem.title}
                                          onChange={
                                            /* istanbul ignore next */
                                            () =>
                                              onLayerVisibilityToggle(
                                                legendItem.id,
                                                legendItemIsVisible,
                                              )
                                          }
                                        />
                                      ) : (
                                        legendItem.title
                                      )}
                                    </LegendLabel>
                                  </li>
                                )
                              })
                            : null}
                        </ul>
                      )}
                  </li>
                )
              })}
        </ul>
      )}
    </>
  )
}

export default MapLegend
