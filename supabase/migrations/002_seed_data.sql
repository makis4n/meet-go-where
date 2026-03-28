-- ============================================================
-- Migration 002: Seed data
-- Real Singapore venues + events for dev/demo
-- Prices in SGD cents (1500 = $15.00). null = unknown.
-- ============================================================

insert into listings (source, source_id, source_url, type, tags, name, description, image_url, address, postal_code, lat, lng, price_min, price_max, starts_at, ends_at, raw_data)
values

-- ------------------------------------------------------------
-- FOOD — sourced from Honeycombers style
-- ------------------------------------------------------------
(
  'honeycombers', 'lau-pa-sat',
  'https://thehoneycombers.com/singapore/best-hawker-centres-singapore/',
  'food',
  array['hawker', 'local', 'halal-options', 'supper'],
  'Lau Pa Sat',
  'Iconic Victorian cast-iron hawker centre in the CBD. Satay street fires up every evening. Great for after-work supper.',
  null,
  '18 Raffles Quay, Singapore',
  '048582', 1.2805, 103.8508,
  100, 1500,
  null, null, '{}'
),
(
  'honeycombers', 'maxwell-food-centre',
  'https://thehoneycombers.com/singapore/best-hawker-centres-singapore/',
  'food',
  array['hawker', 'local', 'chicken-rice', 'tian-tian'],
  'Maxwell Food Centre',
  'Home to Tian Tian Hainanese Chicken Rice and dozens of beloved stalls. Peak lunch crowds — go early.',
  null,
  '1 Kadayanallur St, Singapore',
  '069184', 1.2799, 103.8450,
  300, 1000,
  null, null, '{}'
),
(
  'honeycombers', 'tiong-bahru-market',
  'https://thehoneycombers.com/singapore/best-hawker-centres-singapore/',
  'food',
  array['hawker', 'local', 'breakfast', 'chee-cheong-fun'],
  'Tiong Bahru Market',
  'Two-storey wet market and hawker centre in one of Singapore''s hippest neighbourhoods. The char kway teow and chee cheong fun are legendary.',
  null,
  '30 Seng Poh Rd, Singapore',
  '168898', 1.2846, 103.8198,
  300, 1000,
  null, null, '{}'
),
(
  'honeycombers', 'old-airport-road-fc',
  'https://thehoneycombers.com/singapore/best-hawker-centres-singapore/',
  'food',
  array['hawker', 'local', 'supper', 'hokkien-mee'],
  'Old Airport Road Food Centre',
  'One of Singapore''s largest and oldest hawker centres. Multiple stalls with 50-year legacies. The hokkien mee and rojak are unmissable.',
  null,
  '51 Old Airport Rd, Singapore',
  '390051', 1.3076, 103.8827,
  300, 1200,
  null, null, '{}'
),
(
  'honeycombers', 'chomp-chomp',
  'https://thehoneycombers.com/singapore/best-outdoor-dining-singapore/',
  'food',
  array['hawker', 'supper', 'bbq', 'seafood', 'outdoor'],
  'Chomp Chomp Food Centre',
  'Beloved neighbourhood supper spot in Serangoon Gardens. Packed on weekends. BBQ stingray, carrot cake, and cold beer.',
  null,
  '20 Kensington Park Rd, Singapore',
  '557269', 1.3633, 103.8651,
  800, 2500,
  null, null, '{}'
),
(
  'honeycombers', 'atlas-bar',
  'https://thehoneycombers.com/singapore/best-bars-singapore/',
  'food',
  array['bar', 'cocktails', 'art-deco', 'gin', 'date-night'],
  'Atlas Bar',
  'Art Deco grand lobby bar in Parkview Square. Home to one of the world''s largest gin collections. Go for the atmosphere alone.',
  null,
  '600 North Bridge Rd, Parkview Square, Singapore',
  '188778', 1.2992, 103.8581,
  2000, 5000,
  null, null, '{}'
),
(
  'honeycombers', 'burnt-ends',
  'https://thehoneycombers.com/singapore/best-restaurants-singapore/',
  'food',
  array['bbq', 'modern-australian', 'fine-dining', 'wood-fired'],
  'Burnt Ends',
  'Dave Pynt''s celebrated modern BBQ restaurant. Four-tonne custom-built kiln. Book weeks ahead or join the walk-in queue at 6pm.',
  null,
  '20 Teck Lim Rd, Singapore',
  '088391', 1.2809, 103.8420,
  8000, 15000,
  null, null, '{}'
),
(
  'honeycombers', 'ya-kun-kaya-toast',
  'https://thehoneycombers.com/singapore/best-breakfast-spots-singapore/',
  'food',
  array['breakfast', 'kaya-toast', 'local', 'coffee', 'cheap'],
  'Ya Kun Kaya Toast (Far East Square)',
  'The original Ya Kun outlet. Kaya butter toast, soft-boiled eggs, and kopi. A Singapore breakfast institution since 1944.',
  null,
  '18 China St, #01-01, Singapore',
  '049560', 1.2849, 103.8492,
  400, 900,
  null, null, '{}'
),
(
  'honeycombers', 'ps-cafe-ann-siang',
  'https://thehoneycombers.com/singapore/best-cafes-singapore/',
  'food',
  array['cafe', 'brunch', 'truffle-fries', 'date-night', 'instagrammable'],
  'PS.Cafe Ann Siang Hill',
  'Tucked into a shophouse on Ann Siang Hill. Famous for truffle shoestring fries and weekend brunch. Lush outdoor terrace.',
  null,
  '45 Ann Siang Rd, Singapore',
  '069719', 1.2802, 103.8454,
  2500, 6000,
  null, null, '{}'
),
(
  'honeycombers', 'chinatown-complex',
  'https://thehoneycombers.com/singapore/best-hawker-centres-singapore/',
  'food',
  array['hawker', 'local', 'cheap', 'hong-kong-soya-sauce-chicken'],
  'Chinatown Complex Food Centre',
  'Singapore''s largest hawker centre. Home to Liao Fan (Hawker Chan), the world''s cheapest Michelin-starred meal. Cash only at most stalls.',
  null,
  '335 Smith St, Singapore',
  '050335', 1.2826, 103.8435,
  200, 1000,
  null, null, '{}'
),

