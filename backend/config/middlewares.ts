import type { Core } from '@strapi/strapi';

const cloudinaryHosts = ['market-assets.strapi.io', 'res.cloudinary.com'];

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => [
  'strapi::logger',
  'strapi::errors',
  {
    // Default CSP blocks res.cloudinary.com, which leaves Media Library
    // thumbnails blank even though the upload itself succeeded.
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', ...cloudinaryHosts],
          'media-src': ["'self'", 'data:', 'blob:', ...cloudinaryHosts],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    // Comma-separated list of frontend origins, e.g. the Vercel deployment.
    name: 'strapi::cors',
    config: {
      origin: env.array('CORS_ORIGINS', ['http://localhost:3000']),
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
