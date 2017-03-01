describe('The api factory', function () {
    var $http,
        $httpBackend,
        $q,
        api,
        mockedApiData,
        isLoggedIn;

    beforeEach(function () {
        angular.mock.module(
            'dpShared',
            {
                user: {
                    getAccessToken: () => isLoggedIn ? 'MY_FAKE_ACCESS_TOKEN' : null
                }
            },
            function ($provide) {
                $provide.constant('API_CONFIG', {
                    ROOT: 'http://www.i-am-the-api-root.com/path/',
                    AUTH_HEADER_PREFIX: 'Bearer '
                });
            }
        );

        angular.mock.inject(function (_$http_, _$httpBackend_, _$q_, _api_) {
            $http = _$http_;
            $httpBackend = _$httpBackend_;
            $q = _$q_;
            api = _api_;
        });

        mockedApiData = {
            id: 1,
            title: 'This is a fake title'
        };

        $httpBackend.whenGET('http://www.i-am-the-api-root.com/path/bag/verblijfsobject/123/').respond(mockedApiData);

        isLoggedIn = false;
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('getByUrl returns the data as a promise', function () {
        var returnValue;

        api.getByUrl('http://www.i-am-the-api-root.com/path/bag/verblijfsobject/123/').then(function (data) {
            returnValue = data;
        });

        $httpBackend.flush();

        expect(returnValue).toEqual(mockedApiData);
    });

    it('getByUrl optionally accepts a promise to allow for cancelling the request', function () {
        let cancel = $q.defer();

        api.getByUrl('http://www.i-am-the-api-root.com/path/bag/verblijfsobject/123/', undefined, cancel)
            .then(function () {
                fail();   // Should never be resolved
            });

        cancel.resolve();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('getByUrl optionally accepts a promise, rejects the promise when the request is not cancelled', function () {
        var returnValue;
        let cancel = $q.defer();

        api.getByUrl('http://www.i-am-the-api-root.com/path/bag/verblijfsobject/123/', undefined, cancel)
            .then(function (data) {
                returnValue = data;
            });

        let isRejected = false;
        cancel.promise.then(angular.noop, () => isRejected = true);

        $httpBackend.flush();

        expect(returnValue).toEqual(mockedApiData);
        expect(isRejected).toBe(true);
    });

    it('getByUri can be used when the API_CONFIG.ROOT is unknown', function () {
        var returnValue;

        api.getByUri('bag/verblijfsobject/123/').then(function (data) {
            returnValue = data;
        });

        $httpBackend.flush();

        expect(returnValue).toEqual(mockedApiData);
    });

    it('adds an Authorization header if the user is logged in', function () {
        // Not logged in
        isLoggedIn = false;

        $httpBackend.expectGET(
            'http://www.i-am-the-api-root.com/path/bag/verblijfsobject/123/',
            $http.defaults.headers.common
        );
        api.getByUrl('http://www.i-am-the-api-root.com/path/bag/verblijfsobject/123/');
        $httpBackend.flush();

        // Logged in
        isLoggedIn = true;

        $httpBackend.expectGET(
            'http://www.i-am-the-api-root.com/path/bag/verblijfsobject/123/',
            angular.merge({}, $http.defaults.headers.common, {Authorization: 'JWT MY_FAKE_ACCESS_TOKEN'})
        );
        api.getByUrl('http://www.i-am-the-api-root.com/path/bag/verblijfsobject/123/');
        $httpBackend.flush();
    });
});
