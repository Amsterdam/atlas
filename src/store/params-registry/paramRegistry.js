import get from 'lodash.get';
import queryString from 'querystring';
import createHistory from 'history/createBrowserHistory';

/**
 * ParamsRegistry manages the relations between url parameters, reducers and routes.
 * Since we want to reuse url parameter keys over difference routes and reducers, we can build these
 * by adding routes to each key, that holds only one reducer.
 * Why only one per route per param?
 * Otherwise a dependency will exist between reducers. Example: if we have a url param called "view"
 * that is used in reducers A and B. If in the same route reducer A sets the value of "view",
 * reducer B also updates, as it is in sync with the url param.
 */
class ParamsRegistery {
  static getDefaultReducerSettings(reducerKey, stateKey, overrideOptions = {}) {
    const reducerSettingsKeys = {
      encode: 'encode',
      decode: 'decode',
      defaultValue: 'defaultValue'
    };
    const { encode, decode, defaultValue } = reducerSettingsKeys;
    const allowedKeys = [encode, decode, defaultValue];

    Object.keys(overrideOptions).forEach((value) => {
      if (!allowedKeys.includes(value)) {
        throw new Error(`Key given to reducer settings is not allowed: "${value}"`);
      }
    });

    return {
      encode: (state) => get(state, `[${reducerKey}][${stateKey}]`),
      decode: (val) => val,
      reducerKey,
      stateKey,
      ...overrideOptions
    };
  }

  /**
   *
   * @param routerNamespace
   * @returns {ParamsRegistery}
   *
   * @example
   * const paramsRegistery = new ParamsRegistery('ROUTE_NAMESPACE')
   * paramsRegistery.addParameter('view', (routes) => {
   *     routes
   *     .add('ROUTE_NAMESPACE/search', {
   *         stateKey: 'view',
   *         reducerKey: 'searchReducer'
   *     })
   *     .add('ROUTE_NAMESPACE/about', {
   *         stateKey: 'view',
   *         reducerKey: 'userReducer'
   *     })
   * }).addParameter('anotherParam', ...
   */
  constructor(routerNamespace = 'ROUTER') {
    this.queryParamResult = {};
    this.addParameter = this.addParameter.bind(this);
    this.getStateFromQueries = this.getStateFromQueries.bind(this);
    this.bindRouteToReducerSettings = this.bindRouteToReducerSettings.bind(this);

    this.settings = {
      routerNamespace
    };

    this.separateHistory = createHistory();

    return this;
  }

  addParameter(param, callback) {
    if (this.result[param]) {
      throw new Error(`Parameter is already registered: ${param}`);
    }
    const routeApi = {
      add: (routes, reducerKey, stateKey, reducerObject, addHistory = false) => {
        [...Array.isArray(routes) ? [...routes] : [routes]].forEach((route) => {
          if (!reducerKey || (typeof stateKey === 'undefined')) {
            throw new Error(`Param "${param}" with route "${route}" must contain a reducerKey and stateKey`);
          }
          this.bindRouteToReducerSettings(
            param, route, reducerKey, stateKey, reducerObject, addHistory
          );
        });
        return routeApi;
      }
    };

    callback(routeApi);

    return this;
  }

  /**
   *
   * @param param
   * @param route
   * @param reducerKey
   * @param stateKey
   * @param reducerObject
   * @param addHistory
   */
  bindRouteToReducerSettings(param, route, reducerKey, stateKey, reducerObject, addHistory) {
    let paramRouteReducerSettings = get(this.result, `[${param}].routes`, {});
    if (paramRouteReducerSettings[route]) {
      throw new Error(`Route is already registered for parameter "${param}" with route "${route}"`);
    }

    paramRouteReducerSettings = {
      ...paramRouteReducerSettings,
      [route]: {
        ...ParamsRegistery.getDefaultReducerSettings(reducerKey, stateKey, reducerObject),
        addHistory
      }
    };

    this.result = {
      [param]: {
        ...this.result[param],
        routes: paramRouteReducerSettings
      }
    };
  }

  setQueriesFromState(locationType, state) {
    let addHistory = false;
    const query = Object.entries(this.result).reduce((acc, [key, value]) => {
      const reducerObject = get(value, `[routes][${locationType}]`, null);
      if (reducerObject) {
        const encodedValue = reducerObject.encode(state);

        // We need to set addHistory to true if even one route needs to change the history
        if (!addHistory && (reducerObject && reducerObject.addHistory)) {
          addHistory = reducerObject.addHistory;
        }
        let newQuery = {};

        // we need to use JSON.stringify here to also check if arrays and objects are equal
        const isDefaultValue = (
          reducerObject && (
            JSON.stringify(reducerObject.decode(encodedValue)) ===
            JSON.stringify(reducerObject.defaultValue)
          )
        );
        if (
          encodedValue &&
          !isDefaultValue
        ) {
          newQuery = { [key]: encodedValue };
        }
        return {
          ...acc,
          ...newQuery
        };
      }

      return acc;
    }, {});
    const orderedQuery = Object.entries(query).sort().reduce((acc, [key, value]) => ({
      ...acc,
      [key]: value
    }), {});

    const searchQuery = queryString.stringify(orderedQuery);
    const currentPath = window.location.pathname;

    // the history should be changed only when the url string is changed
    // this check prevents recording history changes on every action.
    const recordHistory = searchQuery !== window.location.search.substring(1);
    if (recordHistory) {
      // NOTE: changing history using different history wrapper than the one used in
      // redux-first-router! We need to work with a different history object to prevent
      // redux-first-router from reacting to query changes. If we were to use the same
      // history object, a route change would fire for every query change.
      if (addHistory) {
        this.separateHistory.push(`${currentPath}?${searchQuery}`);
      } else {
        this.separateHistory.replace(`${currentPath}?${searchQuery}`);
      }
    }

    return searchQuery;
  }

  /**
   * Used by reducers to retrieve the state from action.meta.query.
   * @param reducerKey
   * @param action
   * @returns {*}
   */
  getStateFromQueries(reducerKey, action) {
    return ((action.type && action.type.startsWith(this.settings.routerNamespace)) ?
      Object.entries(this.result).reduce((acc, [key, value]) => {
        const reducerObject = get(value, `[routes][${action.type}]`, {});
        return (reducerObject.reducerKey === reducerKey) ? {
          ...acc,
          [reducerObject.stateKey]: reducerObject.decode(
            get(action, `meta.query[${key}]`, this.result[key].defaultValue)
          )
        } : acc;
      }, {}) : {});
  }

  set result(result) {
    this.queryParamResult = {
      ...this.queryParamResult,
      ...result
    };
  }

  get result() {
    return this.queryParamResult;
  }
}

export default ParamsRegistery;
