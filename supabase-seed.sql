-- Run this entire script in your Supabase SQL Editor to set up tables & sample data

-- 1. Create Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'host', 'admin')),
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Turn on RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Create Stays table
CREATE TABLE IF NOT EXISTS public.stays (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  host_id UUID REFERENCES public.profiles(id),
  host JSONB,
  location TEXT,
  lat FLOAT,
  lng FLOAT,
  price NUMERIC,
  maxGuests INT,
  rooms INT,
  rating FLOAT,
  reviews INT DEFAULT 0,
  coverImage TEXT,
  images JSONB,
  amenities JSONB,
  description TEXT,
  about TEXT,
  nearbyAttractions JSONB,
  checkIn TEXT,
  checkOut TEXT,
  rules JSONB,
  topRated BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  tags JSONB,
  status TEXT DEFAULT 'active'
);

ALTER TABLE public.stays ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Stays are viewable by everyone" ON public.stays FOR SELECT USING (true);
CREATE POLICY "Hosts can insert their own stays" ON public.stays FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Hosts can update their own stays" ON public.stays FOR UPDATE USING (auth.uid() = host_id);


-- 3. Create Guides table
CREATE TABLE IF NOT EXISTS public.guides (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  host_id UUID REFERENCES public.profiles(id),
  avatar TEXT,
  title TEXT,
  experience TEXT,
  languages JSONB,
  specialties JSONB,
  rating FLOAT,
  reviews INT DEFAULT 0,
  price NUMERIC,
  priceUnit TEXT,
  location TEXT,
  phone TEXT,
  email TEXT,
  coverImage TEXT,
  images JSONB,
  bio TEXT,
  certifications JSONB,
  verified BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true,
  tags JSONB,
  status TEXT DEFAULT 'active'
);

ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guides are viewable by everyone" ON public.guides FOR SELECT USING (true);
CREATE POLICY "Hosts can insert their own guides" ON public.guides FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Hosts can update their own guides" ON public.guides FOR UPDATE USING (auth.uid() = host_id);


-- 4. Create Transport table
CREATE TABLE IF NOT EXISTS public.transport (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner TEXT,
  host_id UUID REFERENCES public.profiles(id),
  avatar TEXT,
  type TEXT,
  vehicles JSONB,
  rating FLOAT,
  reviews INT DEFAULT 0,
  phone TEXT,
  email TEXT,
  location TEXT,
  coverImage TEXT,
  images JSONB,
  description TEXT,
  features JSONB,
  verified BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active'
);

ALTER TABLE public.transport ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Transport viewable by everyone" ON public.transport FOR SELECT USING (true);
CREATE POLICY "Hosts can insert their own transport" ON public.transport FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Hosts can update their own transport" ON public.transport FOR UPDATE USING (auth.uid() = host_id);


-- 5. Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lt_booking_id TEXT, -- e.g., 'LT-12345678'
  user_id UUID REFERENCES public.profiles(id),
  type TEXT, -- 'stay', 'guide', 'transport', 'package'
  listing_id TEXT,
  listing_name TEXT,
  listing_image TEXT,
  amount NUMERIC,
  dates JSONB,
  guests INT,
  contact JSONB,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 6. Seed Data (Dummy data without real host_id yet)
