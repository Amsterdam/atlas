const mapBaseLayers = require('../../../public/static/map/map-base-layers.config.json')

async function fetchMap(resolver, query) {
  const result = await fetch(process.env.GRAPHQL_ENDPOINT, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
    }),
  })

  const json = await result.json()

  return json.data[resolver]
}

export function getMapBaseLayers() {
  return mapBaseLayers
}

export async function getMapLayers() {
  const query = `{ mapLayerSearch(input: { limit: 9999 }) { results { id title url params layers external detailUrl detailItem detailIsShape noDetail authScope type } } }`
  const { results: mapLayerResults } = await fetchMap('mapLayerSearch', query)

  return mapLayerResults
}

export async function getPanelLayers() {
  const query = `{ mapCollectionSearch(input: { limit: 9999 }) { results { id title mapLayers { id title legendItems { id title url params layers iconUrl imageRule notSelectable noDetail } authScope imageRule iconUrl url params layers detailUrl detailItem detailIsShape type noDetail minZoom maxZoom } } } }`
  const { results: mapPanelLayerResults } = await fetchMap('mapCollectionSearch', query)

  return mapPanelLayerResults
}
