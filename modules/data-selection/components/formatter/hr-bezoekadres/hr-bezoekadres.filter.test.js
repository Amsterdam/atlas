describe('The hrBezoekadres filter', () => {
    let hrBezoekadresFilter,
        user;

    beforeEach(() => {
        angular.mock.module(
            'dpDataSelection', {}
            );

        angular.mock.inject((_hrBezoekadresFilter_, _user_) => {
            hrBezoekadresFilter = _hrBezoekadresFilter_;
            user = _user_;
        });
    });

    it('returns bezoekadres when non mailing indication is false', () => {
        const input = {
            bezoekadres_volledig_adres: 'Weesperstraat 113, Amsterdam',
            non_mailing: false
        };
        spyOn(user, 'getUserType').and.returnValue(user.USER_TYPE.NONE);
        let output = hrBezoekadresFilter(input);
        expect(output).toBe('Weesperstraat 113, Amsterdam');

        user.getUserType.and.returnValue(user.USER_TYPE.AUTHENTICATED);
        output = hrBezoekadresFilter(input);
        expect(output).toBe('Weesperstraat 113, Amsterdam');
    });

    it('Hides bezoekadres when non mailing is on and user is not logged in', () => {
        const input = {
            bezoekadres_volledig_adres: 'Weesperstraat 113, Amsterdam',
            non_mailing: true
        };
        spyOn(user, 'getUserType').and.returnValue(user.USER_TYPE.NONE);
        const output = hrBezoekadresFilter(input);
        expect(output).toBe('Non-mailing-indicatie actief');
    });

    it('Shows bezoekadres when non mailing is on and user is logged in', () => {
        const input = {
            bezoekadres_volledig_adres: 'Weesperstraat 113, Amsterdam',
            non_mailing: true
        };
        spyOn(user, 'getUserType').and.returnValue(user.USER_TYPE.AUTHENTICATED);
        const output = hrBezoekadresFilter(input);
        expect(output).toBe('Weesperstraat 113, Amsterdam');
    });
});
