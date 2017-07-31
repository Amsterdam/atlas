describe('The dp-logout-button component', () => {
    var $compile,
        $rootScope,
        authenticator;

    beforeEach(() => {
        angular.mock.module('dpHeader');

        angular.mock.inject((_$compile_, _$rootScope_, _authenticator_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            authenticator = _authenticator_;
        });
    });

    function getComponent () {
        var component,
            element,
            scope;

        element = document.createElement('dp-logout-button');

        scope = $rootScope.$new();
        component = $compile(element)(scope);
        scope.$digest();

        return component;
    }

    it('logs the user out when clicking the button', () => {
        var component;

        spyOn(authenticator, 'logout');

        component = getComponent();
        component.find('button').click();

        expect(authenticator.logout).toHaveBeenCalled();
    });
});
