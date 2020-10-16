import { MapPanelContent } from '@amsterdam/arm-core'
import { Enlarge, Minimise } from '@amsterdam/asc-assets'
import { Alert, Button, Paragraph, themeSpacing } from '@amsterdam/asc-ui'
import React, { Fragment, FunctionComponent, useContext, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import {
  fetchDetailData,
  getServiceDefinition,
  MapDetails,
  parseDetailPath,
  toMapDetails,
} from '../../../../map/services/map'
import {
  DetailResultItem,
  DetailResultItemGroupedItems,
  DetailResultItemPaginatedData,
  DetailResultItemType,
  PaginatedData as PaginatedDataType,
} from '../../../../map/types/details'
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'
import PromiseResult from '../../../components/PromiseResult/PromiseResult'
import useParam from '../../../utils/useParam'
import usePromise, {
  PromiseResult as PromiseResultType,
  PromiseStatus,
} from '../../../utils/usePromise'
import PanoramaPreview, { PreviewContainer } from '../map-search/PanoramaPreview'
import MapContext from '../MapContext'
import { detailUrlParam } from '../query-params'
import DetailDefinitionList from './DetailDefinitionList'
import DetailHeading from './DetailHeading'
import DetailInfoBox from './DetailInfoBox'
import DetailLinkList from './DetailLinkList'
import DetailSpacer from './DetailSpacer'
import DetailTable from './DetailTable'

interface DetailPanelProps {
  detailUrl: string
}

const StyledLoadingSpinner = styled(LoadingSpinner)`
  margin: ${themeSpacing(4)} 0;
`

const Message = styled(Paragraph)`
  margin: ${themeSpacing(4)} 0;
`

const ShowMoreButton = styled(Button)`
  margin-top: ${themeSpacing(1)};
`

// Todo: remove gridArea when legacy map is removed
const ItemWrapper = styled.div<{ gridArea?: string }>`
  display: flex;
  flex-direction: column;
  ${({ gridArea }) =>
    gridArea &&
    css`
      grid-area: ${gridArea} !important;
    `}
`
export const HeadingWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`

export const InfoBoxWrapper = styled.div``

// Todo AfterBeta: legacyLayout can be removed
const Wrapper = styled.div<LegacyLayout>`
  ${({ legacyLayout }) =>
    legacyLayout &&
    css`
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-auto-rows: auto;
      gap: ${themeSpacing(3, 2)};

      ${PreviewContainer} {
        grid-area: 2 / 2 / 3 / 3;

        & + ${DetailSpacer} {
          display: none;
        }
      }

      & > * {
        grid-column: 1 / span 2;
      }
    `}
`

type LegacyLayout = {
  legacyLayout?: boolean
}

export const PanelContents: FunctionComponent<
  { result: PromiseResultType<MapDetails | null> } & LegacyLayout
> = ({ result, legacyLayout }) => {
  if (result.status === PromiseStatus.Pending) {
    return <StyledLoadingSpinner />
  }

  if (result.status === PromiseStatus.Rejected) {
    return <Message>Details konden niet geladen worden.</Message>
  }
  return <RenderDetails legacyLayout={legacyLayout} details={result.value} />
}

const DetailPanel: FunctionComponent<DetailPanelProps> = ({ detailUrl }) => {
  const [, setDetailUrl] = useParam(detailUrlParam)
  const { setDetailFeature } = useContext(MapContext)
  const result = usePromise(
    useMemo(async () => {
      const detailParams = parseDetailPath(detailUrl)
      const serviceDefinition = getServiceDefinition(`${detailParams.type}/${detailParams.subType}`)

      if (!serviceDefinition) {
        return Promise.resolve(null)
      }

      const data = await fetchDetailData(serviceDefinition, detailParams.id)
      const details = await toMapDetails(serviceDefinition, data, detailParams)

      if (details.geometry) {
        setDetailFeature({
          id: detailParams.id,
          type: 'Feature',
          geometry: details.geometry,
          properties: null,
        })
      } else {
        setDetailFeature(null)
      }

      return details
    }, [detailUrl]),
  )

  const subTitle = (result.status === PromiseStatus.Fulfilled && result.value?.data.title) || ''

  return (
    <MapPanelContent
      title={getPanelTitle(result)}
      subTitle={subTitle}
      onClose={() => setDetailUrl(null)}
    >
      <PanelContents result={result} />
    </MapPanelContent>
  )
}

interface GroupedItemsProps {
  item: DetailResultItemGroupedItems
}

const GroupedItems: FunctionComponent<GroupedItemsProps> = ({ item }) => (
  <>
    {item.entries.map((groupedItem) => (
      <Fragment key={groupedItem?.title}>
        <Item item={groupedItem} subItem />
        <DetailSpacer />
      </Fragment>
    ))}
  </>
)

const Item: FunctionComponent<{ item: DetailResultItem; subItem?: boolean }> = ({
  item,
  subItem,
}) => {
  const component = (() => {
    switch (item?.type) {
      case DetailResultItemType.DefinitionList:
        return <DetailDefinitionList entries={item.entries} />
      case DetailResultItemType.Table:
        return <DetailTable item={item} />
      case DetailResultItemType.LinkList:
        return <DetailLinkList item={item} />
      case DetailResultItemType.PaginatedData:
        return <PaginatedData item={item} />
      case DetailResultItemType.GroupedItems:
        return <GroupedItems item={item} />
      default:
        throw new Error('Unable to render map detail pane, encountered unknown item type.')
    }
  })()

  return (
    <div>
      {item.title && (
        <HeadingWrapper>
          <DetailHeading styleAs={subItem ? 'h6' : 'h4'}>{item.title}</DetailHeading>
          {item.infoBox && <DetailInfoBox {...item.infoBox} />}
        </HeadingWrapper>
      )}

      {component}
    </div>
  )
}

interface PaginatedResultProps {
  result: PaginatedDataType<any>
  pageSize: number
  setPaginatedUrl: (number: number) => void
  item: DetailResultItemPaginatedData
}

// Unfortunately we cannot use "-1", as apparently wont work for some API's
const INFINITE_PAGE_SIZE = 999

const PaginatedResult: FunctionComponent<PaginatedResultProps> = ({
  result,
  pageSize,
  setPaginatedUrl,
  item,
}) => {
  const resultItem = item.toView(result.data)
  const showMoreButton = result.count > result.data.length ?? pageSize === INFINITE_PAGE_SIZE
  const showMoreText = `Toon alle ${result.count} ${
    resultItem?.title ? resultItem.title.toLocaleLowerCase() : 'resultaten'
  }`
  const showLessText = 'Toon minder'
  const showMore = pageSize !== INFINITE_PAGE_SIZE

  return (
    <>
      <Item item={resultItem} />
      {showMoreButton && (
        <ShowMoreButton
          variant="textButton"
          iconSize={12}
          iconLeft={showMore ? <Enlarge /> : <Minimise />}
          onClick={() => {
            setPaginatedUrl(showMore ? INFINITE_PAGE_SIZE : item.pageSize)
          }}
        >
          {showMore ? showMoreText : showLessText}
        </ShowMoreButton>
      )}
    </>
  )
}

interface PaginatedDataProps {
  item: DetailResultItemPaginatedData
}

// Todo: DI-1204: It's currently not possible to show the title / infobox when promise is rejected
const PaginatedData: FunctionComponent<PaginatedDataProps> = ({ item }) => {
  const [pageSize, setPaginatedUrl] = useState(item.pageSize)
  const promise = useMemo(() => item.getData(undefined, pageSize), [pageSize])

  return (
    <PromiseResult promise={promise}>
      {(result) => {
        if (!result.value) {
          return null
        }

        return (
          <PaginatedResult
            result={result.value}
            pageSize={pageSize}
            item={item}
            setPaginatedUrl={setPaginatedUrl}
          />
        )
      }}
    </PromiseResult>
  )
}

export interface RenderDetailsProps extends LegacyLayout {
  details: MapDetails | null
}

const RenderDetails: FunctionComponent<RenderDetailsProps> = ({ details, legacyLayout }) => {
  if (!details) {
    return <Message>Geen detailweergave beschikbaar.</Message>
  }

  return (
    <Wrapper legacyLayout={legacyLayout}>
      {details.location && (
        <PanoramaPreview location={details.location} radius={180} aspect={2.5} />
      )}
      <DetailSpacer />
      {details.data.notifications?.map((notification) => (
        <Fragment key={notification.id}>
          <Alert level={notification.level} dismissible={notification.canClose}>
            {notification.value}
          </Alert>
          <DetailSpacer />
        </Fragment>
      ))}
      {details.data.items.map((item) => {
        if (!item) {
          return null
        }

        return (
          <ItemWrapper key={item.title} className={item.type} gridArea={item.gridArea}>
            <Item item={item} />
            <DetailSpacer />
          </ItemWrapper>
        )
      })}
    </Wrapper>
  )
}

export function getPanelTitle(result: PromiseResultType<MapDetails | null>) {
  if (result.status === PromiseStatus.Fulfilled && result.value) {
    return result.value.data.subTitle
  }

  return 'Detailweergave'
}

export default DetailPanel
