describe('The http interceptor', function () {
    let $httpBackend,
        $http,
        httpStatus,
        mockedData;

    beforeEach(function () {
        angular.mock.module('dpShared');

        angular.mock.inject(function (_$httpBackend_, _$http_, _httpStatus_) {
            $httpBackend = _$httpBackend_;
            $http = _$http_;
            httpStatus = _httpStatus_;
        });

        mockedData = {
            Key: 'Value'
        };

        $httpBackend
            .whenGET('http://api-domain.com/path')
            .respond(200, mockedData);

        $httpBackend
            .whenGET('http://api-domain.com/pathError')
            .respond(404, mockedData);
    });

    it('does not handle normal responses and requests', function () {
        $http
            .get('http://api-domain.com/path')
            .then(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(200);
                expect(httpStatus.status.hasErrors).toBe(false);
            });
        $httpBackend.flush();
    });

    it('registers all http error responses, leaves content untouched', function () {
        $http
            .get('http://api-domain.com/pathError')
            .then(data => {
                expect(data.data).toEqual(mockedData);
                expect(data.status).toBe(404);
                expect(httpStatus.status.hasErrors).toBe(true);
            });
        $httpBackend.flush();
    });
});
