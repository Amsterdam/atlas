import { toHome } from '../../store/redux-first-router/actions'

export const REDUCER_KEY = 'panorama'
export const FETCH_PANORAMA_REQUEST = `${REDUCER_KEY}/FETCH_PANORAMA_REQUEST`
export const FETCH_PANORAMA_SUCCESS = `${REDUCER_KEY}/FETCH_PANORAMA_SUCCESS`
export const FETCH_PANORAMA_ERROR = `${REDUCER_KEY}/FETCH_PANORAMA_ERROR`
export const SET_PANORAMA_ORIENTATION = `${REDUCER_KEY}/SET_PANORAMA_ORIENTATION`
export const SET_PANORAMA_LOCATION = `${REDUCER_KEY}/SET_PANORAMA_LOCATION`
export const CLOSE_PANORAMA = `${REDUCER_KEY}/CLOSE_PANORAMA`
export const FETCH_PANORAMA_HOTSPOT_REQUEST = `${REDUCER_KEY}/FETCH_PANORAMA_HOTSPOT_REQUEST`
export const SET_PANORAMA_TAGS = `${REDUCER_KEY}/FETCH_PANORAMA_REQUEST_TOGGLE`
export const FETCH_PANORAMA_REQUEST_EXTERNAL = `${REDUCER_KEY}/FETCH_PANORAMA_REQUEST_EXTERNAL`

// Getting the pano mapLayers from the state directly can lead to error as these are loaded async, therefore these are
// harcoded here for now until state-management is handled more efficiently with GraphQL
export const PANO_LABELS = [
  {
    id: 'pano',
    layer: {
      id: 'panobi',
      legendItems: [
        { id: 'pano-pano2020bi', selectable: true },
        { id: 'pano-pano2019bi', selectable: true },
        { id: 'pano-pano2018bi', selectable: true },
        { id: 'pano-pano2017bi', selectable: true },
        { id: 'pano-pano2016bi', selectable: true },
      ],
    },
    label: 'Meest recent',
    tags: ['mission-bi'],
  },
  {
    id: 'pano2020bi',
    layer: {
      id: 'panobi',
      legendItems: [{ id: 'pano-pano2020bi', selectable: true }],
    },
    label: 'Alleen 2020',
    tags: ['mission-bi', 'mission-2020'],
  },
  {
    id: 'pano2019bi',
    layer: {
      id: 'panobi',
      legendItems: [{ id: 'pano-pano2019bi', selectable: true }],
    },
    label: 'Alleen 2019',
    tags: ['mission-bi', 'mission-2019'],
  },
  {
    id: 'pano2018bi',
    layer: {
      id: 'panobi',
      legendItems: [{ id: 'pano-pano2018bi', selectable: true }],
    },
    label: 'Alleen 2018',
    tags: ['mission-bi', 'mission-2018'],
  },
  {
    id: 'pano2017bi',
    layer: {
      id: 'panobi',
      legendItems: [{ id: 'pano-pano2017bi', selectable: true }],
    },
    label: 'Alleen 2017',
    tags: ['mission-bi', 'mission-2017'],
  },
  {
    id: 'pano2016bi',
    layer: {
      id: 'panobi',
      legendItems: [{ id: 'pano-pano2016bi', selectable: true }],
    },
    label: 'Alleen 2016',
    tags: ['mission-bi', 'mission-2016'],
  },
  {
    id: 'pano2020woz',
    layer: {
      id: 'panowoz',
      legendItems: [{ id: 'pano-pano2020woz', selectable: true }],
    },
    label: 'Alleen 2020 WOZ',
    tags: ['mission-woz', 'mission-2020'],
  },
  {
    id: 'pano2019woz',
    layer: {
      id: 'panowoz',
      legendItems: [{ id: 'pano-pano2019woz', selectable: true }],
    },
    label: 'Alleen 2019 WOZ',
    tags: ['mission-woz', 'mission-2019'],
  },
  {
    id: 'pano2018woz',
    layer: {
      id: 'panowoz',
      legendItems: [{ id: 'pano-pano2018woz', selectable: true }],
    },
    label: 'Alleen 2018 WOZ',
    tags: ['mission-woz', 'mission-2018'],
  },
  {
    id: 'pano2017woz',
    layer: {
      id: 'panowoz',
      legendItems: [{ id: 'pano-pano2017woz', selectable: true }],
    },
    label: 'Alleen 2017 WOZ',
    tags: ['mission-woz', 'mission-2017'],
  },
]

export const initialState = {
  location: null, // eg: [52.8, 4.9]
  tags: PANO_LABELS[0].tags,
  targetLocation: null,
  pitch: 0, // eg: -10
  heading: 0, // eg: 270
  fov: null, // eg: 65
  image: null, // eg: {
  //     pattern: 'http://www.example.com/path/some-id/{this}/{that}/{thingie}.jpg',
  //     preview: 'http://www.example.com/path/some-id/preview.jpg'
  // }
  hotspots: [], // eg: [{id: 'ABC124', heading: 90, distance: 18}],
  date: null, // eg: new Date()
  isLoading: true,
  detailReference: [],
  pageReference: '',
}

export const PAGE_REFS = {
  HOME: 'home',
}

export const PAGE_REF_MAPPING = {
  [PAGE_REFS.HOME]: toHome,
}
