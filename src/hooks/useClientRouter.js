import { useCallback, useEffect, useState } from "react";
import { ROUTES } from "../config/site";

function routeFromPathname(pathname) {
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return ROUTES.find((route) => route.path === normalizedPath)?.id ?? "home";
}

export function useClientRouter() {
  const [page, setPage] = useState(() => routeFromPathname(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => {
      setPage(routeFromPathname(window.location.pathname));
      window.scrollTo(0, 0);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = useCallback((pageId) => {
    const route = ROUTES.find((item) => item.id === pageId) ?? ROUTES[0];
    window.history.pushState({}, "", route.path);
    setPage(route.id);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return { page, navigate };
}
