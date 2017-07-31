describe('The truncate HTML as text filter', () => {
    'use strict';

    const ELLIPSES = '...',
        MAX_LENGTH = 250;

    var truncateFilter;

    beforeEach(() => {
        angular.mock.module('dpDataSelection');

        angular.mock.inject($filter => {
            truncateFilter = $filter('truncateHtmlAsText');
        });
    });

    it('removes HTML code from the input text', () => {
        expect(truncateFilter('<div>aap<br></div>noot<p>mies')).toEqual('aapnootmies');
    });

    it('caps the resulting text to a maximum of 250 characters', () => {
        for (let i = MAX_LENGTH - 25; i < MAX_LENGTH + 25; i++) {
            expect(truncateFilter('a'.repeat(i)).length).toBe(i <= MAX_LENGTH ? i : MAX_LENGTH);
        }
    });

    it('adds ... to a text if it is capped', () => {
        for (let i = MAX_LENGTH + 1; i < MAX_LENGTH + 25; i++) {
            expect(truncateFilter('a'.repeat(i))).toBe('a'.repeat(MAX_LENGTH - ELLIPSES.length) + ELLIPSES);
        }
    });

    it('does not add ... to a text if it is not capped', () => {
        for (let i = MAX_LENGTH - 25; i <= MAX_LENGTH; i++) {
            expect(truncateFilter('a'.repeat(i))).toBe('a'.repeat(i));
        }
    });

    it('caps the text on the last space, if a space is available', () => {
        expect(truncateFilter('a'.repeat(MAX_LENGTH - 50) + ' '.repeat(75)).length).toEqual(MAX_LENGTH - 50);
        expect(truncateFilter('a'.repeat(MAX_LENGTH - 50) + ' '.repeat(25) + 'a'.repeat(50)).length)
            .toEqual(MAX_LENGTH - 50 + ELLIPSES.length);
    });

    it('only works on strings, other input is returned unchanged', () => {
        [5, true, {aap: 'noot'}]
            .forEach(e => expect(truncateFilter(e)).toEqual(e));
    });
});
