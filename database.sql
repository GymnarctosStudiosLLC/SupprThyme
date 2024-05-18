-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
DROP TABLE IF EXISTS "user", "restaurants";

CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY,
  location_id VARCHAR(255),
  name VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  num_reviews VARCHAR(255),
  timezone VARCHAR(255),
  location_string VARCHAR(255),
  photo JSONB,
  api_detail_url VARCHAR(255),
  awards JSONB,
  doubleclick_zone VARCHAR(255),
  preferred_map_engine VARCHAR(255),
  raw_ranking DECIMAL(16, 14),
  ranking_geo VARCHAR(255),
  ranking_geo_id VARCHAR(255),
  ranking_position VARCHAR(255),
  ranking_denominator VARCHAR(255),
  ranking_category VARCHAR(255),
  ranking VARCHAR(255),
  distance DECIMAL(10, 8),
  distance_string VARCHAR(255),
  bearing DECIMAL(10, 8),
  rating DECIMAL(3, 2),
  is_closed BOOLEAN,
  open_now_text VARCHAR(255),
  is_long_closed BOOLEAN,
  price_level VARCHAR(255),
  price VARCHAR(255),
  description TEXT,
  web_url VARCHAR(255),
  write_review VARCHAR(255),
  ancestors JSONB,
  category JSONB,
  subcategory JSONB,
  parent_display_name VARCHAR(255),
  is_jfy_enabled BOOLEAN,
  nearest_metro_station JSONB,
  phone VARCHAR(255),
  website VARCHAR(255),
  email VARCHAR(255),
  address_obj JSONB,
  address VARCHAR(255),
  hours JSONB,
  is_candidate_for_contact_info_suppression BOOLEAN,
  cuisine JSONB,
  dietary_restrictions JSONB,
  booking JSONB,
  reserve_info JSONB,
  establishment_types JSONB
);