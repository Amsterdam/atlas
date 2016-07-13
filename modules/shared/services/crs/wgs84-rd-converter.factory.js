(function () {
  'use strict';

  angular
    .module('dpShared')
    .factory('wgs84RdConverter', wgs84RdConverterFactory);

  wgs84RdConverterFactory.$inject = ['CRS_CONFIG', 'proj4'];

  function wgs84RdConverterFactory (CRS_CONFIG, proj4) {


    return{
      wgs84ToRd: wgs84ToRd,
      rdToWgs84: rdToWgs84
    };

    /*
     * @params {Array} wgs84 - An array with this structure: [x,y]
     * let op x is lon (4.xxx) en y is lat (52.xxx)
     *
     * @returns {Array} - RD - An array with this structure: [x,y]
     */
    function wgs84ToRd(coordinates){
      return proj4(CRS_CONFIG.RD.projection, coordinates);
    }

    /*
     * @params {Array} RD - An array with this structure: [x,y]
     *
     * @returns {Array} wgs84 - An An array with this structure: [x,y]
     * let op x is lon (4.xxx) en y is lat (52.xxx)
     */
    function rdToWgs84(coordinates){
      return proj4(CRS_CONFIG.RD.projection, CRS_CONFIG.WGS84.projection, coordinates);
    }
  }
})();
