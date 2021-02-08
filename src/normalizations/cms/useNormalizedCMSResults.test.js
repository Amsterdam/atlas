import { toArticleDetail } from '../../app/links'
import { CmsType } from '../../shared/config/cms.config'
import useNormalizedCMSResults, {
  getLocaleFormattedDate,
  normalizeObject,
} from './useNormalizedCMSResults'

describe('useNormalizedCMSResults', () => {
  describe('getLocaleFormattedDate', () => {
    /* eslint-disable camelcase */
    it('returns an object with empty values', () => {
      const { localeDate, localeDateFormatted } = getLocaleFormattedDate()

      expect(localeDate).toEqual('')
      expect(localeDateFormatted).toEqual('')
    })

    it('returns an object with empty values from an empty options object', () => {
      const { localeDate, localeDateFormatted } = getLocaleFormattedDate({})

      expect(localeDate).toEqual('')
      expect(localeDateFormatted).toEqual('')
    })

    it('returns an object with empty values when options do not contain a possible valid date', () => {
      const { localeDate, localeDateFormatted } = getLocaleFormattedDate({
        field_publication_year: 'foobar',
      })

      expect(localeDate).toEqual('')
      expect(localeDateFormatted).toEqual('')
    })

    it('returns an object with dates from field_publication_date', () => {
      const field_publication_date = '2020-12-02T16:00:00+01:00'
      const { localeDate, localeDateFormatted } = getLocaleFormattedDate({
        field_publication_date,
      })

      expect(localeDate).toEqual(field_publication_date)
      expect(localeDateFormatted).toEqual('2 december 2020')
    })

    it('returns an object with dates from field_publication_year', () => {
      const field_publication_year = '2020'
      const { localeDate, localeDateFormatted } = getLocaleFormattedDate({
        field_publication_year,
      })

      expect(localeDate).toEqual(new Date(Date.UTC(field_publication_year)))
      expect(localeDateFormatted).toEqual(`1-1-${field_publication_year}`)
    })

    it('returns an object with dates from field_publication_year and field_publication_month', () => {
      const field_publication_year = '2020'
      const field_publication_month = 12
      const { localeDate, localeDateFormatted } = getLocaleFormattedDate({
        field_publication_year,
        field_publication_month,
      })

      expect(localeDate).toEqual(
        new Date(Date.UTC(field_publication_year, field_publication_month - 1)),
      )
      expect(localeDateFormatted).toEqual(`1-${field_publication_month}-${field_publication_year}`)
    })

    it('returns an object with dates from field_publication_year, field_publication_month and field_publication_day', () => {
      const field_publication_year = 2020
      const field_publication_month = 10
      const field_publication_day = 31
      const { localeDate, localeDateFormatted } = getLocaleFormattedDate({
        field_publication_year,
        field_publication_month,
        field_publication_day,
      })

      expect(localeDate).toEqual(
        new Date(
          Date.UTC(field_publication_year, field_publication_month - 1, field_publication_day),
        ),
      )
      expect(localeDateFormatted).toEqual(
        `${field_publication_day}-${field_publication_month}-${field_publication_year}`,
      )
    })
    /* eslint-enable camelcase */
  })

  describe('normalizeObject', () => {
    const input = {
      uuid: 'id',
      title: 'title',
      type: 'foo',
      body: {
        value: 'body',
      },
      teaser_url: 'teaser_url',
      media_image_url: 'media_image_url',

      short_title: 'short_title',
      field_teaser: 'field_teaser',
      intro: 'intro',
      field_special_type: 'field_special_type',
      field_publication_date: '',
    }

    const output = {
      key: input.uuid,
      id: input.uuid,
      title: input.title,
      type: input.type,
      body: input.body.value,
      teaserImage: input.teaser_url,
      coverImage: input.media_image_url,
      imageIsVertical: false,
      shortTitle: input.short_title,
      teaser: input.field_teaser,
      intro: input.intro,
      specialType: input.field_special_type,
      fileUrl: undefined,
      localeDate: '',
      localeDateFormatted: '',
      slug: input.title,
      to: {},
      related: [],
    }

    it('normalizes the data to use in the application', () => {
      expect(normalizeObject(input)).toMatchObject(output)
    })

    it('has a vertical image and file url for publications', () => {
      expect(
        normalizeObject({
          ...input,
          type: CmsType.Publication,
          field_file: { field_media_file: { uri: { url: 'url' } } },
        }),
      ).toMatchObject({
        imageIsVertical: true,
        fileUrl: 'url',
      })
    })

    it('sets the "to" prop', () => {
      expect(
        normalizeObject({
          ...input,
          type: CmsType.Article,
        }),
      ).toMatchObject({
        to: toArticleDetail(input.uuid, output.slug),
      })
    })

    it('sets the link props', () => {
      const href = 'href'
      expect(
        normalizeObject({
          ...input,
          field_link: {
            uri: href,
          },
        }),
      ).toMatchObject({
        linkProps: {
          forwardedAs: 'a',
          href,
        },
      })
    })

    it('sets the "related" prop', () => {
      const related = {
        id: 'id',
        teaserImage: 'teaserImage',
        shortTitle: 'shortTitle',
      }

      expect(
        normalizeObject({
          ...input,
          field_related: [{ ...input, ...related }],
        }),
      ).toMatchObject({
        related: [
          {
            ...output,
            id: related.id,
            intro: undefined,
            key: related.id,
            shortTitle: related.shortTitle,
            teaserImage: related.teaserImage,
          },
        ],
      })
    })

    it('sets the links prop', () => {
      const field_links = [
        { uri: 'http://example.com?foo=bar&amp;baz=qux', title: 'Test', options: [] },
        { uri: 'internal:/test/', title: 'Test 2', options: [] },
        { uri: 'entity:node/8', title: 'Foo', options: [] },
      ]
      expect(
        normalizeObject({
          ...input,
          field_links,
        }),
      ).toMatchObject({
        links: [
          { uri: 'http://example.com?foo=bar&baz=qux', title: 'Test', options: [] },
          { uri: 'internal:/test/', title: 'Test 2', options: [] },
          { uri: 'entity:node/8', title: 'Foo', options: [] },
        ],
      })
    })

    it('normalizes the data when it is an array', () => {
      expect(useNormalizedCMSResults([input])).toMatchObject([output])

      expect(useNormalizedCMSResults({ results: [input] })).toMatchObject([output])
    })

    it('normalizes the data when it is NOT an array', () => {
      expect(useNormalizedCMSResults(input)).toMatchObject(output)
    })

    it('normalizes the data when it is an array with links to other data', () => {
      expect(useNormalizedCMSResults({ results: [{ ...input }], _links: [] })).toMatchObject({
        data: [output],
        links: [],
      })
    })
  })
})
