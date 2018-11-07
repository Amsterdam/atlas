import mockedContentJson from './catalog.component.test.content.json';
import { routing } from '../../../../../src/app/routes';
import * as detail from '../../../../../src/shared/ducks/detail/detail';

describe('The catalog component', function () {
    'use strict';

    let $rootScope,
        $compile,
        $window,
        origSessionStorage;

    const mockedContent =
        mockedContentJson['dcat:dataset'].map(item => {
            return {
                ...item,
                _links: {
                    self: 'endpoint'
                }
            };
        })
        ;

    const mockedOptionLabelFilter = () => 'label';

    beforeEach(function () {
        angular.mock.module('dpDataSelection', {},
            function ($provide) {
                $provide.value('optionLabelFilter', mockedOptionLabelFilter);
            }
        );

        angular.mock.inject(function (_$rootScope_, _$compile_, _$window_) {
            $rootScope = _$rootScope_;
            $compile = _$compile_;
            $window = _$window_;
        });

        origSessionStorage = $window.sessionStorage;
        $window.sessionStorage = {
            setItem: angular.noop
        };

        spyOn($window.sessionStorage, 'setItem');
    });

    afterEach(() => {
        $window.sessionStorage = origSessionStorage;
    });

    function getComponent () {
        const element = document.createElement('dp-data-selection-catalog');
        element.setAttribute('catalogFilters', 'catalogFilters');
        element.setAttribute('content', 'content');

        const scope = $rootScope.$new();
        scope.catalogFilters = {
            formatTypes: [{}],
            serviceTypes: [{}],
            distributionTypes: [{}]
        };
        scope.content = mockedContent;

        const component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('sets the redirect url', () => {
        getComponent();

        expect($window.sessionStorage.setItem)
            .toHaveBeenCalledWith('DCATD_LIST_REDIRECT_URL', jasmine.any(String));
    });

    it('can load a detail page for a catalog', function () {
        detail.fetchDetail = () => 'fetchDetail';

        const component = getComponent();
        const scope = component.isolateScope();
        const link = component.find('.qa-catalog-fetch-detail')[0];

        const id = mockedContentJson['dcat:dataset'][0]['dct:identifier'];
        expect(link).toHaveAttr('to', 'row.linkTo');
        expect(scope.vm.items[0].linkTo).toEqual({
            type: routing.datasetsDetail.type,
            payload: { id }
        });
    });
});
