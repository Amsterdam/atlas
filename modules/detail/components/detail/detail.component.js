import angular from 'angular'
import { getServiceDefinitions } from '../../../../src/map/services/map-services.config'

angular.module('dpDetail').component('dpDetail', {
  bindings: {
    endpoint: '@',
    previewPanorama: '<',
    isPreviewPanoramaLoading: '<',
    isLoading: '=',
    catalogFilters: '=',
    user: '<',
    detailTemplateUrl: '<',
    detailData: '<',
    detailFilterSelection: '<',
    subType: '<',
    id: '<',
  },
  templateUrl: 'modules/detail/components/detail/detail.html',
  controller: DpDetailController,
  controllerAs: 'vm',
})

const genericDetailTypes = getServiceDefinitions()
  .map((service) => service.type)
  .filter((type) => !!type)

function isGenericTemplate(templateUrl) {
  if (!templateUrl) {
    return templateUrl
  }

  return genericDetailTypes.some((type) => templateUrl.includes(type))
}

function DpDetailController() {
  const vm = this

  /* istanbul ignore next */
  // eslint-disable-next-line complexity
  vm.$onChanges = (changes) => {
    const { detailTemplateUrl, detailData, detailFilterSelection } = changes
    if (!(detailTemplateUrl && detailData)) return
    if (detailTemplateUrl && detailTemplateUrl.previousValue !== detailTemplateUrl.currentValue) {
      vm.includeSrc = detailTemplateUrl.currentValue
      vm.isGeneric = isGenericTemplate(detailTemplateUrl.currentValue)
    }

    if (detailData && detailData.previousValue !== detailData.currentValue) {
      vm.apiData = {
        results: detailData.currentValue,
      }
    }

    if (
      detailFilterSelection &&
      detailFilterSelection.previousValue !== detailFilterSelection.currentValue
    ) {
      vm.filterSelection = detailFilterSelection.currentValue
    }
  }
}
