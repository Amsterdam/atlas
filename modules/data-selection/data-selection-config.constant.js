(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .constant('DATA_SELECTION_CONFIG', {
            bag: {
                ENDPOINT: 'https://api-acc.datapunt.amsterdam.nl/zelfbediening/bag/',
                FILTER_PRIORITY: [
                    'buurtcombinaties',
                    'buurten',
                    'postcode'
                ],
                TABLE_FIELDS: [
                    {
                        slug: 'stadsdeel_naam',
                        label: 'Stadsdeel naam'
                    },
                    {
                        slug: 'stadsdeel_code',
                        label: 'Stadsdeel code'
                    },
                    {
                        slug: '',
                        label: 'Gebiedsnaam (gebiedsgerichtwerken)'
                    },
                    {
                        slug: '',
                        label: 'Gebiedsnaam code'
                    },
                    {
                        slug: 'buurtcombinatie_naam',
                        label: 'Wijknaam (buurtcombinatie)'
                    },
                    {
                        slug: 'buurtcombinatie_code',
                        label: 'Wijk volledige code'
                    },
                    {
                        slug: 'buurt_naam',
                        label: 'Buurtnaam'
                    },
                    {
                        slug: 'buurt_code',
                        label: 'Buurt volledige code'
                    },
                    {
                        slug: '_openbare_ruimte_naam',
                        label: 'Straatnaam (openbare ruimte naam)'
                    },
                    {
                        slug: 'huisnummer',
                        label: 'Huisnummer'
                    },
                    {
                        slug: 'huisnummer_toevoeging',
                        label: 'Huisnummer Toevoeging'
                    },
                    {
                        slug: 'huisletter',
                        label: 'Huisnummer letter'
                    },
                    {
                        slug: 'postcode',
                        label: 'Postcode'
                    }
                ]
            }
        });
})();