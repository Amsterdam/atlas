describe('The anchorLink component', function () {
    let $compile,
        $rootScope,
        $interval,
        anchor;

    beforeEach(function () {
        anchor = null;

        angular.mock.module('dpShared',
            $provide => {
                $provide.constant('$anchorScroll', value => anchor = value);
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _$interval_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $interval = _$interval_;
        });
    });

    function getComponent (link, className, autoScroll = false) {
        const element = document.createElement('dp-anchor-link');
        element.setAttribute('link', link);
        element.setAttribute('class-name', className);
        element.setAttribute('auto-scroll', 'autoScroll');

        const scope = $rootScope.$new();
        scope.autoScroll = autoScroll;

        element.innerText = 'Transcluded text';

        const component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('accepts an optional classname', function () {
        const component = getComponent('', 'some className');
        expect(component.find('.qa-anchor-link').attr('class')).toContain('some className');
    });

    it('transcludes content', function () {
        const component = getComponent('a link', 'some className');
        expect(component.find('.qa-anchor-link').text()).toBe('Transcluded text');
    });

    it('can scroll to the specified link (bookmark)', function () {
        const component = getComponent('a link');
        component.find('.qa-anchor-link').click();
        $interval.flush(9999999);
        expect(anchor).toBe('a link');
    });

    it('can auto scroll to the specified link (bookmark)', function () {
        getComponent('a link', '', true);
        $rootScope.$apply();
        $interval.flush(9999999);
        expect(anchor).toBe('a link');
    });
});
