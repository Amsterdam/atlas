import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'querystring'

import styled from '@datapunt/asc-core'
import { Checkbox, Label, themeSpacing } from '@datapunt/asc-ui'
import MAP_CONFIG from '../../services/map.config'

import './_map-legend-variant-one.scss'
import LoginLinkContainer from '../../../app/components/Links/LoginLink/LoginLinkContainer'

const isAuthorised = (layer, user) =>
  !layer.authScope || (user.authenticated && user.scopes.includes(layer.authScope))

const isInsideZoomLevel = (layer, zoomLevel) =>
  zoomLevel >= layer.minZoom && zoomLevel <= layer.maxZoom

const StyledLabel = styled(Label)`
  width: 100%;
`
const StyledCheckbox = styled(Checkbox)`
  padding: 0px;
  padding-right: ${themeSpacing(2)};
`

class MapLegendVariantOne extends React.Component {
  static constructLegendIconUrl(mapLayer, legendItem) {
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

  determineLayerVisibility(mapLayer) {
    const { overlays } = this.props
    return overlays.some((overlay) =>
      [{ id: mapLayer.id }, ...mapLayer.legendItems].some(
        (legendItem) => overlay.id === legendItem.id && overlay.isVisible,
      ),
    )
  }

  determineLegendItemVisibility(legendItem) {
    const { overlays } = this.props
    return overlays.some(
      (overlay) => (overlay.id === legendItem.id && overlay.isVisible) || legendItem.notSelectable,
    )
  }

  toggleLayerVisibility(mapLayer, isVisible) {
    const { onLayerVisibilityToggle } = this.props

    // When the legendItems itself are selectable, the legendItems can be toggled on/off individually
    return mapLayer.legendItems?.some(({ notSelectable }) => !notSelectable)
      ? mapLayer.legendItems.map((legendItem) => onLayerVisibilityToggle(legendItem.id, isVisible))
      : onLayerVisibilityToggle(mapLayer.id, isVisible)
  }

  render() {
    const {
      activeMapLayers,
      onLayerVisibilityToggle,
      user,
      zoomLevel,
      printMode,
      onLayerToggle,
    } = this.props

    return (
      <div>
        <h3 className="u-sr-only">Actieve kaartlagen</h3>
        <ul className="map-legend--variant-one">
          {activeMapLayers &&
            activeMapLayers.map((mapLayer, mapLayerIndex) => {
              const layerIsVisible = this.determineLayerVisibility(mapLayer)

              // If there are no legend items, the layer itself will be used as legend item as the current design does not support one-level map layers
              const legendItems =
                mapLayer?.legendItems?.length > 0 ? mapLayer.legendItems : [mapLayer]

              return (
                <li
                  className="map-legend--variant-one__map-layer"
                  // eslint-disable-next-line react/no-array-index-key
                  key={mapLayerIndex}
                >
                  <div
                    className={`
                    map-legend--variant-one__category
                    map-legend--variant-one__category--${
                      mapLayer.legendItems?.some((legendItem) => legendItem.notSelectable)
                        ? 'un'
                        : ''
                    }selectable-legend
                  `}
                  >
                    <StyledLabel key={mapLayer.id} htmlFor={mapLayer.id} label={mapLayer.title}>
                      <StyledCheckbox
                        id={mapLayer.id}
                        className="checkbox"
                        variant="tertiary"
                        checked={layerIsVisible}
                        name={mapLayer.title}
                        onChange={
                          /* istanbul ignore next */
                          () => onLayerToggle(mapLayer)
                        }
                      />
                    </StyledLabel>
                  </div>
                  {!isAuthorised(mapLayer, user) && (
                    <div className="map-legend--variant-one__notification">
                      <span>
                        <LoginLinkContainer linkType="blank">
                          Zichtbaar na inloggen
                        </LoginLinkContainer>
                      </span>
                    </div>
                  )}
                  {isAuthorised(mapLayer, user) && !isInsideZoomLevel(mapLayer, zoomLevel) && (
                    <div className="map-legend--variant-one__notification">
                      <span>
                        {`Zichtbaar bij verder ${
                          zoomLevel < mapLayer.minZoom ? 'inzoomen' : 'uitzoomen'
                        }`}
                      </span>
                    </div>
                  )}
                  {isAuthorised(mapLayer, user) &&
                    layerIsVisible &&
                    isInsideZoomLevel(mapLayer, zoomLevel) &&
                    !mapLayer.disabled && (
                      <ul className="map-legend--variant-one__items">
                        {legendItems.map((legendItem, legendItemIndex) => {
                          const legendItemIsVisible = this.determineLegendItemVisibility(legendItem)
                          return !legendItemIsVisible && printMode ? null : (
                            <li
                              className="map-legend--variant-one__item"
                              // eslint-disable-next-line react/no-array-index-key
                              key={legendItemIndex}
                            >
                              {!legendItem.notSelectable && (
                                <StyledLabel
                                  key={legendItem.id}
                                  htmlFor={legendItem.id}
                                  label={legendItem.title}
                                >
                                  <div
                                    className={`
                            map-legend--variant-one__image
                            map-legend--variant-one__image--${
                              legendItem.notSelectable ? 'not-selectable' : 'selectable'
                            }
                          `}
                                  >
                                    <img
                                      alt=""
                                      src={MapLegendVariantOne.constructLegendIconUrl(
                                        mapLayer,
                                        legendItem,
                                      )}
                                    />
                                  </div>
                                  <StyledCheckbox
                                    id={legendItem.id}
                                    className="checkbox"
                                    variant="tertiary"
                                    checked={legendItemIsVisible}
                                    name={legendItem.title}
                                    onChange={
                                      /* istanbul ignore next */
                                      () =>
                                        onLayerVisibilityToggle(legendItem.id, legendItemIsVisible)
                                    }
                                  />
                                </StyledLabel>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    )}
                </li>
              )
            })}
        </ul>
      </div>
    )
  }
}

MapLegendVariantOne.propTypes = {
  activeMapLayers: PropTypes.array, // eslint-disable-line
  onLayerToggle: PropTypes.func, // eslint-disable-line
  printMode: PropTypes.bool.isRequired,
  onLayerVisibilityToggle: PropTypes.func, // eslint-disable-line
  overlays: PropTypes.array, // eslint-disable-line
  user: PropTypes.object, // eslint-disable-line
  zoomLevel: PropTypes.number.isRequired,
}

export default MapLegendVariantOne
