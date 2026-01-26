import { Auth0Client } from '@auth0/nextjs-auth0/server';

const auth0 = new Auth0Client();

export const GET = auth0.middleware.bind(auth0);
