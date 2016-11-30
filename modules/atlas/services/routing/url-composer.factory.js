(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('urlComposer', urlComposerFactory)
        .constant('URL_COMPRESSION', ['AB', '62', 'LZ']);    // ['AB', '62', 'LZ']

    urlComposerFactory.$inject = [
        'URL_COMPRESSION',
        'URL_ABBREVIATIONS',
        'dpStringCompressor',
        'dpBaseCoder',
        'dpAbbreviator'];

    function urlComposerFactory (
        URL_COMPRESSION,
        URL_ABBREVIATIONS,
        dpStringCompressor,
        dpBaseCoder,
        dpAbbreviator) {
        /**
         * the names of the object propertis that may contain a coordinate "x.n"
         * @type {string[]}
         */
        const COORDINATES = ['lat', 'lon'];

        /**
         * The object properties that may contain locations "x.n,y.m"
         * @type {string[]}
         */
        const LOCATIONS = ['straatbeeld'];

        /**
         * he number of decimals to use when compressing coordinates and locations
         * @type {number}
         */
        const LOCATION_PRECISION = 7;

        /**
         * Base 62 en/decode
         */
        let base62Coder = dpBaseCoder.getCoderForBase(62);

        /**
         * Object abbreviator using the abbreviations as specified by URL_ABBREVIATIONS
         */
        let abbreviator = dpAbbreviator.getAbbreviatorForAbbreviations(URL_ABBREVIATIONS);

        return {
            getQueryString,
            compressParams,
            decompressParams
        };

        /**
         * Returns the url query string for a specific state.
         *
         * @param {Object} params     the state parameters to be transformed
         * @returns {string} the query string
         */
        function getQueryString (params) {
            let queryString = '';

            compressParams(params);
            Object.keys(params).forEach(key => {
                if (angular.isDefined(params[key]) && params[key] !== null) {
                    queryString += queryString ? '&' : '?';
                    queryString += `${key}=${params[key]}`;
                }
            });

            return '#' + queryString;
        }

        /**
         * Compresses the state parameters. The properties and keys of the params object are changed or compressed
         * as specified by the URL_COMPRESSION constant. The V property of the params object is set to allow for
         * future decompression.
         * NOTE: the manipulation of the params object instead of returning a new params object is necessary
         * to prevent endless $location.search loops.
         * This can be reproduced by hevaing compressParams return a angular.copy and decompress also
         * This no-op behaviour results in an endless loop. No further research why.
         * @param {Object} params the state parameters to be compressed
         * @returns {Object}  the updated params object is returned
         */
        function compressParams (params) {
            if (URL_COMPRESSION.length > 0) {
                let urlCompression = URL_COMPRESSION;
                URL_COMPRESSION.forEach(compressor => {
                    let C;
                    switch (compressor) {
                        case 'LZ':
                            Object.keys(params).forEach(key => {
                                let val = params[key];
                                if (angular.isUndefined(val) || val === null) {
                                    delete params[key];
                                }
                            });
                            C = dpStringCompressor.compressFromObject(params);
                            Object.keys(params).forEach(key => delete params[key]);
                            params.C = C;
                            break;
                        case '62':
                            COORDINATES.forEach(key => {
                                if (angular.isString(params[key])) {
                                    params[key] = base62Coder.encodeFromString(params[key], LOCATION_PRECISION);
                                }
                            });
                            LOCATIONS.forEach(key => {
                                if (angular.isString(params[key])) {
                                    params[key] = params[key]
                                        .split(',')
                                        .map(c => base62Coder.encodeFromString(c, LOCATION_PRECISION))
                                        .join(',');
                                }
                            });
                            break;
                        case 'AB':
                            abbreviator.abbreviate(params);
                            break;
                        default:
                            urlCompression = urlCompression.filter(c => c !== compressor);
                            break;
                    }
                });
                if (urlCompression.length > 0) {
                    params.V = urlCompression.join(',');
                }
            }
            return params;
        }

        /**
         * Decompresses the state parameters. The properties and keys of the params object are decompressed
         * as specified by the V property of the params object.
         * @param {Object} params the state parameters to be decompressed
         * @returns {Object}  the decompressed params object is returned
         */
        function decompressParams (params) {
            if (params.V) {
                let urlCompression = params.V.split(',').reverse(); // decompress in reverse order
                delete params.V;
                urlCompression.forEach(compressor => {
                    let contents;
                    switch (compressor) {
                        case 'LZ':
                            contents = dpStringCompressor.decompressToObject(params.C);
                            delete params.C;
                            Object.keys(contents).forEach(key => params[key] = contents[key]);
                            break;
                        case '62':
                            COORDINATES.forEach(key => {
                                if (angular.isString(params[key])) {
                                    params[key] = base62Coder.decode(params[key], LOCATION_PRECISION);
                                }
                            });
                            LOCATIONS.forEach(key => {
                                if (angular.isString(params[key])) {
                                    params[key] = params[key]
                                        .split(',')
                                        .map(s => base62Coder.decode(s, LOCATION_PRECISION))
                                        .join(',');
                                }
                            });
                            break;
                        case 'AB':
                            abbreviator.deabbreviate(params);
                            break;
                        default:
                            break;
                    }
                });
            }
            return params;
        }
    }
})();
