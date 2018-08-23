// For now simply import everything we need, from here
import './state';
import './map/wrappers/map/MapWrapper';
import './detail/wrappers/DetailGrondexploitatieGraphTotalsWrapper';
import './detail/wrappers/DetailGrondexploitatieGraphPhasedWrapper';
import './header/wrappers/header-search/HeaderSearchWrapper';
import './homepage/wrappers/address-block/HomepageAddressBlockWrapper';

// All third party dependencies
import './vendor';

// Legacy sass
import '../modules/shared/shared.scss';
import '../modules/atlas/atlas.scss';
import '../modules/data-selection/data-selection.scss';
import '../modules/detail/detail.scss';
import '../modules/header/header.scss';
import '../modules/page/page.scss';
import '../modules/search-results/search-results.scss';
import '../modules/straatbeeld/straatbeeld.scss';

// New style sass
import './_styles.scss';

// Import this here, because `modules/atlas/services/redux%reducer.factory`
// cannoct do, because that would break the grunt build...
import detailReducer from './reducers/details'; // eslint-disable-line
import userReducer from './reducers/user'; // eslint-disable-line

// All our modules' javascript
import '../modules/atlas/atlas.module';
import '../modules/atlas/atlas.run';
import '../modules/atlas/atlas.version.webpack';
import '../modules/atlas/components/dashboard/dashboard-columns.factory';
import '../modules/atlas/components/dashboard/dashboard.component';
import '../modules/atlas/components/dashboard/wrappers/map-wrapper/map-wrapper.component';
import '../modules/atlas/components/dashboard/synchronisation/data-selection.controller';
import '../modules/atlas/components/dashboard/synchronisation/detail.controller';
import '../modules/atlas/components/dashboard/synchronisation/header.controller';
import '../modules/atlas/components/dashboard/synchronisation/map.controller';
import '../modules/atlas/components/dashboard/synchronisation/page.controller';
import '../modules/atlas/components/dashboard/synchronisation/search-results.controller';
import '../modules/atlas/components/dashboard/synchronisation/straatbeeld.controller';
import '../modules/atlas/components/document-title/document-title.directive';
import '../modules/atlas/components/max-width-class/max-width-class.directive';
import '../modules/atlas/components/preview-state/preview-state.directive';
import '../modules/atlas/components/scrollable-content/scrollable-content.directive';
import '../modules/atlas/services/freeze/freeze.factory';
import '../modules/atlas/services/piwik/piwik-config.constant';
import '../modules/atlas/services/piwik/piwik.factory';
import '../modules/atlas/services/piwik/piwik.run';
import '../modules/atlas/services/redux/middleware/context-middleware.factory';
import '../modules/atlas/services/redux/middleware/state-to-url-middleware.factory';
import '../modules/atlas/services/redux/deprecated-reducer.factory';
import '../modules/atlas/services/redux/reducer.factory';
import '../modules/atlas/services/redux/reducers/data-selection-reducers.factory';
import '../modules/atlas/services/redux/reducers/filters-reducers.factory';
import '../modules/atlas/services/redux/reducers/home-reducers.factory';
import '../modules/atlas/services/redux/reducers/page-reducers.factory';
import '../modules/atlas/services/redux/reducers/search-reducers.factory';
import '../modules/atlas/services/redux/reducers/straatbeeld-reducers.factory';
import '../modules/atlas/services/redux/reducers/url-reducers.factory';
import '../modules/atlas/services/redux/store.run';
import '../modules/atlas/services/routing/state-to-url.factory';
import '../modules/atlas/services/routing/state-url-conversion.factory';
import '../modules/atlas/services/routing/state-url-converter.factory';
import '../modules/atlas/services/routing/url-to-state.factory';
import '../modules/atlas/services/routing/url-to-state.run';
import '../modules/data-selection/data-selection.module';
import '../modules/data-selection/components/active-filters/active-filters.component';
import '../modules/data-selection/components/available-filters/available-filters.component';
import '../modules/data-selection/components/sbi-filter/sbi-filter.component';
import '../modules/data-selection/components/data-selection/data-selection.component';
import '../modules/data-selection/components/formatter/aggregate/aggregate.filter';
import '../modules/data-selection/components/formatter/align-right/align-right.filter';
import '../modules/data-selection/components/formatter/bag-address/bag-address.filter';
import '../modules/data-selection/components/formatter/formatter.component';
import '../modules/data-selection/components/formatter/hr-bezoekadres/hr-bezoekadres.filter';
import '../modules/data-selection/components/formatter/modification-date/modification-date.filter';
import '../modules/data-selection/components/formatter/nevenadres/nevenadres.filter';
import '../modules/data-selection/components/formatter/nummeraanduiding-type/nummeraanduiding-type.filter';
import '../modules/data-selection/components/formatter/truncate-html-as-text/truncate-html-as-text.filter';
import '../modules/data-selection/components/formatter/verblijfsobject-gevormd/verblijfsobject-gevormd.filter';
import '../modules/data-selection/components/formatter/zip-code/zip-code.filter';
import '../modules/data-selection/components/header/download-button/download-button.component';
import '../modules/data-selection/components/header/header.component';
import '../modules/data-selection/components/header/toggle-view-button/toggle-view-button.component';
import '../modules/data-selection/components/pagination/pagination-link.component';
import '../modules/data-selection/components/pagination/pagination.component';
import '../modules/data-selection/components/views/catalog/catalog.component';
import '../modules/data-selection/components/views/list/list.component';
import '../modules/data-selection/components/views/table/table.component';
import '../modules/data-selection/data-selection-config.constant';
import '../modules/data-selection/services/api/data-selection-api-brk.factory';
import '../modules/data-selection/services/api/data-selection-api-dcatd.factory';
import '../modules/data-selection/services/api/data-selection-api-data-selection.factory';
import '../modules/data-selection/services/api/data-selection-api.factory';
import '../modules/data-selection/services/api/data-selection-api.run';
import '../modules/data-selection/services/document-title/document-title.factory';
import '../modules/detail/detail.module';
import '../modules/detail/components/api-call/api-call.component';
import '../modules/detail/components/bbga-graphs/bbga-config.constant';
import '../modules/detail/components/bbga-graphs/bbga-data.factory';
import '../modules/detail/components/bbga-graphs/bbga-graphs.directive';
import '../modules/detail/components/bbga-graphs/tevredenheid/bbga-tevredenheid-config.constant';
import '../modules/detail/components/bbga-graphs/tevredenheid/bbga-tevredenheid.component';
import '../modules/detail/components/current-date/current-date.directive';
import '../modules/detail/components/data-selection-links/data-selection-links.component';
import '../modules/detail/components/date/date.filter';
import '../modules/detail/components/detail/detail.component';
import '../modules/detail/components/detail/follow-link/follow-link.directive';
import '../modules/detail/components/detail/templates/grondexploitatie/graph-totals/grondexploitatie-graph-totals.component';
import '../modules/detail/components/detail/templates/grondexploitatie/graph-phased/grondexploitatie-graph-phased.component';
import '../modules/detail/components/filename/filename.filter';
import '../modules/detail/components/option-label/option-label.filter';
import '../modules/detail/components/glossary/glossary.constant';
import '../modules/detail/components/glossary/header/glossary-header.directive';
import '../modules/detail/components/glossary/meta/glossary-meta.directive';
import '../modules/detail/components/meetbouten-graph/meetbouten-graph.directive';
import '../modules/detail/components/parent-relations/parent-relations.constant';
import '../modules/detail/components/parent-relations/parent-relations.directive';
import '../modules/detail/components/partial-select/partial-compiler.factory';
import '../modules/detail/components/partial-select/partial-select.directive';
import '../modules/detail/components/time-period/time-period.filter';
import '../modules/detail/components/wkpb-link/wkpb-link.component';
import '../modules/detail/components/yes-no/yes-no.filter';
import '../modules/detail/detail.vendor';
import '../modules/detail/services/data-formatter/data-formatter.factory';
import '../modules/detail/services/date-converter/date-converter.factory';
import '../modules/detail/services/date-formatter/date-formatter.factory';
import '../modules/detail/services/document-title/document-title.factory';
import '../modules/detail/services/endpoint-parser/endpoint-parser.factory';
import '../modules/detail/services/geometry/geometry.factory';
import '../modules/header/header.module';
import '../modules/header/components/embed-header/embed-header.component';
import '../modules/header/components/logo/logo.component';
import '../modules/header/components/logout-button/logout-button.component';
import '../modules/header/components/menu/dropdown/menu-dropdown.directive';
import '../modules/header/components/menu/menu.component';
import '../modules/header/components/print-button/print-button.component';
import '../modules/header/components/print-header/print-header.component';
import '../modules/header/components/site-header/site-header.component';
import '../modules/header/components/terugmelden-button/terugmelden-button.component';
import '../modules/header/header-config.constant';
import '../modules/header/header.constant';
import '../modules/page/page.module';
import '../modules/page/components/homepage/catalogus-themes/catalogus-themes-config.constant';
import '../modules/page/components/homepage/catalogus-themes/catalogus-themes.component';
import '../modules/page/components/homepage/homepage-config.constant';
import '../modules/page/components/homepage/homepage.component';
import '../modules/page/components/metadata/metadata.component';
import '../modules/page/components/page-name/page-name.filter';
import '../modules/page/components/page/page.component';
import '../modules/page/components/user-content-widget/user-content-widget.component';
import '../modules/page/page-config.constant';
import '../modules/page/services/document-title/document-title.factory';
import '../modules/page/services/page-name/page-name.factory';
import '../modules/search-results/search-results.module';
import '../modules/search-results/components/search-results/categories/search-results-categories.component';
import '../modules/search-results/components/search-results/header/search-results-header.component';
import '../modules/search-results/components/search-results/list/search-results-list.component';
import '../modules/search-results/components/search-results/search-results.component';
import '../modules/search-results/search-config.constant';
import '../modules/search-results/services/document-title/document-title.factory';
import '../modules/search-results/services/geosearch/geosearch-formatter.factory';
import '../modules/search-results/services/geosearch/geosearch.factory';
import '../modules/search-results/services/search-title/search-title.factory';
import '../modules/search-results/services/search/search-formatter.factory';
import '../modules/search-results/services/search/search.factory';
import '../modules/search-results/services/search/search.run';
import '../modules/shared/shared.module';
import '../modules/shared/components/anchor-link/anchor-link.component';
import '../modules/shared/components/anchor-link/anchor-link.constant';
import '../modules/shared/components/anchor-link/anchor-link.run';
import '../modules/shared/components/api-error/api-error.component';
import '../modules/shared/components/coordinates/coordinates.filter';
import '../modules/shared/components/dcatd-button/dcatd-button.component';
import '../modules/shared/components/expand-collapse/expand-collapse.directive';
import '../modules/shared/components/link-to-page/link-to-page.component';
import '../modules/shared/components/link/link.component';
import '../modules/shared/components/loading-indicator/loading-indicator.component';
import '../modules/shared/components/long-name-shortener/long-name-config.constant';
import '../modules/shared/components/long-name-shortener/long-name-shortener.filter';
import '../modules/shared/components/message/message.component';
import '../modules/shared/components/panel/panel.component';
import '../modules/shared/components/straatbeeld-thumbnail/straatbeeld-thumbnail.component';
import '../modules/shared/components/tab-header/tab-header.component';
import '../modules/shared/components/tab-header/tab-header.constant';
import '../modules/shared/components/tab-header/tab-header.factory';
import '../modules/shared/components/uppercase-first-letter/uppercase-first-letter.filter';
import '../modules/shared/components/video/video.component';
import '../modules/shared/filters/filesize.filter';
import '../modules/shared/services/active-overlays/active-overlays.factory';
import '../modules/shared/services/api/api.factory';
import '../modules/shared/services/base-coder/base-coder.factory';
import '../modules/shared/services/bounding-box/boundig-box.constant';
import '../modules/shared/services/crs/crs-config.constant';
import '../modules/shared/services/crs/crs-converter.factory';
import '../modules/shared/services/embed/embed.factory';
import '../modules/shared/services/environment/environment.factory';
import '../modules/shared/services/geojson/geojson.factory';
import '../modules/shared/services/google-sheet/google-sheet.constants';
import '../modules/shared/services/google-sheet/google-sheet.factory';
import '../modules/shared/services/window-error-handler/window-error-handler.factory';
import '../modules/shared/services/window-error-handler/window-error-handler.run';
import '../modules/shared/services/http-error-registrar/http-error-registrar.factory';
import '../modules/shared/services/http-error-registrar/http-status.factory';
import '../modules/shared/services/localization/localization.factory';
import '../modules/shared/services/markdown-parser/markdown-parser.factory';
import '../modules/shared/services/redux/actions.constant';
import '../modules/shared/services/redux/application-state.factory';
import '../modules/shared/services/redux/store.factory';
import '../modules/shared/services/storage/instance-storage.factory';
import '../modules/shared/services/storage/storage.factory';
import '../modules/shared/services/uri-stripper/uri-stripper.factory';
import '../modules/shared/services/user-settings/setting.factory';
import '../modules/shared/services/user-settings/user-settings.constant';
import '../modules/shared/services/user-settings/user-settings.factory';
import '../modules/shared/shared-config.factory';
import '../modules/shared/shared.vendor';
import '../modules/shared/services/combined-document-title/combined-document-title.factory';
import '../modules/straatbeeld/straatbeeld.module';
import '../modules/straatbeeld/components/history/history.directive';
import '../modules/straatbeeld/components/hotspot/hotspot.component';
import '../modules/straatbeeld/components/hotspot/hotspot.factory';
import '../modules/straatbeeld/components/hotspot/touch/hotspot-touch.directive';
import '../modules/straatbeeld/components/status-bar/status-bar.component';
import '../modules/straatbeeld/components/straatbeeld/straatbeeld.directive';
import '../modules/straatbeeld/components/toggle-straatbeeld-fullscreen/toggle-straatbeeld-fullscreen.component';
import '../modules/straatbeeld/services/document-title/document-title.factory';
import '../modules/straatbeeld/services/marzipano/marzipano.factory';
import '../modules/straatbeeld/services/orientation/orientation.factory';
import '../modules/straatbeeld/services/straatbeeld-api/straatbeeld-api.factory';
import '../modules/straatbeeld/straatbeeld-config.constant';
import '../modules/straatbeeld/straatbeeld.vendor';
