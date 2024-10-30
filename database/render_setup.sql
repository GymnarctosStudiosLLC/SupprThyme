-- Create schema
CREATE SCHEMA IF NOT EXISTS suppthyme;

-- Set the search path to the new schema
SET search_path TO suppthyme;

-- Create lookup tables
\i lookup_tables/price_ranges.sql
\i lookup_tables/meat_preferences.sql
\i lookup_tables/religious_restrictions.sql
\i lookup_tables/cuisine_types.sql
\i lookup_tables/allergens_list.sql

-- Create main tables
\i user.sql
\i groups.sql
\i user_preferences.sql
\i group_members.sql
\i votes.sql
\i restaurants.sql
\i details.sql
\i user_allergens.sql
\i user_cuisine_types.sql

-- No initial data insertion for production