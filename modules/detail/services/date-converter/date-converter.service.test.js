describe('dateConverter', () => {
    var dateConverter;

    beforeEach(() => {
        angular.mock.module('dpDetail');

        angular.mock.inject(_dateConverter_ => {
            dateConverter = _dateConverter_;
        });
    });

    it('should convert a string yyyy-mm-dd to a js date object ', () => {
        var result = dateConverter.ymdToDate('2016-03-01');

        expect(result.getFullYear()).toBe(2016);
        expect(result.getMonth()).toBe(2);
        expect(result.getDate()).toBe(1);
    });

    it('should convert a string yyyy-mm-dd before 1970 to a js date object ', () => {
        var result = dateConverter.ymdToDate('1969-08-20');

        expect(result.getFullYear()).toBe(1969);
        expect(result.getMonth()).toBe(7);
        expect(result.getDate()).toBe(20);
    });
});