-- ------------------------------------------------------------
-- EVENTS — sourced from SG Culture Pass style
-- ------------------------------------------------------------
(
  'sgculturepass', 'scp-national-museum-sg',
  'https://www.sgculturepass.gov.sg',
  'event',
  array['museum', 'history', 'culture', 'indoor', 'family'],
  'Story of the Forest — National Museum of Singapore',
  'Immersive installation featuring 60 animated natural history specimens from the William Farquhar Collection. Free with SG Culture Pass.',
  null,
  '93 Stamford Rd, Singapore',
  '178897', 1.2966, 103.8488,
  0, 0,
  '2026-01-01 09:00:00+08', '2026-12-31 21:00:00+08', '{}'
),
(
  'sgculturepass', 'scp-acm-permanent',
  'https://www.sgculturepass.gov.sg',
  'event',
  array['museum', 'culture', 'history', 'indoor', 'colonial'],
  'Asian Civilisations Museum',
  'Permanent collection spanning 5,000 years of Asian history. Galleries cover China, Southeast Asia, South Asia, and the ancient Mediterranean.',
  null,
  '1 Empress Place, Singapore',
  '179555', 1.2874, 103.8514,
  0, 0,
  '2026-01-01 10:00:00+08', '2026-12-31 21:00:00+08', '{}'
),
(
  'sgculturepass', 'scp-science-centre',
  'https://www.sgculturepass.gov.sg',
  'event',
  array['science', 'family', 'kids', 'interactive', 'indoor'],
  'Science Centre Singapore',
  'Over 1,000 interactive exhibits across 14 galleries. Includes the Omni-Theatre and a live exhibition on climate science.',
  null,
  '15 Science Centre Rd, Singapore',
  '609081', 1.3328, 103.7373,
  0, 0,
  '2026-01-01 10:00:00+08', '2026-12-31 17:00:00+08', '{}'
),
(
  'sgculturepass', 'scp-singapore-art-museum',
  'https://www.sgculturepass.gov.sg',
  'event',
  array['art', 'contemporary', 'culture', 'indoor'],
  'Singapore Art Museum',
  'Contemporary art museum showcasing Southeast Asian artists. Current exhibition features large-scale installations by regional artists.',
  null,
  '39 Armenia St, Singapore',
  '179941', 1.2981, 103.8494,
  0, 0,
  '2026-01-01 10:00:00+08', '2026-12-31 19:00:00+08', '{}'
),
(
  'sgculturepass', 'scp-national-gallery',
  'https://www.sgculturepass.gov.sg',
  'event',
  array['art', 'culture', 'history', 'indoor', 'colonial-architecture'],
  'National Gallery Singapore',
  'World''s largest public collection of Singapore and Southeast Asian art. Housed inside the former Supreme Court and City Hall.',
  null,
  '1 St Andrew''s Rd, Singapore',
  '178957', 1.2899, 103.8510,
  0, 0,
  '2026-01-01 10:00:00+08', '2026-12-31 19:00:00+08', '{}'
),
(
  'sgculturepass', 'scp-esplanade-free-performances',
  'https://www.sgculturepass.gov.sg',
  'event',
  array['music', 'performance', 'free', 'outdoor', 'waterfront'],
  'Esplanade Free Outdoor Performances',
  'Free performances at the Esplanade Outdoor Theatre and Concourse. Covers jazz, classical, theatre, and local indie acts. Check schedule online.',
  null,
  '1 Esplanade Dr, Singapore',
  '038981', 1.2897, 103.8556,
  0, 0,
  '2026-01-01 19:00:00+08', '2026-12-31 22:00:00+08', '{}'
),
(
  'sgculturepass', 'scp-gardens-by-the-bay-supertree',
  'https://www.sgculturepass.gov.sg',
  'event',
  array['outdoor', 'nature', 'family', 'lights', 'iconic'],
  'Gardens by the Bay — Supertree Grove & OCBC Skyway',
  'Free access to the Supertree Grove. OCBC Skyway (elevated walkway) requires a ticket. Garden Rhapsody light show runs nightly at 7:45pm and 8:45pm.',
  null,
  '18 Marina Gardens Dr, Singapore',
  '018953', 1.2816, 103.8636,
  0, 800,
  '2026-01-01 05:00:00+08', '2026-12-31 02:00:00+08', '{}'
),
(
  'sgculturepass', 'scp-haw-par-villa',
  'https://www.sgculturepass.gov.sg',
  'event',
  array['culture', 'history', 'quirky', 'outdoor', 'free'],
  'Haw Par Villa',
  'Free-entry theme park with over 1,000 statues depicting Chinese folklore and mythology. Famously includes the Ten Courts of Hell diorama.',
  null,
  '262 Pasir Panjang Rd, Singapore',
  '118628', 1.2822, 103.7800,
  0, 0,
  '2026-01-01 09:00:00+08', '2026-12-31 18:00:00+08', '{}'
);
