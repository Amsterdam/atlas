(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .constant('DATA_SELECTION_CONFIG', {
            bag: {
                CUSTOM_API: 'dataSelectionApiDataSelection',
                MAX_AVAILABLE_PAGES: 100,
                ENDPOINT_PREVIEW: 'dataselectie/bag/',
                ENDPOINT_MARKERS: 'dataselectie/bag/geolocation/',
                ENDPOINT_EXPORT: 'https://api.datapunt.amsterdam.nl/dataselectie/bag/export/',
                ENDPOINT_DETAIL: 'https://api.datapunt.amsterdam.nl/bag/nummeraanduiding/',
                PRIMARY_KEY: 'id',
                TITLE: 'Adressen',
                FILTERS: [
                    {
                        slug: 'stadsdeel_naam',
                        label: 'Stadsdeel'
                    }, {
                        slug: 'ggw_naam',
                        label: 'GGW-gebied'
                    }, {
                        slug: 'buurtcombinatie_naam',
                        label: 'Buurtcombinatie'
                    }, {
                        slug: 'buurt_naam',
                        label: 'Buurt'
                    }, {
                        slug: 'naam',
                        label: 'Openbare ruimte'
                    }, {
                        slug: 'postcode',
                        label: 'Postcode'
                    }
                ],
                CONTENT: {
                    TABLE: [
                        {
                            label: 'Naam openbare ruimte',
                            variables: ['_openbare_ruimte_naam']
                        },
                        {
                            label: 'Num.',
                            variables: ['huisnummer']
                        },
                        {
                            label: 'Let.',
                            variables: ['huisletter']
                        },
                        {
                            label: 'Toev.',
                            variables: ['huisnummer_toevoeging']
                        },
                        {
                            label: 'Postcode',
                            variables: ['postcode']
                        },
                        {
                            label: 'Stadsdeel',
                            variables: ['stadsdeel_naam']
                        },
                        {
                            label: '-code',
                            variables: ['stadsdeel_code']
                        },
                        {
                            label: 'GGW-gebied',
                            variables: ['ggw_naam']
                        },
                        {
                            label: '-code',
                            variables: ['ggw_code']
                        },
                        {
                            label: 'Buurtcombinatie',
                            variables: ['buurtcombinatie_naam']
                        },
                        {
                            label: '-code',
                            variables: ['buurtcombinatie_code']
                        },
                        {
                            label: 'Buurt',
                            variables: ['buurt_naam']
                        },
                        {
                            label: '-code',
                            variables: ['buurt_code']
                        }
                    ],
                    LIST: [
                        {
                            variables: [
                                '_openbare_ruimte_naam',
                                'huisnummer',
                                'huisletter',
                                'huisnummer_toevoeging'
                            ],
                            formatter: 'bagAddress'
                        },
                        {
                            variables: [
                                'ligplaats_id',
                                'standplaats_id'
                            ],
                            formatter: 'nummeraanduidingType'
                        },
                        {
                            variables: [
                                'hoofdadres'
                            ],
                            formatter: 'nevenadres'
                        },
                        {
                            variables: [
                                'status_id'
                            ],
                            formatter: 'verblijfsobjectGevormd'
                        }
                    ]
                }
            },
            catalogus: {
                MAX_ITEMS_PER_PAGE: 10,
                CUSTOM_API: 'dataSelectionApiCkan',
                ENDPOINT_PREVIEW: 'catalogus/api/3/action/package_search',
                ENDPOINT_DETAIL: 'catalogus/api/3/action/package_show',
                PRIMARY_KEY: 'id',
                TITLE: 'Catalogus',
                SHOW_FILTER_OPTION_COUNTS: false,
                FILTERS: [
                    {
                        slug: 'groups',
                        label: 'Thema\'s'
                    }, {
                        slug: 'res_format',
                        label: 'Formaten',
                        formatter: 'lowercase'
                    }, {
                        slug: 'organization',
                        label: 'Gepubliceerd door'
                    }
                ],
                CONTENT: {
                    CARDS: [
                        {
                            label: 'Naam',
                            variables: ['title']
                        }, {
                            label: 'Datum',
                            variables: ['metadata_created', 'metadata_modified'],
                            formatter: 'modificationDate'
                        }, {
                            label: 'Formaten',
                            variables: ['resources.format'],
                            formatter: 'aggregate',
                            template: 'file-type'
                        }, {
                            label: 'Labels',
                            variables: ['tags.display_name'],
                            formatter: 'aggregate',
                            template: 'tags'
                        }, {
                            label: 'Omschrijving',
                            formatter: 'truncateHtmlAsText',
                            variables: ['notes']
                        }
                    ]
                }
            },
            hr: {
                CUSTOM_API: 'dataSelectionApiDataSelection',
                MAX_AVAILABLE_PAGES: 100,
                ENDPOINT_PREVIEW: 'dataselectie/hr/',
                ENDPOINT_MARKERS: 'dataselectie/hr/geolocation/',
                ENDPOINT_EXPORT: 'https://api.datapunt.amsterdam.nl/dataselectie/hr/export/',
                ENDPOINT_DETAIL: 'https://api.datapunt.amsterdam.nl/handelsregister/vestiging/',
                PRIMARY_KEY: 'id',
                TITLE: 'Handelsregister',
                FILTERS: [
                    {
                        slug: 'stadsdeel_naam',
                        label: 'Stadsdeel'
                    }, {
                        slug: 'ggw_naam',
                        label: 'GGW-gebied'
                    }, {
                        slug: 'buurtcombinatie_naam',
                        label: 'Buurtcombinatie'
                    }, {
                        slug: 'buurt_naam',
                        label: 'Buurt'
                    }, {
                        slug: 'naam',
                        label: 'Openbare ruimte'
                    }, {
                        slug: 'postcode',
                        label: 'Postcode'
                    }, {
                        slug: 'hoofdcategorie',
                        label: 'Hoofdcategorie'
                    }, {
                        slug: 'subcategorie',
                        label: 'Subcategorie'
                    }
                ],
                CONTENT: {
                    TABLE: [
                        {
                            label: 'KvK-num.',
                            variables: ['kvk_nummer']
                        },
                        {
                            label: 'Handelsnaam',
                            variables: ['bedrijfsnaam']
                        },
                        {
                            label: 'Bezoekadres',
                            variables: ['naam']
                        },
                        {
                            label: 'Num.',
                            variables: ['huisnummer']
                        },
                        {
                            label: 'Let.',
                            variables: ['huisletter']
                        },
                        {
                            label: 'Toev.',
                            variables: ['toevoeging']
                        },
                        {
                            label: 'Postcode',
                            variables: ['postcode']
                        },
                        {
                            label: 'Woonplaats',
                            variables: ['woonplaats']
                        },
                        {
                            label: 'Hoofdcategorie',
                            variables: ['hoofdcategorieen']
                        },
                        {
                            label: 'Subcategorie',
                            variables: ['subcategorieen']
                        },
                        {
                            label: 'SBI-omschrijving',
                            variables: ['sbi_omschrijving']
                        },
                        {
                            label: 'SBI-code',
                            variables: ['sbicodes']
                        }
                    ],
                    LIST: [
                        {
                            variables: ['bedrijfsnaam']
                        }
                    ]
                }
            }
        });
})();
