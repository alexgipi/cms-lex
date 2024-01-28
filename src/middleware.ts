import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;

  if (pathname === '/') {
    return context.redirect(`/admin`);
  } else {
    return next();
  }
});