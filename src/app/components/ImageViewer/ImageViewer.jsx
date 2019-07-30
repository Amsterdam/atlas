import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import OpenSeadragon from 'openseadragon'
import PropTypes from 'prop-types'
import { IconButton } from '@datapunt/asc-ui'
import { Close, Enlarge, Minimise } from '@datapunt/asc-assets'
import ViewerControls from '../ViewerControls/ViewerControls'
import { setCurrentFile } from '../../../shared/ducks/files/actions'
import SHARED_CONFIG from '../../../shared/services/shared-config/shared-config'
import './ImageViewer.scss'

const ImageViewer = ({ resetFileName, fileName, title, contextMenu }) => {
  const viewerRef = React.createRef()
  const [viewer, setViewerInstance] = React.useState(null)

  React.useEffect(() => {
    // Todo: retrieve the document title from the filename (filter)
    OpenSeadragon({
      element: viewerRef.current,
      preserveViewport: true,
      visibilityRatio: 1.0,
      minZoomLevel: 0,
      defaultZoomLevel: 0,
      sequenceMode: true,
      showNavigationControl: false,
      showSequenceControl: false,
      tileSources: [`${SHARED_CONFIG.IIIF_ROOT}iiif/2/edepot:${fileName}/info.json`],
    }).addHandler('open', ({ eventSource }) => {
      setViewerInstance(eventSource)
    })
  }, [])

  const zoomIn = () => {
    viewer.viewport.zoomBy(1.5)
  }

  const zoomOut = () => {
    const targetZoomLevel = viewer.viewport.getZoom() - 1
    const newZoomLevel = targetZoomLevel < 1 ? 1 : targetZoomLevel
    viewer.viewport.zoomTo(newZoomLevel)
  }

  return (
    <React.Fragment>
      <div ref={viewerRef} className="c-image-viewer" />
      {viewer && (
        <ViewerControls
          metaData={[title, fileName]}
          topRightComponent={
            <IconButton
              title="Bouwtekening sluiten"
              size={32}
              iconSize={15}
              onClick={resetFileName}
            >
              <Close />
            </IconButton>
          }
          bottomRightComponent={
            <div>
              <IconButton title="Inzoomen" size={32} iconSize={12} onClick={zoomIn}>
                <Enlarge />
              </IconButton>
              <IconButton title="Uitzoomen" size={32} iconSize={12} onClick={zoomOut}>
                <Minimise />
              </IconButton>
            </div>
          }
          bottomLeftComponent={contextMenu}
        />
      )}
    </React.Fragment>
  )
}

ImageViewer.defaultProps = {
  fileName: '',
  title: '',
  contextMenu: null,
}

ImageViewer.propTypes = {
  fileName: PropTypes.string,
  title: PropTypes.string,
  resetFileName: PropTypes.func.isRequired,
  contextMenu: PropTypes.node,
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      resetFileName: () => setCurrentFile(''),
    },
    dispatch,
  )

export default connect(
  null,
  mapDispatchToProps,
)(ImageViewer)