-- Stays
INSERT INTO public.stays (id, name, type, host, location, lat, lng, price, maxGuests, rooms, rating, reviews, coverImage, images, amenities, description, about, nearbyAttractions, checkIn, checkOut, rules, topRated, verified, tags) VALUES
('bamboo-haven', 'Bamboo Haven Homestay', 'Homestay', '{"name": "Liana Hnamte", "avatar": "LH", "phone": "+91 98765 43210", "since": "2022"}', 'Reiek Village, Mamit District', 23.7152, 92.5694, 1800, 4, 2, 4.9, 47, 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80', '["https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80","https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800&q=80","https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&q=80","https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80"]', '["WiFi", "Parking", "Home-cooked Food", "Hot Water", "Valley View", "Bonfire"]', 'Nestled in traditional Mizo style on the slopes of Reiek Hill, Bamboo Haven offers an intimate, authentic experience.', 'Liana and her family offer warm Mizo hospitality in their traditional home.', '["Reiek Heritage Village (5 min)", "Hmuifang (45 min)", "Aizawl (35 km)"]', '14:00', '11:00', '["No smoking inside", "Quiet hours after 10 PM", "No outside food", "Pets on request"]', true, true, '["hidden-gem", "budget-friendly"]'),
('champhai-farmstay', 'Champhai Valley Farmstay', 'Homestay', '{"name": "Mimi Lalhmangaihi", "avatar": "ML", "phone": "+91 65432 10987", "since": "2022"}', 'Champhai, Champhai District', 23.4692, 93.3224, 1500, 4, 2, 4.6, 54, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80', '["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80","https://images.unsplash.com/photo-1474978528675-4a50a4508dc4?w=800&q=80","https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80","https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80"]', '["Organic Farm", "Home-cooked Food", "Fruit Picking", "Valley View", "Parking", "Hot Water"]', 'Experience life on a working Mizo farm in the fruit bowl of Champhai.', 'Mimi''s family has farmed this land for 3 generations.', '["Myanmar border viewpoint", "Champhai museum", "Murlen National Park (2 hrs)"]', '14:00', '11:00', '["Farm work is optional but encouraged", "Organic produce only", "Early breakfast at 7 AM"]', false, true, '["farm-experience", "budget-friendly"]'),
('tamdil-lakehouse', 'Tam Dil Lakehouse', 'Hotel', '{"name": "Robert Lalthanmawia", "avatar": "RL", "phone": "+91 54321 09876", "since": "2020"}', 'Tam Dil, Saitul District', 23.6177, 92.8894, 3200, 2, 1, 4.9, 89, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80', '["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80","https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80","https://images.unsplash.com/photo-1602343168117-bb8ded4c97a2?w=800&q=80","https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80"]', '["Lakefront Room", "Kayaking", "WiFi", "AC", "Restaurant", "Hot Water", "Parking", "Sunrise View"]', 'Perched right on the edge of the mirror-calm Tam Dil Lake, this boutique lakehouse offers Mizoram''s most romantic stay.', 'Robert built this lakehouse himself, inspired by Scandinavian architecture.', '["Tam Dil Lake (on property)", "Tam Dil sanctuary", "Saitul (30 min)"]', '15:00', '11:00', '["Adults only", "No loud parties", "Checkout strictly at 11 AM"]', true, true, '["romantic", "lakefront", "premium"]')
ON CONFLICT (id) DO NOTHING;

-- Guides
INSERT INTO public.guides (id, name, avatar, title, experience, languages, specialties, rating, reviews, price, priceUnit, location, phone, email, coverImage, images, bio, certifications, verified, available, tags) VALUES
('guide-zova', 'Zova Lalchhuanawma', 'ZL', 'Expert Trekking & Wildlife Guide', '10 years', '["English", "Mizo", "Hindi"]', '["Phawngpui Trek", "Wildlife Spotting", "Bird Watching", "Photography Tours"]', 4.9, 88, 1, 'per day', 'Aizawl (covers all districts)', '+91 98765 11111', 'zova.guide@lushaitrips.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80', '["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80","https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"]', 'Born and raised in the highlands of Mizoram, Zova has led over 300 trekking expeditions.', '["First Aid Certified", "Wildlife Institute of India", "Ministry of Tourism Certified"]', true, true, '["trekking", "wildlife", "birding"]'),
('guide-mary', 'Mary Vanlalruati', 'MV', 'Cultural & Heritage Tour Guide', '7 years', '["English", "Mizo", "Hindi", "Bengali"]', '["Aizawl City Tours", "Mizo Culture", "Traditional Weaving", "Village Walks"]', 4.8, 62, 1200, 'per day', 'Aizawl', '+91 87654 22222', 'mary.guide@lushaitrips.com', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80', '["https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80","https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80","https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80"]', 'Mary holds a Master''s degree in Mizo history.', '["Ministry of Tourism Certified", "Heritage Interpreter (INTACH)"]', true, true, '["culture", "heritage", "city-tour"]'),
('guide-rema', 'Rema Chhakchhuak', 'RC', 'Adventure Sports & River Guide', '5 years', '["English", "Mizo"]', '["River Kayaking", "Rappelling", "Jungle Camping", "Night Trekking"]', 4.7, 41, 1800, 'per day', 'Serchhip / South Mizoram', '+91 76543 33333', 'rema.guide@lushaitrips.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', '["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80","https://images.unsplash.com/photo-1503264116251-35a269479413?w=800&q=80","https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80"]', 'Rema is the go-to guide for adrenaline seekers in Mizoram.', '["Swift Water Rescue Certified", "Wilderness First Aid", "Adventure Tourism Certified"]', true, true, '["adventure", "kayaking", "camping"]')
ON CONFLICT (id) DO NOTHING;

-- Transport
INSERT INTO public.transport (id, name, owner, avatar, type, vehicles, rating, reviews, phone, email, location, coverImage, images, description, features, verified, available) VALUES
('transport-raj', 'Raj Mizoram Travels', 'Rajesh Chhakchhuak', 'RC', 'Car & SUV Rental', '[{"name": "Toyota Innova Crysta", "capacity": 7, "price": 3500, "priceUnit": "per day (fuel incl.)"},{"name": "Maruti Ertiga", "capacity": 7, "price": 2500, "priceUnit": "per day (fuel incl.)"},{"name": "Mahindra Bolero", "capacity": 9, "price": 3000, "priceUnit": "per day (fuel incl.)"}]', 4.8, 76, '+91 98765 44444', 'raj.travels@lushaitrips.com', 'Aizawl (airport pickup available)', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80', '["https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80","https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80","https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?w=800&q=80"]', 'Raj Mizoram Travels offers reliable, comfortable transport across Mizoram''s mountain roads.', '["Airport Pickup", "AC Vehicles", "Experienced Drivers", "Night Driving", "All Districts"]', true, true),
('transport-zara', 'Zara Mountain Bikes', 'Zaramsanga Colney', 'ZC', 'Motorcycle & Bike Rental', '[{"name": "Royal Enfield Himalayan", "capacity": 2, "price": 1800, "priceUnit": "per day"},{"name": "Honda CB350", "capacity": 2, "price": 1400, "priceUnit": "per day"},{"name": "Mountain Bicycle", "capacity": 1, "price": 400, "priceUnit": "per day"}]', 4.6, 38, '+91 87654 55555', 'zara.bikes@lushaitrips.com', 'Aizawl', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80","https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80","https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&q=80"]', 'Explore Mizoram the way it was meant to be explored — on two wheels.', '["Helmets Included", "Riding Gear", "Route Maps", "Breakdown Assistance", "Delivery to Hotel"]', true, true),
('transport-lal', 'Lal Shared Sumo Service', 'Lalbiakzuala', 'LB', 'Shared Sumo / Van', '[{"name": "Tata Sumo (Shared)", "capacity": 10, "price": 350, "priceUnit": "per seat per route"},{"name": "Force Traveller Van", "capacity": 16, "price": 4500, "priceUnit": "per day (private)"}]', 4.4, 55, '+91 76543 66666', 'lal.sumo@lushaitrips.com', 'Aizawl (all major routes)', 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&q=80', '["https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&q=80","https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?w=800&q=80","https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80"]', 'Budget-friendly shared Sumo services connect all major towns and tourist spots.', '["Budget Friendly", "All Major Routes", "Daily Departures", "Group Discounts", "Private Option"]', true, true)
ON CONFLICT (id) DO NOTHING;
