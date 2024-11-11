const container = document.querySelector('main');
const pages = {
  home: () => (container.innerText = 'home page'),
  melon: () => (container.innerText = 'melon page'),
  board: (params) => (container.innerText = `${params.name} ${params.song}`),
};

function createRouter() {
  const ROUTE_PARAMETER_REGEXP = /:(\w+)/g;
  const URL_REGEXP = '([^\\/]+)';
  const routes = [];

  const router = {
    addRoute(fragment, component) {
      const params = [];
      const parsedFragment = fragment
        .replace(ROUTE_PARAMETER_REGEXP, (_, paramName) => {
          params.push(paramName);
          return URL_REGEXP;
        })
        .replace(/\//g, '/');

      routes.push({ fragmentRegExp: new RegExp(`^${parsedFragment}$`), component, params });
      return this;
    },

    start() {
      const getUrlParams = (route, hash) => {
        const params = {};
        const matches = hash.match(route.fragmentRegExp);

        if (matches) {
          matches.shift();
          matches.forEach((paramValue, index) => {
            const paramName = route.params[index];
            params[paramName] = paramValue;
          });
        }
        return params;
      };

      const checkRoutes = () => {
        const currentRoute = routes.find((route) =>
          route.fragmentRegExp.test(window.location.hash)
        );
        if (currentRoute) {
          currentRoute.component();
        }
      };

      window.addEventListener('hashchange', checkRoutes);
      checkRoutes();
    },

    navigate(fragment, replace = false) {
      if (replace) {
        const href = window.location.href.replace(window.location.hash, '#' + fragment);
        window.location.replace(href);
      } else {
        window.location.hash = fragment;
      }
    },
  };

  return router;
}

const router = createRouter();
router
  .addRoute('#/', pages.home)
  .addRoute('#/melon', pages.melon)
  .addRoute('#/melon/:name/:song', pages.board)
  .start();

window.addEventListener('click', (e) => {
  if (e.target.matches('[data-navigate]')) {
    router.navigate(e.target.dataset.navigate);
  }
});
