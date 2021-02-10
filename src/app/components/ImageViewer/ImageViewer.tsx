/* eslint-disable no-nested-ternary */
import { Close, Download, Enlarge, Minimise } from '@amsterdam/asc-assets'
import { Button, themeColor } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import OpenSeadragon, { Viewer } from 'openseadragon'
import { createRef, FunctionComponent, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import getState from '../../../shared/services/redux/get-state'
import useDownload from '../../utils/useDownload'
import { ConstructionFiles as ContextMenu } from '../ContextMenu'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import ViewerControls from '../ViewerControls/ViewerControls'

const ImageViewerContainer = styled.div<{ printMode: boolean }>`
  background-color: ${themeColor('tint', 'level5')};
  color: transparent; // Hides error messages as they can't be hidden programmatically
  height: 100%;
  width: 100%;

  ${({ printMode }) =>
    printMode &&
    css`
      height: calc(
        100vh - 188px
      ); // Height of the printheader as defined in Angular (to be deprecated)
    `}
`

type ImageViewerProps = {
  fileName: string
  title: string
  fileUrl: string
  handleResetFile: () => void
  printMode: boolean
}

const ImageViewer: FunctionComponent<ImageViewerProps> = ({
  handleResetFile,
  fileName,
  fileUrl,
  title,
  printMode,
}) => {
  const viewerRef = createRef<HTMLDivElement>()
  const [viewerInstance, setViewerInstance] = useState<Viewer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [downloadLoading, downloadFile] = useDownload()
  const { trackEvent } = useMatomo()

  const { accessToken } = getState().user

  const fileExtension = fileName.split('.').pop()
  const isImage = !!fileExtension?.toLowerCase().match(/(jpg|jpeg|png|gif)/)

  useEffect(() => {
    const viewer = OpenSeadragon({
      element: viewerRef.current || undefined,
      preserveViewport: true,
      visibilityRatio: 1.0,
      minZoomLevel: 0,
      defaultZoomLevel: 0,
      sequenceMode: true,
      showNavigationControl: false,
      showSequenceControl: false,
      loadTilesWithAjax: true,
      ajaxHeaders: {
        authorization: `Bearer ${accessToken || ''}`,
      },
      tileSources: [`${fileUrl}/info.json`],
    })

    setViewerInstance(viewer)

    if (viewer)
      viewer.addHandler('open', () => {
        setLoading(false)
      })

    if (viewer)
      viewer.addHandler('open-failed', () => {
        setLoading(false)
        setError(true)
      })
  }, [])

  const zoomIn = () => {
    if (viewerInstance) viewerInstance.viewport.zoomBy(1.5)
  }

  const zoomOut = () => {
    const targetZoomLevel = viewerInstance?.viewport ? viewerInstance.viewport.getZoom() - 1 : 1
    const newZoomLevel = targetZoomLevel < 1 ? 1 : targetZoomLevel

    if (viewerInstance) viewerInstance.viewport.zoomTo(newZoomLevel)
  }

  const handleDownload = (imageUrl: string, size: string) => {
    downloadFile(
      imageUrl,
      {
        method: 'get',
        headers: new Headers({
          Authorization: `Bearer ${accessToken}`,
        }),
      },
      fileName,
    )
    trackEvent({
      category: 'download-bouwtekening',
      action: `bouwtekening-download-${size}`,
      name: fileName,
    })
  }

  const CloseButton = () => (
    <Button
      type="button"
      variant="blank"
      title="Bestand sluiten"
      size={32}
      icon={<Close />}
      iconSize={15}
      onClick={handleResetFile}
    />
  )

  return (
    <>
      <ImageViewerContainer ref={viewerRef} printMode={printMode} />

      {!loading && !error ? (
        <ViewerControls
          metaData={[title, fileName]}
          topRightComponent={<CloseButton />}
          bottomRightComponent={
            <div>
              <Button
                type="button"
                variant="blank"
                title="Inzoomen"
                size={32}
                iconSize={12}
                onClick={zoomIn}
                icon={<Enlarge />}
              />
              <Button
                type="button"
                variant="blank"
                title="Uitzoomen"
                size={32}
                iconSize={12}
                onClick={zoomOut}
                icon={<Minimise />}
              />
            </div>
          }
          bottomLeftComponent={
            <ContextMenu
              handleDownload={handleDownload}
              downloadLoading={downloadLoading}
              fileUrl={fileUrl}
              isImage={isImage}
            />
          }
        />
      ) : !loading && error ? (
        <>
          <ErrorMessage
            absolute
            message={
              isImage
                ? 'Er is een fout opgetreden bij het laden van dit bestand.'
                : 'Dit bestandsformaat kan niet worden weergegeven op deze pagina.'
            }
            buttonLabel={isImage ? 'Probeer opnieuw' : `Download bronbestand`}
            buttonIcon={!isImage && <Download />}
            buttonOnClick={
              isImage
                ? () => window.location.reload()
                : () =>
                    handleDownload(
                      `${fileUrl}?source_file=true`, // If the file is not an image the source file should be downloadable
                      'origineel',
                    )
            }
          />
          <ViewerControls metaData={[title, fileName]} topRightComponent={<CloseButton />} />
        </>
      ) : null}
    </>
  )
}

export default ImageViewer
