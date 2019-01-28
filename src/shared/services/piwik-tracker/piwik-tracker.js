/**
 *
 * @param {array} data - Array of tracker event. For more info on the allowed events, see
 * https://developer.matomo.org/guides/tracking-javascript-guide#manually-trigger-events
 */
export default function piwikTracker(data = []) {
  if (data.length) {
    window._paq.push(['setDocumentTitle', window.document.title]);
    window._paq.push(['setCustomUrl', window.location.href]);
    window._paq.push(data);
  }
}
