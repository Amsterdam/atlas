/* eslint-disable camelcase */
function formatAddress(
  locationLabel: string,
  street: string,
  houseNumberLetter?: string,
  houseNumberAddition?: string,
  houseNumberStarting?: number,
  houseNumberEnd?: number,
) {
  if (locationLabel) {
    return locationLabel
  }

  let label = street

  if (houseNumberStarting && houseNumberEnd) {
    label = `${label} ${houseNumberStarting}${
      houseNumberEnd !== houseNumberStarting ? `-${houseNumberEnd}` : ''
    }`
  } else {
    label = `${label} ${houseNumberStarting || ''}${houseNumberLetter || ''}${
      houseNumberAddition ? `-${houseNumberAddition}` : ''
    }`
  }

  return label
}

export type Address = {
  verblijfsobjecten: Array<string>
  verblijfsobjecten_label: Array<string>
  locatie_aanduiding: string
  straat: string
  huisnummer_letter?: string
  huisnummer_toevoeging?: string
  huisnummer_van?: number
  huisnummer_tot?: number
}

type AddressResult = {
  id: string
  type: 'nummeraanduiding' | 'verblijfsobject'
  label: string
}

const getAddresses = (results: Address[]): any[] =>
  results
    .reduce<Array<AddressResult>>(
      (
        reducedResults,
        {
          verblijfsobjecten,
          verblijfsobjecten_label,
          locatie_aanduiding,
          straat,
          huisnummer_letter,
          huisnummer_toevoeging,
          huisnummer_van,
          huisnummer_tot,
        },
      ) => [
        ...reducedResults,
        ...verblijfsobjecten.reduce<Array<AddressResult>>(
          (reducedVerblijfsobjecten, verblijfsobject, i) => [
            ...reducedVerblijfsobjecten,
            {
              id: verblijfsobject,
              type: 'verblijfsobject',
              label:
                verblijfsobjecten_label[i] ||
                formatAddress(
                  locatie_aanduiding,
                  straat,
                  huisnummer_letter,
                  huisnummer_toevoeging,
                  huisnummer_van,
                  huisnummer_tot,
                ),
            },
          ],
          [],
        ),
      ],
      [],
    )
    .sort((a, b) => a.label.localeCompare(b.label))

export default getAddresses
