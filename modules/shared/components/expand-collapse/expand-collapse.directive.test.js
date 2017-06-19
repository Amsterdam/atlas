describe('`dpExpandCollapse` directive', () => {
    let $compile;
    let $rootScope;
    let $interval;
    let content = 'Lorem ipsum dolor sit amet.\n';

    beforeEach(module('dpShared'));

    beforeEach(angular.mock.inject((_$compile_, _$rootScope_, _$interval_) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $interval = _$interval_;
    }));

    it('Should collapse and expand too lengthy content', () => {
        for (let i = 0; i <= 5; i++) {
            content += content;
        }

        const collapsedElement = $compile(`<p dp-expand-collapse>${content}</p>`)($rootScope);

        collapsedElement.css({
            'max-height': '50px',
            overflow: 'hidden'
        });

        angular.element(document).find('body').append(collapsedElement);

        $interval.flush(9999999);
        // $timeout.verifyNoPendingTasks();

        const button = angular.element(document).find('body').find('button');

        expect(button).not.toBeUndefined();
        expect(collapsedElement.scope().collapsed).toBeTruthy();

        button.click();

        expect(collapsedElement.scope().collapsed).toBeFalsy();

        button.click();

        expect(collapsedElement.scope().collapsed).toBeTruthy();
    });

    it('Should leave non-lengthy content', () => {
        const untouchedElement = $compile(`<p dp-expand-collapse>${content}</p>`)($rootScope);

        angular.element(document).find('body').append(untouchedElement);

        $interval.flush(9999999);
        // $timeout.verifyNoPendingTasks();

        expect(untouchedElement.scope().collapsed).toBeUndefined();
    });
});
