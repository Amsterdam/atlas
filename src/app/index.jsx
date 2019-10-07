import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import configureStore from '../store/store'
import routes from './routes'
import resolveRedirects from './redirects'
import ReduxContext from '../store/reduxContext'
import './sentry'

// Disabled for test
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js')
//   })
// }

const store = configureStore(routes)

resolveRedirects().then(hasToRedirect => {
  if (!hasToRedirect) {
    // eslint-disable-next-line no-undef,no-console
    console.log(`CityData: version: ${VERSION}, build: ${__BUILD_ID__}`)

    ReactDOM.render(
      <Provider store={store}>
        <ReduxContext.Provider value={store}>
          <App />
        </ReduxContext.Provider>
      </Provider>,
      document.getElementById('root'),
    )
  }
})
