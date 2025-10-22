-- Enable PostGIS extension for geolocation features
CREATE EXTENSION IF NOT EXISTS postgis;

-- Function to find clubs near a given location
-- Based on the specification document for ANT Digital Platform
CREATE OR REPLACE FUNCTION get_clubs_near(
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  km INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  church_name TEXT,
  zone_name TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  distance_km DOUBLE PRECISION,
  member_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.description,
    c.church_name,
    c.zone_name,
    c.city,
    c.state,
    c.country,
    c.latitude,
    c.longitude,
    -- Calculate distance in kilometers using PostGIS
    ST_Distance(
      ST_MakePoint(c.longitude, c.latitude)::geography,
      ST_MakePoint(lon, lat)::geography
    ) / 1000 AS distance_km,
    -- Count members in each club
    (SELECT COUNT(*) FROM club_members WHERE club_id = c.id) AS member_count
  FROM clubs c
  WHERE 
    c.latitude IS NOT NULL 
    AND c.longitude IS NOT NULL
    -- Filter by distance using PostGIS
    AND ST_DWithin(
      ST_MakePoint(c.longitude, c.latitude)::geography,
      ST_MakePoint(lon, lat)::geography,
      km * 1000  -- Convert km to meters
    )
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;

-- Create spatial index for better performance
CREATE INDEX IF NOT EXISTS idx_clubs_location 
ON clubs USING GIST (ST_MakePoint(longitude, latitude)::geography);

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_clubs_near(DOUBLE PRECISION, DOUBLE PRECISION, INTEGER) TO authenticated;
