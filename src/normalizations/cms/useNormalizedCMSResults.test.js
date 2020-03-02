import useNormalizedCMSResults from './useNormalizedCMSResults'
import useSlug from '../../app/utils/useSlug'
import formatDate from '../../shared/services/date-formatter/date-formatter'
import { TYPES } from '../../shared/config/cms.config'

jest.mock('../../app/utils/useSlug')
jest.mock('../../shared/services/date-formatter/date-formatter')

describe('useNormalizedCMSResults', () => {
  const slug = 'this-is-a-slug'
  const formattedDate = 'pretty date'

  beforeEach(() => {
    useSlug.mockImplementation(() => slug)
    formatDate.mockImplementation(() => formattedDate)
  })
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
    field_publication_date: '2012-12-12',
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
    localeDate: input.field_publication_date,
    localeDateFormatted: formattedDate,
    slug,
    to: {},
    related: [],
  }

  it('should normalize the data to use in the application', () => {
    expect(useNormalizedCMSResults(input)).toMatchObject(output)
  })

  it('should have a vertical image and file url for publications', () => {
    expect(
      useNormalizedCMSResults({
        ...input,
        type: TYPES.PUBLICATION,
        field_file: { field_media_file: { uri: { url: 'url' } } },
      }),
    ).toMatchObject({
      imageIsVertical: true,
      fileUrl: 'url',
    })
  })

  it('should set the "to" prop', () => {
    expect(
      useNormalizedCMSResults({
        ...input,
        type: TYPES.ARTICLE,
      }),
    ).toMatchObject({
      to: {
        payload: {
          id: input.uuid,
          slug,
        },
      },
    })
  })

  it('should set the link props', () => {
    const href = 'href'
    expect(
      useNormalizedCMSResults({
        ...input,
        field_link: {
          uri: href,
        },
      }),
    ).toMatchObject({
      linkProps: {
        $as: 'a',
        href,
      },
    })
  })

  it('should set the "related" prop', () => {
    const related = {
      id: 'id',
      teaserImage: 'teaserImage',
      shortTitle: 'shortTitle',
    }

    expect(
      useNormalizedCMSResults({
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

  it('should normalize the data when it`s an array', () => {
    expect(useNormalizedCMSResults([input])).toMatchObject([output])

    expect(useNormalizedCMSResults({ results: [input] })).toMatchObject([output])
  })

  it('should normalize the data when it`s an array with links to other data', () => {
    expect(useNormalizedCMSResults({ results: [{ ...input }], _links: [] })).toMatchObject({
      data: [output],
      links: [],
    })
  })

  it("should set the date if field_publication_date isn't set", () => {
    const newInput = { ...input, field_publication_year: '2012', field_publication_month: '1' }
    delete newInput.field_publication_date
    expect(useNormalizedCMSResults({ results: [newInput], _links: [] })).toMatchObject({
      data: [{ ...output, localeDate: new Date(Date.UTC(2012, 0, 1, 0, 0, 0)) }],
      links: [],
    })
  })
})
