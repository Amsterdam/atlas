import { FunctionComponent } from 'react'
import { getIframeUrl } from '../../../shared/services/embed-url/embed-url'

const a = <div />

const EmbedIframeComponent: FunctionComponent = () => (
  <iframe
    title="Grote kaart - Data en informatie - Amsterdam"
    id="atlas-iframe-map"
    className="c-embed-iframe"
    width="500"
    height="400"
    src={getIframeUrl()}
    frameBorder="0"
  />
)

export default EmbedIframeComponent