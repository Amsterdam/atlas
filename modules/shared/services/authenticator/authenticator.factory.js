(function () {
    'use strict';

    angular
        .module('dpShared')
        .factory('authenticator', authenticatorFactory);

    authenticatorFactory.$inject = [
        '$http',
        '$interval',
        'sharedConfig',
        'user',
        '$window',
        '$location',
        'storage'
    ];

    function authenticatorFactory (
        $http,
        $interval,
        sharedConfig,
        user,
        $window,
        $location,
        storage) {
        const ERROR_MESSAGES = {
            400: 'Verplichte parameter is niet aanwezig.',
            404: 'Er is iets mis met de inlog server, probeer het later nog eens.',
            502: 'Probleem in de communicatie met de inlog server.',
            504: 'Inlog server timeout, probeer het later nog eens.'
        };

        const AUTH_PARAMS = ['a-select-server', 'aselect_credentials', 'rid'];

        const AUTH_PATH = 'auth';

        const CALLBACK_PARAMS = 'callback';   // save callback params in session storage

        const REFRESH_INTERVAL = 1000 * 60 * 4.5;   // every 4.5 minutes

        const STATE = {     // State transitions used in tokenLoop
            INIT: () =>
                STATE.RESTORE_REFRESH_TOKEN,
            RESTORE_REFRESH_TOKEN: () =>
                user.getRefreshToken() ? STATE.REQUEST_ACCESS_TOKEN : STATE.WAIT,
            ON_REFRESH_TOKEN: () =>
                STATE.REQUEST_ACCESS_TOKEN,
            ON_REFRESH_TOKEN_ERROR: () =>
                STATE.WAIT,
            REQUEST_ACCESS_TOKEN: () =>
                requestAccessToken(user.getRefreshToken()),
            ON_ACCESS_TOKEN: () =>
                tokenLoop(STATE.REQUEST_ACCESS_TOKEN, REFRESH_INTERVAL),
            ON_ACCESS_TOKEN_ERROR: () =>
                STATE.WAIT,
            ON_LOGOUT: () =>
                STATE.WAIT,
            WAITING: () =>
                null // Wait for re-invocation of the tokenLoop...
        };

        let interval;   // refresh access token

        let error = {}; // message, status and statusText

        return {
            initialize,
            login,
            logout,
            isCallback,
            handleCallback,
            error
        };

        function tokenLoop (state, delay) {
            if (delay) {    // invoke tokenLoop after delay has passed
                interval = $interval(() => tokenLoop(state), delay, 1); // $timeout will fail with protractor tests
                return STATE.WAITING;
            } else if (interval) {  // cancel any existing delayed execution, eg when logout is called
                $interval.cancel(interval);
            }

            while (state) {
                state = state();    // simple keep executing state transitions
            }
        }

        function initialize () {
            setError();
            tokenLoop(STATE.INIT);
        }

        function onRefreshToken (token, userType) {
            setError();
            user.setRefreshToken(token, userType);
            tokenLoop(STATE.ON_REFRESH_TOKEN);
        }

        function onRefreshTokenError (response) {
            onError(response, STATE.ON_REFRESH_TOKEN_ERROR);
        }

        function onAccessToken (token) {
            setError();
            user.setAccessToken(token);
            tokenLoop(STATE.ON_ACCESS_TOKEN);
        }

        function onAccessTokenError (response) {
            onError(response, STATE.ON_ACCESS_TOKEN_ERROR);
        }

        function logout () {
            user.clearToken();
            tokenLoop(STATE.ON_LOGOUT);
        }

        function onError (response, state) {
            user.clearToken();
            setError(
                ERROR_MESSAGES[response.status] ||
                'Er is een fout opgetreden. Neem contact op met de beheerder en vermeld ' +
                'code: ${response.status}, status: ${response.statusText}.',
                response.status,
                response.statusText);
            tokenLoop(state);
        }

        function setError (message, status, statusText) {
            error.message = message || '';
            error.status = status || null;
            error.statusText = statusText || '';
        }

        function login () {     // redirect to external authentication provider
            let url = $location.absUrl().replace(/\#\?.*$/, '').concat('#');
            storage.session.setItem(CALLBACK_PARAMS, angular.toJson($location.search()));
            $window.location.href =
                sharedConfig.API_ROOT + AUTH_PATH +
                '/siam/authenticate?active=true&callback=' + encodeURIComponent(url);
        }

        function isCallback (params) {
            // it is a callback when all authorization parameters are defined in the params
            // the fastest check is not to check if all parameters are defined but
            // to check that no undefined parameter can be found
            return !AUTH_PARAMS.find(key => angular.isUndefined(params[key]));
        }

        function handleCallback (params) {  // request user token with returned authorization parameters from callback
            return requestRefreshToken(params).finally(() => {
                // Return params without authorization parameters (includes also language, sorry)
                let newParams = storage.session.getItem(CALLBACK_PARAMS);
                newParams = newParams ? angular.fromJson(newParams) : {};
                storage.session.removeItem(CALLBACK_PARAMS);
                $location.replace();    // overwrite the existing location (prevent back button to re-login)
                $location.search(newParams);
            });
        }

        function requestRefreshToken (params) {    // initiated externally, called by handleCallback
            let httpParams = AUTH_PARAMS.reduce((result, key) => {
                result[key] = params[key];
                return result;
            }, {});
            return authRequest('/siam/token', {}, httpParams)
                .then(response => onRefreshToken(response.data, user.USER_TYPE.AUTHENTICATED), onRefreshTokenError);
        }

        function requestAccessToken (token) {   // initiated by tokenLoop, return WAITING
            authRequest('/accesstoken', {'Authorization': sharedConfig.AUTH_HEADER_PREFIX + token})
                .then(response => onAccessToken(response.data), onAccessTokenError);
            return STATE.WAITING;
        }

        function authRequest (url, headers, params) {
            return $http({
                method: 'GET',
                url: sharedConfig.API_ROOT + AUTH_PATH + url,
                headers: angular.merge({'Content-Type': 'text/plain'}, headers),
                params: params
            });
        }
    }
})();
