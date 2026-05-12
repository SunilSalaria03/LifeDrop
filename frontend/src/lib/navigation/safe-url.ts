const NEXT_INTERNAL_SEARCH_PARAMS = ['_rsc'];

export function stripNextInternalSearchParams(params: URLSearchParams) {
  const cleanParams = new URLSearchParams(params);

  NEXT_INTERNAL_SEARCH_PARAMS.forEach((param) => {
    cleanParams.delete(param);
  });

  return cleanParams;
}

export function getSearchParam(name: string) {
  if (typeof window === 'undefined') {
    return null;
  }

  return stripNextInternalSearchParams(
    new URLSearchParams(window.location.search),
  ).get(name);
}

export function getSafeInternalPath(value?: string | null, fallback = '/') {
  if (!value?.startsWith('/')) {
    return fallback;
  }

  if (value.startsWith('//') || value.startsWith('/_next')) {
    return fallback;
  }

  const url = new URL(value, window.location.origin);

  if (url.origin !== window.location.origin) {
    return fallback;
  }

  NEXT_INTERNAL_SEARCH_PARAMS.forEach((param) => {
    url.searchParams.delete(param);
  });

  return `${url.pathname}${url.search}${url.hash}`;
}

export function withAuthLogin(path: string, redirect?: string | null) {
  const params = new URLSearchParams();
  params.set('auth', 'login');

  if (redirect) {
    params.set('redirect', getSafeInternalPath(redirect));
  }

  return `${path}?${params.toString()}`;
}
