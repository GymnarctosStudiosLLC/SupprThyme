const fs = require("fs");
const path = require("path");
const pool = require("../server/modules/pool.js");

const checkIfDatabaseExists = async (dbName) => {
  const query = `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`;
  const result = await pool.query(query);

  if (result.rowCount === 0) {
    console.log("DB does not exist. Creating ", dbName);
    await pool.query(`CREATE DATABASE ${dbName}`);
  }
};
const tablesArray = [
  // base tables
  path.join(__dirname, "user.sql"),
  path.join(__dirname, "groups.sql"),
  path.join(__dirname, "restaurants.sql"),
  path.join(__dirname, "details.sql"),
  path.join(__dirname, "group_members.sql"),
  path.join(__dirname, "votes.sql"),
  // lookup tables
  path.join(__dirname, "lookup_tables", "cuisine_types.sql"),
  path.join(__dirname, "lookup_tables", "meat_preferences.sql"),
  path.join(__dirname, "lookup_tables", "price_ranges.sql"),
  path.join(__dirname, "lookup_tables", "religious_restrictions.sql"),
  path.join(__dirname, "lookup_tables", "allergens.sql"),
  //create user preferences after lookups are complete
  path.join(__dirname, "user_preferences.sql"),
];

const addTables = async() => {
    for (const queryPath of tablesArray){
        try {
            const querycontent = fs.readFileSync(queryPath, 'utf-8');
            await pool.query(querycontent);
            console.log(`Query Complete: ${queryPath}`)
        }
        catch (error) {
            console.error(`Error executing query ${queryPath}:`, error);
        }
    }
};

checkIfDatabaseExists("SupprThyme").catch((error)=>console.error('Error creating database:', error));
addTables().catch((error)=>console.error('Error adding tables:', error));
