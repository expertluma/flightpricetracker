-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supabase_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  is_pro BOOLEAN DEFAULT false,
  lemon_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tracked_flights table
CREATE TABLE tracked_flights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  origin VARCHAR(10) NOT NULL,
  destination VARCHAR(10) NOT NULL,
  depart_date DATE NOT NULL,
  return_date DATE,
  adults INTEGER NOT NULL DEFAULT 1,
  cabin VARCHAR(50) DEFAULT 'ECONOMY',
  stops VARCHAR(50) DEFAULT 'any',
  search_url TEXT NOT NULL,
  current_price INTEGER NOT NULL,
  lowest_price INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create price_history table
CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flight_id UUID NOT NULL REFERENCES tracked_flights(id) ON DELETE CASCADE,
  price INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tracked_flights_user_id ON tracked_flights(user_id);
CREATE INDEX idx_price_history_flight_id ON price_history(flight_id);
CREATE INDEX idx_price_history_created_at ON price_history(created_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracked_flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = supabase_user_id);

CREATE POLICY "Users can view their own tracked flights" ON tracked_flights
  FOR SELECT USING (user_id = (SELECT id FROM users WHERE supabase_user_id = auth.uid()));

CREATE POLICY "Users can insert their own tracked flights" ON tracked_flights
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM users WHERE supabase_user_id = auth.uid()));

CREATE POLICY "Users can view their own price history" ON price_history
  FOR SELECT USING (flight_id IN (
    SELECT id FROM tracked_flights WHERE user_id = (SELECT id FROM users WHERE supabase_user_id = auth.uid())
  ));
