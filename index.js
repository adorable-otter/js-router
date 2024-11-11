const container = document.querySelector('main');
const pages = {
  home: () => (container.innerText = 'home page'),
  melon: () => (container.innerText = 'melon page'),
  board: (params) => (container.innerText = `${params.name} ${params.song}`),
};

function createRouter() {
  const ROUTE_PARAMETER_REGEXP = /:(\w+)/g;
  const URL_REGEXP = '([^\\/]+)';
  // [{ fragment, component, params }, ...]
  const routes = [];

  const router = {
    // fragment = #/melon/:name/:song
    addRoute(fragment, component) {
      const params = [];
      // replace에 두번째 인자로 함수가 들어가는 경우 pattern에 일치할 때 마다 콜백으로 호출되며, 반환 값은 대체 문자열로 사용 됨
      // parsedFragment = #/melon/([^\\/]+)/([^\\/]+)
      // params = [name, song]
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

        if (currentRoute.params.length) {
          const urlParams = getUrlParams(currentRoute, window.location.hash);
          currentRoute.component(urlParams);
        } else {
          currentRoute.component();
        }
      };

      window.addEventListener('hashchange', checkRoutes);
      checkRoutes();
    },

    // 버튼이 클릭되면 브라우저의 url의 #을 포함하는 뒷부분을 변경 및 이동?
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
// 라우터에 사용할 주소들을 등록
router
  .addRoute('#/', pages.home)
  .addRoute('#/melon', pages.melon)
  .addRoute('#/melon/:name/:song', pages.board)
  .start();

// 버튼이 클릭되면 브라우저의 url의 #을 포함하는 뒷부분을 변경
window.addEventListener('click', (e) => {
  if (e.target.matches('[data-navigate]')) {
    router.navigate(e.target.dataset.navigate);
  }
});
