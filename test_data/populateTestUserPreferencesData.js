
const pool = require('../server/modules/pool.js');

async function insertUserPreferences() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert user preferences
    const userPreferencesSqlText = `
      INSERT INTO "user_preferences" ("user_id", "max_price_range", "meat_preference", "religious_restrictions", "cuisine_types", "max_distance", "open_now", "accepts_large_parties")
      VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8),
          ($9, $10, $11, $12, $13, $14, $15, $16),
          ($17, $18, $19, $20, $21, $22, $23, $24),
          ($25, $26, $27, $28, $29, $30, $31, $32);
    `;

    const userPreferencesValues = [
      1, 1, 1, 1, [1, 2], 5, true, true,
      2, 2, 2, 2, [3, 4], 10, true, true,
      3, 3, 3, 3, [5, 6], 15, true, true,
      4, 4, 4, 4, [1, 3, 5], 20, true, true
    ];

    await client.query(userPreferencesSqlText, userPreferencesValues);

    // Insert user allergens
    const allergens = [
      { userId: 1, allergenIds: [1, 2] },
      { userId: 2, allergenIds: [3, 4] },
      { userId: 3, allergenIds: [5, 6] },
      { userId: 4, allergenIds: [7, 8, 9] }
    ];

    for (const { userId, allergenIds } of allergens) {
      for (const allergenId of allergenIds) {
        await client.query(`
          INSERT INTO "user_allergens" ("user_id", "allergen_id")
          VALUES ($1, $2);
        `, [userId, allergenId]);
      }
    }

    await client.query('COMMIT');

    console.log('Successfully inserted user preferences and allergens');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error inserting user preferences and allergens:', err.stack);
  } finally {
    client.release();
  }};

module.exports = insertUserPreferences;