import removeMd from 'remove-markdown'
import { downloadDatasetResource } from '../../../../src/shared/ducks/datasets/data/data'
;(function() {
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

  DpDetailController.$inject = ['store']

  function DpDetailController(store) {
    const vm = this

    vm.$onInit = () => {
      vm.stripMarkdown = val => removeMd(val)

      vm.downloadResource = (dataset, resourceUrl) =>
        store.dispatch(downloadDatasetResource({ dataset, resourceUrl }))
    }

    /* istanbul ignore next */
    // eslint-disable-next-line complexity
    vm.$onChanges = changes => {
      const { detailTemplateUrl, detailData, detailFilterSelection } = changes
      if (!(detailTemplateUrl && detailData)) return
      if (detailTemplateUrl && detailTemplateUrl.previousValue !== detailTemplateUrl.currentValue) {
        vm.includeSrc = detailTemplateUrl.currentValue
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
})()
