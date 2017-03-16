describe('The http error registrar', function () {
    const httpStatus = {
        SERVER_ERROR: 'SERVER_ERROR',
        NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
        registerError: angular.noop
    };
    let $httpBackend,
        $http,
        $rootScope,
        mockedData,
        onError,
        callbackCalled;

    beforeEach(function () {
        onError = null;
        const window = {
            addEventListener: function (type, func) {
                if (type === 'error') {
                    onError = func;
                }
            }
        };

        angular.mock.module('dpShared', { httpStatus });

        angular.mock.module(function ($provide) {
            $provide.value('$window', window);
        });

        angular.mock.inject(function (_$httpBackend_, _$http_, _$rootScope_) {
            $httpBackend = _$httpBackend_;
            $http = _$http_;
            $rootScope = _$rootScope_;
        });

        mockedData = {
            Key: 'Value'
        };
        callbackCalled = false;

        $httpBackend
            .whenGET('http://api-domain.amsterdam.nl/200')
            .respond(200, mockedData);

        $httpBackend
            .whenGET('http://api-domain.amsterdam.nl/300')
            .respond(300, mockedData);

        $httpBackend
            .whenGET('http://api-domain.amsterdam.nl/400')
            .respond(400, mockedData);

        $httpBackend
            .whenGET('http://api-domain.amsterdam.nl/500')
            .respond(500, mockedData);

        $httpBackend
            .whenGET('http://api-domain.amsterdam.nl/-1')
            .respond(-1, mockedData);

        spyOn(httpStatus, 'registerError');
    });

    it('does not handle normal responses and requests', function () {
        $http
            .get('http://api-domain.amsterdam.nl/200')
            .then(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(200);
                expect(httpStatus.registerError).not.toHaveBeenCalled();
                callbackCalled = true;
            });

        $httpBackend.flush();
        expect(callbackCalled).toBe(true);
    });

    it('does not handle response errors outside of the 400 and 500 ranges', function () {
        $http
            .get('http://api-domain.amsterdam.nl/300')
            .catch(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(300);
                expect(httpStatus.registerError).not.toHaveBeenCalled();
                callbackCalled = true;
            });

        $httpBackend.flush();
        expect(callbackCalled).toBe(true);
    });

    it('does not handle client error responses and requests', function () {
        $http
            .get('http://api-domain.amsterdam.nl/400')
            .catch(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(400);
                expect(httpStatus.registerError).not.toHaveBeenCalled();
                callbackCalled = true;
            });

        $httpBackend.flush();
        expect(callbackCalled).toBe(true);
    });

    it('does handle 404 errors with the correct body', function () {
        mockedData = {
            detail: 'Not found.'
        };

        $httpBackend
            .whenGET('http://api-domain.amsterdam.nl/404')
            .respond(404, mockedData);

        $http
            .get('http://api-domain.amsterdam.nl/404')
            .catch(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(404);
                expect(httpStatus.registerError).toHaveBeenCalledWith(httpStatus.NOT_FOUND_ERROR);
                callbackCalled = true;
            });

        $httpBackend.flush();
        expect(callbackCalled).toBe(true);
    });

    it('does not handle 404 errors without the correct body', function () {
        mockedData = {};

        $httpBackend
            .whenGET('http://api-domain.amsterdam.nl/404')
            .respond(404, mockedData);

        $http
            .get('http://api-domain.amsterdam.nl/404')
            .catch(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(404);
                expect(httpStatus.registerError).not.toHaveBeenCalled();
                callbackCalled = true;
            });

        $httpBackend.flush();
        expect(callbackCalled).toBe(true);
    });

    it('registers all http server error responses, leaves content untouched', function () {
        $http
            .get('http://api-domain.amsterdam.nl/500')
            .catch(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(500);
                expect(httpStatus.registerError).toHaveBeenCalledWith(httpStatus.SERVER_ERROR);
                callbackCalled = true;
            });

        $httpBackend.flush();
        expect(callbackCalled).toBe(true);
    });

    it('registers url load errors by listening to window error events', function () {
        // onError is the window error event listener (see mock of $window)
        // If called with an event that contains a target src url it will issue a server error

        onError({});    // without target src url
        expect(httpStatus.registerError).not.toHaveBeenCalledWith(httpStatus.SERVER_ERROR);

        onError({
            target: {
                src: 'aap'
            }
        }); // with target src url
        $rootScope.$digest();
        expect(httpStatus.registerError).toHaveBeenCalledWith(httpStatus.SERVER_ERROR);
    });

    it('registers http server error -1 for non-cancellable responses, leaves content untouched', function () {
        $http({
            method: 'GET',
            url: 'http://api-domain.amsterdam.nl/-1'
        }).catch(data => {
            expect(data.data).toEqual(mockedData);
            expect(data.status).toBe(-1);
            expect(httpStatus.registerError).toHaveBeenCalledWith(httpStatus.SERVER_ERROR);
            callbackCalled = true;
        });

        $httpBackend.flush();
        expect(callbackCalled).toBe(true);
    });

    it('registers http server error -1 for non-cancelled responses, leaves content untouched', function () {
        $http({
            method: 'GET',
            url: 'http://api-domain.amsterdam.nl/-1',
            timeout: {
                then: (resolve, reject) => {
                    if (angular.isFunction(reject)) {
                        reject();
                    }
                }
            }})
            .catch(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(-1);
                expect(httpStatus.registerError).toHaveBeenCalledWith(httpStatus.SERVER_ERROR);
                callbackCalled = true;
            });

        $httpBackend.flush();
        expect(callbackCalled).toBe(true);
    });

    it('skips http server error -1 for cancelled responses, leaves content untouched', function () {
        $http({
            method: 'GET',
            url: 'http://api-domain.amsterdam.nl/-1',
            timeout: {
                then: angular.noop
            }})
            .catch(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(-1);
                expect(httpStatus.registerError).not.toHaveBeenCalled();
                callbackCalled = true;
            });

        $httpBackend.flush();
        expect(callbackCalled).toBe(true);
    });
});
