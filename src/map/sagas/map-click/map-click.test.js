import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { composeProviders } from 'redux-saga-test-plan/providers';

import watchMapClick, { goToGeoSearch, switchClickAction } from './map-click';
import {
  getActiveMapLayers,
  getLayers,
  getMapPanelLayers
} from '../../ducks/panel-layers/map-panel-layers';
import { getPanoramaHistory } from '../../../panorama/ducks/selectors';
import { SET_MAP_CLICK_LOCATION } from '../../ducks/map/map';
import { getMapZoom, getMapView } from '../../ducks/map/map-selectors';
import { REQUEST_NEAREST_DETAILS } from '../geosearch/geosearch';
import { getSelectionType, SELECTION_TYPE } from '../../../shared/ducks/selection/selection';
import { getImageDataByLocation } from '../../../panorama/services/panorama-api/panorama-api';
import { getPage } from '../../../store/redux-first-router/selectors';
import { getView as getDataSearchView, getView } from '../../../shared/ducks/data-search/selectors';
import { getView as getDetailView } from '../../../shared/ducks/detail/selectors';
import { getDataSelectionView } from '../../../shared/ducks/data-selection/selectors';

describe('watchMapClick', () => {
  const action = { type: SET_MAP_CLICK_LOCATION };

  it('should watch "SET_MAP_CLICK_LOCATION" and call switchClickAction', () => {
    testSaga(watchMapClick)
      .next()
      .takeLatestEffect(SET_MAP_CLICK_LOCATION, switchClickAction)
      .next(action)
      .isDone();
  });
});

describe('switchClickAction', () => {
  const payload = {
    location: {
      latitude: 52.11,
      longitude: 4.11
    }
  };

  const mockMapLayers = [
    {
      id: 'kot',
      url: 'maps/brk?service=wms',
      layers: [
        'kadastraal_object',
        'kadastraal_object_label'
      ],
      detailUrl: 'geosearch/search/',
      detailItem: 'kadastraal_object',
      detailIsShape: true
    }
  ];

  const mockPanelLayers = [
    {
      category: 'Geografie: onroerende zaken',
      maxZoom: 16,
      minZoom: 8,
      legendItems: [
        { id: 'bgem', notClickable: true }
      ],
      notClickable: true,
      title: 'Kadastrale perceelsgrenzen',
      url: '/maps/brk?version=1.3.0&service=WMS'
    },
    {
      category: 'Verkeer en infrastructuur',
      id: 'pv',
      notClickable: true,
      layers: ['alle_parkeervakken'],
      legendItems: [
        {
          selectable: false,
          title: 'FISCAAL'
        }
      ],
      maxZoom: 16,
      minZoom: 10,
      title: 'Parkeervakken - Fiscale indeling',
      url: '/maps/parkeervakken?version=1.3.0&service=WMS'
    }
  ];

  const matchingPanelLayer = {
    id: 'kot',
    maxZoom: 16,
    minZoom: 8,
    legendItems: [
      { id: 'kot', notClickable: true }
    ],
    notClickable: true,
    title: 'Kadastrale perceelsgrenzen',
    url: '/maps/brk?version=1.3.0&service=WMS'
  };

  const mapPanelLayersWithSelection = [...mockPanelLayers, matchingPanelLayer];

  const providePage = ({ selector }, next) => (selector === getPage ? null : next());
  const provideView = ({ selector }, next) => (selector === getView ? null : next());
  const provideDataSearchView = ({ selector }, next) =>
    (selector === getDataSearchView ? null : next());
  const provideDetailView = ({ selector }, next) => (selector === getDetailView ? null : next());
  const provideDataSelectionView = ({ selector }, next) => (selector === getDataSelectionView ?
    null :
    next()
  );

  const provideMapLayers = ({ selector }, next) => (
    selector === getActiveMapLayers ||
    selector === getLayers
      ? mockMapLayers : next()
  );

  const provideMapZoom = ({ selector }, next) => (
    selector === getMapZoom ? 8 : next()
  );

  const provideMapView = ({ selector }, next) => (
    selector === getMapView ? 'kaart' : next()
  );

  const provideSelectionTypePoint = ({ selector }, next) => (
    selector === getSelectionType ? SELECTION_TYPE.POINT : next()
  );

  const provideSelectionTypePanorama = ({ selector }, next) => (
    selector === getSelectionType ? SELECTION_TYPE.PANORAMA : next()
  );

  it('should dispatch the REQUEST_NEAREST_DETAILS when the panorama is not enabled', () => {
    const provideMapPanelLayers = ({ selector }, next) => (
      selector === getMapPanelLayers ? mapPanelLayersWithSelection : next()
    );
    return expectSaga(switchClickAction, { payload })
      .provide({
        select: composeProviders(
          providePage,
          provideDataSearchView,
          provideDataSelectionView,
          provideDetailView,
          provideView,
          provideMapLayers,
          provideMapZoom,
          provideMapView,
          provideMapPanelLayers,
          provideSelectionTypePoint
        )
      })
      .put({
        type: REQUEST_NEAREST_DETAILS,
        payload: {
          location: payload.location,
          layers: [...mockMapLayers],
          zoom: 8,
          view: 'kaart'
        }
      })
      .run();
  });

  it('should dispatch setGeolocation when the panorama is not enabled and there is no panelLayer found ', () => {
    const provideMapPanelLayers = ({ selector }, next) => (
      selector === getActiveMapLayers ||
      selector === getLayers
        ? [] : next()
    );

    return expectSaga(switchClickAction, { payload })
      .provide({
        select: composeProviders(
          providePage,
          provideDataSearchView,
          provideDataSelectionView,
          provideDetailView,
          provideView,
          provideMapZoom,
          provideMapView,
          provideMapPanelLayers,
          provideSelectionTypePoint
        )
      })
      .call(goToGeoSearch, payload.location)
      .run();
  });

  it('should get panorama by location when in pano mode', () => {
    const provideCallGetImageDataByLocation = ({ fn }, next) => {
      if (fn === getImageDataByLocation) {
        return {
          id: '123',
          location: Object.keys(payload.location).map((key) => payload.location[key])
        };
      }
      return next();
    };

    const provideSelectPanoramaHistory = ({ selector }, next) => (
      selector === getPanoramaHistory
        ? { year: 2018, missionType: 'woz' } : next()
    );

    return expectSaga(switchClickAction, { payload })
      .provide({
        select: composeProviders(
          provideSelectionTypePanorama,
          provideSelectPanoramaHistory
        ),
        call: provideCallGetImageDataByLocation
      })
      .run();
  });
});
