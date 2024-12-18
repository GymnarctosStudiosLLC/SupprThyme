import express from 'express';
import { rejectUnauthenticated } from '../modules/authentication-middleware.js';
import { encryptPassword, comparePassword } from '../modules/encryption.js';
import pool from '../modules/pool.js';
import { passport as userStrategy } from '../strategies/user.strategy.js';
import GeocodingError from '../constants/GeocodingError.js';
import { normalizeLocation } from '../modules/Geolocation.js';

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles Ajax request for user profile if user is authenticated
router.get('/profile', rejectUnauthenticated, async (req, res) => {
  const userId = req.user.id;

  // Fetch user information with address details using a database query
  const { rows } = await pool.query(
    `
    SELECT "user".id, "user".email, user_addresses.street1, user_addresses.street2, user_addresses.city, user_addresses.state, user_addresses.zip, user_addresses.country
    FROM "user"
    LEFT JOIN user_addresses ON "user".id = user_addresses.user_id
    WHERE "user".id = $1
  `,
    [userId]
  );

  const user = rows[0];

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(user);
});

// Handles GET request with query parameter for searching users
router.get('/search', (req, res) => {
  const searchTerm = req.query.search;

  pool.query('SELECT * FROM "user" WHERE username ILIKE $1', [`%${searchTerm}%`])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.error('Error completing SELECT user query', error);
      res.sendStatus(500);
    });
});

// GET route to retrieve user information with address details
router.get('/:id', async (req, res) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'User id must be an integer' });
  }

  try {
    // Fetch user information with address details using a database query
    const { rows } = await pool.query(
      `
      SELECT "user".id, "user".username, "user".email, user_addresses.street1, user_addresses.street2, user_addresses.city, user_addresses.state, user_addresses.zip, user_addresses.country
      FROM "user"
      LEFT JOIN user_addresses ON "user".id = user_addresses.user_id
      WHERE "user".id = $1
    `,
      [userId]
    );

    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).json({ message: 'Error fetching user information' });
  }
});

// endpoint to normalize user's location
router.get('/normalizeLocation', async (req, res) => {
  const { city, state } = req.query;

  if (!city || !state) {
    return res.status(400).json({ error: 'City and state are required' });
  }
  
  try {
    const normalizedLocation = await normalizeLocation(city, state);
    res.json(normalizedLocation);
  } catch (error) {
    console.error('Error normalizing location:', error);
    if (error instanceof GeocodingError) {
      res.status(400).json({ error: 'Failed to geocode location' });
    } else {
      res.status(500).json({ error: 'Failed to normalize location' });
    }
  }
});

// POST route to handle user registration and address storage
router.post('/register', async (req, res) => {
  try {
    const { username, password, email, address } = req.body;

    // Insert user details into the 'user' table
    const userResult = await pool.query(
      `
      INSERT INTO "user" (username, password, email)
      VALUES ($1, $2, $3)
      RETURNING id
    `,
      [username, encryptPassword(password), email]
    );

    const userId = userResult.rows[0].id;

    // Insert address details into the 'user_addresses' table
    await pool.query(
      `
      INSERT INTO user_addresses (user_id, street1, street2, city, state, zip, country)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
      [
        userId,
        address.street1,
        address.street2,
        address.city,
        address.state,
        address.zip,
        address.country,
      ]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    // Update the user's latitude and longitude
    await pool.query(
      'UPDATE "user" SET latitude = $1, longitude = $2 WHERE id = $3',
      [latitude, longitude, req.user.id]
    );

    res.sendStatus(200);
  } catch (error) {
    console.error('Error updating user geolocation:', error);
    res.status(500).json({ message: 'Error updating user geolocation' });
  }
});

// clear all server session information about this user
router.post('/logout', (req, res, next) => {
  // Use passport's built-in method to log out the user
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(200);
  });
});

export default router;
