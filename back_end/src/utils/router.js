const compile = (path) => path.split('/').filter(Boolean);

export function createRouter() {
  const routes = [];

  const router = {
    use(method, path, ...handlers) {
      routes.push({ method, parts: compile(path), handlers });
      return router;
    },
    get(path, ...handlers) {
      return router.use('GET', path, ...handlers);
    },
    post(path, ...handlers) {
      return router.use('POST', path, ...handlers);
    },
    patch(path, ...handlers) {
      return router.use('PATCH', path, ...handlers);
    },
    delete(path, ...handlers) {
      return router.use('DELETE', path, ...handlers);
    },
    match(method, pathname) {
      const parts = compile(pathname);

      for (const route of routes) {
        if (route.method !== method || route.parts.length !== parts.length) {
          continue;
        }

        const params = {};
        let matched = true;

        for (let index = 0; index < route.parts.length; index += 1) {
          const part = route.parts[index];
          if (part.startsWith(':')) {
            params[part.slice(1)] = decodeURIComponent(parts[index]);
          } else if (part !== parts[index]) {
            matched = false;
            break;
          }
        }

        if (matched) return { handlers: route.handlers, params };
      }

      return null;
    },
  };

  return router;
}
