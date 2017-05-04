describe('The dp-toggle-drawing-tool component', function () {
    var $compile,
        $rootScope,
        component,
        drawTool;

    beforeEach(function () {
        angular.mock.module(
            'dpMap',
            {
                store: {
                    dispatch: angular.noop
                },
                drawTool: {
                    isEnabled: angular.noop,
                    enable: angular.noop,
                    disable: angular.noop,
                    getHasDrawnPolygon: angular.noop,
                    shape: {
                        markers: [],
                        markersMaxCount: 5
                    },
                    setPolygon: angular.noop
                }
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _drawTool_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            drawTool = _drawTool_;
        });

        spyOn(drawTool, 'enable');
        spyOn(drawTool, 'disable');
    });

    function getComponent () {
        var result,
            element,
            scope;

        element = document.createElement('dp-toggle-drawing-tool');
        scope = $rootScope.$new();
        result = $compile(element)(scope);
        scope.$apply();

        return result;
    }

    describe('when inactive', function () {
        beforeEach(function () {
            spyOn(drawTool, 'isEnabled').and.returnValue(false);
            component = getComponent();
        });

        it('shows the button in default state', function () {
            expect(component.find('.qa-button').length).toBe(1);
            expect(component.find('.qa-button').attr('class')).toContain('c-toggle-drawing-tool');
            expect(component.find('.qa-button').attr('title')).toBe('Begin meten en intekenen');
        });

        it('enables draw/edit mode when clicking the button', function () {
            component.find('.qa-button').click();
            expect(drawTool.enable).toHaveBeenCalled();
        });

        it('enables draw/edit mode when clicking the button', function () {
            drawTool.shape.markers = ['aap'];
            spyOn(drawTool, 'setPolygon');

            component.find('.qa-button').click();
            expect(drawTool.setPolygon).toHaveBeenCalledWith([]);
            expect(drawTool.enable).toHaveBeenCalled();
        });
    });

    describe('when active', function () {
        beforeEach(function () {
            drawTool.isEnabled = () => true;
            component = getComponent(true);
        });

        it('shows the button in eindig tekenen state with extra label', function () {
            expect(component.find('.qa-button').length).toBe(1);
            expect(component.find('.qa-button').attr('class')).toContain('c-toggle-drawing-tool--active');
            expect(component.find('.qa-button').attr('title')).toBe('Eindig meten en intekenen');
            expect(component.find('.qa-button-finish').length).toBe(1);
        });

        it('disables draw/edit mode when clicking the button', function () {
            component.find('.qa-button').click();
            expect(drawTool.disable).toHaveBeenCalled();
        });
    });

    describe('when not active and has drawn polygon', function () {
        beforeEach(function () {
            drawTool.isEnabled = () => false;
            drawTool.shape.markers = [1, 2, 3, 5];

            component = getComponent(true);
        });

        it('shows the button in opnieuw tekenen state with extra label', function () {
            expect(component.find('.qa-button').length).toBe(1);
            expect(component.find('.qa-button').attr('class')).toContain('c-toggle-drawing-tool--again');
            expect(component.find('.qa-button').attr('title')).toBe('Opnieuw meten en intekenen');
            expect(component.find('.qa-button-again').length).toBe(1);
        });

        it('disables draw/edit mode when clicking the button', function () {
            component.find('.qa-button').click();
            expect(drawTool.enable).toHaveBeenCalled();
        });
    });
});
