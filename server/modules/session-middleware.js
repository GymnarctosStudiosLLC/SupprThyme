// No changes should be required in this file

import expressSession from 'express-session';
import pgSession from 'connect-pg-simple';
import pool from './pool.js';
import { badSecret, exampleBadSecret } from '../constants/warnings.js';

const PgSession = pgSession(expressSession);

/*
  The session makes it so a user can enters their username and password one time,
  and then we can keep them logged in. We do this by giving them a really long random string
  that the browser will pass back to us with every single request. The long random string is
  something the server can confirm, and then we know that we have the right user.

  You can see this string that gets passed back and forth in the
  `application` ->  `storage` -> `cookies` section of the chrome debugger
*/

const serverSessionSecret = () => {
  if (
    !process.env.SERVER_SESSION_SECRET ||
    process.env.SERVER_SESSION_SECRET.length < 8 ||
    process.env.SERVER_SESSION_SECRET === exampleBadSecret
  ) {
    // Warning if user doesn't have a good secret
    console.log(badSecret);
  }

  return process.env.SERVER_SESSION_SECRET;
};

let pruneSessionInterval = 60;
if (process.env.NODE_ENV === 'test') {
    pruneSessionInterval = false;
}

const sessionMiddleware = expressSession({
    store: new PgSession({
        pool,
        pruneSessionInterval,
        createTableIfMissing: true,
    }),
    secret: serverSessionSecret() || 'secret', // please set this in your .env file
    name: 'user', // this is the name of the req.variable. 'user' is convention, but not required
    saveUninitialized: false,
    resave: false,
    // This isn't currently being used but should be left in for future proofing
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // cookie expires after 7 days 
      httpOnly: true, // prevents client-side JS from accessing cookie 
      secure: false // can only be set to true if the app uses https
    },
});

export default sessionMiddleware;
