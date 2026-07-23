import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

export const config = {
  matcher: [
    // Match all pathnames except:
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /admin (admin routes - no i18n)
    // - static files
    '/((?!api|_next|admin|.*\\..*).*)',
  ],
};
