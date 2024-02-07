import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;

  let identityCookie:any = context.cookies.get('identity');
  let identity = null;
  let token = null;
  const allowedPathnames = pathname === '/login' || pathname === '/registro'

  if(identityCookie){
    identity = JSON.parse(identityCookie.value)
    token = identity.token;
  }

  if(token){
    if (pathname === '/') {
      return context.redirect(`/admin`);
    } else {
      return next();
    }
  } else {
    if (allowedPathnames) {
      return next();
    } else {
      return context.redirect(`/login`);
    }
  }

  
});