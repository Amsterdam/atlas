import { routing } from '../../../../src/app/routes'
import PARAMETERS from '../../../../src/store/parameters'

const { VIEW, VIEW_CENTER, LEGEND, ZOOM, LOCATION } = PARAMETERS

const urls = {
  address: `${routing.data.path}bag/verblijfsobject/id03630000749400?${LEGEND}=false&${ZOOM}=16`,
  business: `${
    routing.data.path
  }brk/object/idNL.KAD.OnroerendeZaak.11460857510001?${LEGEND}=false&${ZOOM}=16`,
  gemeentelijkeBeperking: `${routing.data.path}wkpb/beperking/id1006388`,
  geoSearch: `${routing.data.path}geozoek?${LOCATION}=52.3736166%2C4.8943521`,
  ligplaats: `${routing.data.path}bag/ligplaats/id03630001025735`,
  maatschappelijkeActiviteit: `${routing.data.path}handelsregister/maatschappelijkeactiviteit/id01029509`,
  map: `${routing.data.path}?${VIEW_CENTER}=52.3731081%2C4.8932945&${VIEW}=kaart&${LEGEND}=false`,
  monument: `${routing.data.path}monumenten/monumenten/idc115314a-59d4-4574-bfe9-1f7df5cb20c4`,
  monumentComplex: `${
    routing.data.path
  }monumenten/complexen/id182a9861-4052-4127-8300-6450cd75b6a5`,
  natuurlijk: `${routing.data.path}brk/subject/idNL.KAD.Persoon.171720901`,
  nietNatuurlijk: `${routing.data.path}brk/subject/idNL.KAD.Persoon.423186718`,
  pand: `${routing.data.path}bag/pand/id0363100012168052`,
  parkeervak: `${routing.data.path}parkeervakken/parkeervakken/id121403487278/`,
  standplaats: `${routing.data.path}bag/standplaats/id03630000691684`,
  vestiging: `${routing.data.path}handelsregister/vestiging/id000003579875/?modus=gesplitst`,
  vestigingenTabel: `${
    routing.data.path
  }hr/vestigingen?${VIEW}=volledig&${LEGEND}=false&${ZOOM}=11`,
}

const queries = {
  autoSuggestHeader: '.qa-auto-suggest-header',
  headerTitle: '.o-header__title',
  headerSubTitle: '.o-header__subtitle',
  infoNotification: '.notification--info',
  keyValueList: '.c-key-value-list',
  legendItem: '.map-legend__title',
  legendNotification: '.map-legend__notification',
  legendToggleItem: '.map-layers__toggle-title',
  listItem: 'li',
  mapLayersCategory: '.map-layers__category',
  mapDetailResultHeaderSubTitle: '.map-detail-result__header-subtitle',
  mapDetailResultItem: '.map-detail-result__item',
  mapSearchResultsCategoryHeader: '.map-search-results-category__header',
  natuurlijkPersoon: 'dl.qa-natuurlijk-persoon',
  nietNatuurlijkPersoon: 'dl.qa-niet-natuurlijk-persoon',
  searchHeader: '.qa-search-header',
  warningPanel: '.notification--info',
  warningPanelAngular: '.c-panel--warning',
}

const values = {
  aantekeningen: 'Aantekeningen',
  bedrijvenInvloedsgebieden: 'Bedrijven - Invloedsgebieden',
  beschrijving: 'Beschrijving',
  documentnaam: 'Documentnaam',
  economieEnHaven: 'Economie en haven',
  geografie: 'Geografie',
  kadastraleSubjecten: 'Kadastrale subjecten',
  legendCafeValue: 'Café',
  legendPermissionNotification: 'Zichtbaar na inloggen',
  ligplaatsVestigingName: 'alac',
  maatschappelijkeActiviteitName: 'om B',
  maatschappelijkeActiviteitVestigingName: 'om B',
  pandVestigingName: 'ller',
  redengevendeOmschrijving: 'Redengevende omschrijving',
  standplaatsVestigingName: 'us B',
  parkeervakId: '121403487278',
  type: 'Type',
  vestigingName: 'om B',
  vestigingen: 'Vestigingen',
  vestigingenHoreca: 'Vestigingen - Horeca',
  zakelijkeRechten: 'Zakelijke rechten',
}

export { queries, urls, values }
