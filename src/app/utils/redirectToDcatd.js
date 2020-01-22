import { routing } from '../routes'

export const DCATD_DETAIL_REDIRECT_URL = 'DCATD_DETAIL_REDIRECT_URL'
export const DCATD_LIST_REDIRECT_URL = 'DCATD_LIST_REDIRECT_URL'

function redirectToDcatd(id) {
  sessionStorage.setItem(DCATD_DETAIL_REDIRECT_URL, document.location.href)
  sessionStorage.setItem(
    DCATD_LIST_REDIRECT_URL,
    `${document.location.origin}${routing.datasets.path}`,
  )

  window.location.assign(`/dcatd_admin#/datasets/${id}`)
}

export default redirectToDcatd
