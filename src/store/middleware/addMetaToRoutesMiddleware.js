import paramsRegistry from '../params-registry'

let nrOfRoutesDispatched = 0

const addMetaToRoutesMiddleware = ({ getState }) => (next) => (action) => {
  const path = window.location.pathname

  if (path.includes('kaart') && !path.includes('kaarten')) {
    return next(action)
  }
  if (paramsRegistry.isRouterType(action)) {
    if (getState().location.type !== action.type || action?.meta?.location?.kind === 'pop') {
      nrOfRoutesDispatched = 0
    }

    const isFirstAction = nrOfRoutesDispatched === 0

    nrOfRoutesDispatched += 1
    const nextAction = action
    const meta = {
      ...(nextAction && nextAction.meta ? { ...nextAction.meta } : {}),
      ...(isFirstAction ? { isFirstAction } : {}),
    }
    return next({
      ...nextAction,
      ...(Object.keys(meta).length ? { meta } : {}),
    })
  }

  return next(action)
}

export default addMetaToRoutesMiddleware
