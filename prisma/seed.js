const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database for Rentals Kenya...');

  // 1. Create Default Admin User
  const passwordHash = await bcrypt.hash('Admin@Rentals2026!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rentals.ke' },
    update: {
      role: 'ADMIN',
      status: 'VERIFIED',
      isEmailVerified: true,
    },
    create: {
      name: 'Rentals Kenya Admin',
      email: 'admin@rentals.ke',
      phone: '+254100382352',
      country: 'Kenya',
      passwordHash: passwordHash,
      role: 'ADMIN',
      status: 'VERIFIED',
      isEmailVerified: true,
    },
  });
  console.log(`Admin user created: ${admin.email}`);

  // Demo Verified Buyer
  const buyerHash = await bcrypt.hash('Buyer@Rentals2026!', 10);
  const verifiedBuyer = await prisma.user.upsert({
    where: { email: 'buyer@rentals.ke' },
    update: {
      status: 'VERIFIED',
      isEmailVerified: true,
    },
    create: {
      name: 'Brian Kimani',
      email: 'buyer@rentals.ke',
      phone: '+254 722 000 111',
      country: 'Kenya',
      preferredContact: 'WHATSAPP',
      passwordHash: buyerHash,
      role: 'USER',
      status: 'VERIFIED',
      isEmailVerified: true,
    },
  });
  console.log(`Verified demo buyer created: ${verifiedBuyer.email}`);

  // Demo Unverified Buyer with code 483921
  const codeHash = await bcrypt.hash('483921', 10);
  const unverifiedBuyer = await prisma.user.upsert({
    where: { email: 'unverified@rentals.ke' },
    update: {},
    create: {
      name: 'Grace Njeri',
      email: 'unverified@rentals.ke',
      phone: '+254 733 111 222',
      country: 'Kenya',
      preferredContact: 'EMAIL',
      passwordHash: buyerHash,
      role: 'USER',
      status: 'UNVERIFIED',
      isEmailVerified: false,
      verificationCodeHash: codeHash,
      verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
      verificationAttempts: 0,
    },
  });
  console.log(`Unverified demo buyer created: ${unverifiedBuyer.email}`);

  // 2. Seed Dynamic Site Settings
  const settings = [
    { key: 'company_name', value: 'Rentals Kenya', description: 'Official company name' },
    { key: 'brand_name', value: 'Rentals.ke', description: 'Platform brand domain' },
    { key: 'whatsapp_number', value: '254100382352', description: 'Primary WhatsApp number (digits only with country code)' },
    { key: 'phone_number', value: '+254100382352', description: 'Support phone number' },
    { key: 'email', value: 'invest@rentals.ke', description: 'Primary investor inquiries email' },
    { key: 'office_address', value: 'The Oval, 4th Floor, Ring Road Parklands, Westlands, Nairobi, Kenya', description: 'Physical office address' },
    { key: 'business_hours', value: 'Mon - Sat: 8:00 AM - 6:00 PM EAT', description: 'Office operating hours' },
    { key: 'instagram_handle', value: 'rentals.kenya', description: 'Instagram handle' },
    { key: 'instagram_url', value: 'https://instagram.com/rentals.kenya', description: 'Instagram URL' },
    { key: 'default_currency', value: 'KES', description: 'Standard currency display' },
    { key: 'meta_title', value: 'Rentals Kenya | Houses & Apartments for Rent in Kenya | Turnkey Airbnb Setups', description: 'SEO title' },
    { key: 'meta_description', value: 'Discover verified rental houses and apartments across Nairobi and Kenya, along with turnkey Airbnb business takeovers and furnished setups for sale.', description: 'SEO meta description' },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log('Site settings seeded.');

  // 3. Seed Amenities
  const amenitiesData = [
    { name: 'High-Speed WiFi', icon: 'Wifi', category: 'Connectivity' },
    { name: 'Rooftop Heated Pool', icon: 'Waves', category: 'Wellness' },
    { name: 'Fully Equipped Gym', icon: 'Dumbbell', category: 'Wellness' },
    { name: '24/7 Manned Security', icon: 'ShieldCheck', category: 'Security' },
    { name: 'Full Backup Generator', icon: 'Zap', category: 'Utilities' },
    { name: 'Borehole Water Backup', icon: 'Droplets', category: 'Utilities' },
    { name: 'CCTV Surveillance', icon: 'Video', category: 'Security' },
    { name: 'High-Speed Elevators', icon: 'ArrowUpDown', category: 'Building' },
    { name: 'Dedicated Covered Parking', icon: 'Car', category: 'Building' },
    { name: 'Scenic Balcony', icon: 'Maximize2', category: 'Apartment' },
    { name: 'Modern Fitted Kitchen', icon: 'Utensils', category: 'Apartment' },
    { name: 'Smart TV & Soundbar', icon: 'Tv', category: 'Entertainment' },
    { name: 'Fully Furnished & Styled', icon: 'Sparkles', category: 'Furnishing' },
    { name: 'Keyless Digital Smart Lock', icon: 'Key', category: 'Access' },
    { name: 'Resident Rooftop Lounge', icon: 'Sun', category: 'Wellness' },
    { name: 'In-Unit Laundry Setup', icon: 'Package', category: 'Utilities' },
  ];

  const amenityMap = {};
  for (const a of amenitiesData) {
    const amenity = await prisma.amenity.upsert({
      where: { name: a.name },
      update: {},
      create: a,
    });
    amenityMap[a.name] = amenity.id;
  }
  console.log('Amenities seeded.');

  // 4. Seed Strategic Locations
  const locationsData = [
    {
      name: 'Kilimani',
      slug: 'kilimani',
      county: 'Nairobi',
      description: 'Nairobi’s premier short-term rental corridor, renowned for exceptional Airbnb occupancy, close proximity to Yaya Centre, fine dining, and diplomatic hubs.',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      displayOrder: 1,
    },
    {
      name: 'Westlands',
      slug: 'westlands',
      county: 'Nairobi',
      description: 'The undisputed commercial and nightlife epicentre of East Africa. High demand from expatriates, multinational business travellers, and corporate executives.',
      imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      displayOrder: 2,
    },
    {
      name: 'Kileleshwa',
      slug: 'kileleshwa',
      county: 'Nairobi',
      description: 'Serene upscale residential enclave offering modern multi-bedroom apartments favored by family vacationers, diaspora holidaymakers, and long-term expatriates.',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      displayOrder: 3,
    },
    {
      name: 'Diani Beach',
      slug: 'diani',
      county: 'Kwale',
      description: 'Award-winning white sand beach destination. Premium holiday rental villas and serviced apartments commanding lucrative peak season rates and international tourist traffic.',
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      displayOrder: 4,
    },
    {
      name: 'Ruaka',
      slug: 'ruaka',
      county: 'Kiambu',
      description: 'Fast-growing high-yield suburban hub bordering the UN complex in Gigiri and Two Rivers Mall. High rental yields at attractive entry-level capital outlays.',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      isFeatured: true,
      displayOrder: 5,
    },
    {
      name: 'Naivasha',
      slug: 'naivasha',
      county: 'Nakuru',
      description: 'Kenya’s leading weekend getaway and conferencing haven around Lake Naivasha, boasting consistent weekend bookings and corporate retreat demand.',
      imageUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1000&q=80',
      isFeatured: false,
      displayOrder: 6,
    },
  ];

  for (const loc of locationsData) {
    await prisma.location.upsert({
      where: { slug: loc.slug },
      update: loc,
      create: loc,
    });
  }
  console.log('Locations seeded.');

  // 5. Seed Realistic Properties
  const propertiesData = [
    {
      title: 'Modern 1-Bedroom Airbnb Haven with Rooftop Heated Pool',
      slug: 'modern-1-bedroom-airbnb-haven-kilimani',
      description: 'A turnkey, designer-furnished 1-bedroom apartment situated along Argwings Kodhek Road in the heart of Kilimani. Designed specifically for the discerning business executive and leisure traveler, this unit comes fully accessorized with hotel-grade linens, smart lock access, and bespoke Scandinavian furniture. Building amenities feature a rooftop infinity heated pool, fitness studio, full backup generator, and round-the-clock concierge.\n\nImmediate handover ready with active Airbnb profile transfer option available.',
      propertyType: 'Apartment',
      bedrooms: 1,
      bathrooms: 1,
      sizeSqft: 620,
      furnishing: 'Furnished',
      county: 'Nairobi',
      town: 'Nairobi',
      neighbourhood: 'Kilimani',
      address: 'Argwings Kodhek Road, Kilimani',
      price: 6800000,
      currency: 'KES',
      isAirbnbReady: true,
      isFeatured: true,
      status: 'AVAILABLE',
      estNightlyRate: 4500,
      estMonthlyIncome: 88000,
      estAnnualIncome: 1056000,
      estOccupancyRate: 72,
      estRoiPercentage: 15.5,
      serviceCharge: 6500,
      managementFee: 15,
      investmentNotes: 'Based on 72% average annual occupancy at KES 4,500/night net of platform fees. Kilimani boasts Kenya’s highest density of short-term rental demand.',
      featuredImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      seoTitle: '1 Bedroom Airbnb Ready Apartment For Sale in Kilimani, Nairobi | Rentals Kenya',
      seoDescription: 'High-ROI 1-bedroom turnkey Airbnb apartment in Kilimani with heated pool and backup power. Fully furnished and ready to generate income.',
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
      ],
      amenityNames: [
        'High-Speed WiFi',
        'Rooftop Heated Pool',
        'Fully Equipped Gym',
        '24/7 Manned Security',
        'Full Backup Generator',
        'Borehole Water Backup',
        'CCTV Surveillance',
        'High-Speed Elevators',
        'Dedicated Covered Parking',
        'Scenic Balcony',
        'Modern Fitted Kitchen',
        'Smart TV & Soundbar',
        'Fully Furnished & Styled',
        'Keyless Digital Smart Lock',
      ],
    },
    {
      title: 'Executive 2-Bedroom Dual-Key Investment Apartment',
      slug: 'executive-2-bedroom-dual-key-westlands',
      description: 'An architectural marvel in Westlands offering an innovative Dual-Key layout. The unit can be operated as one generous 2-bedroom luxury residence or split into two autonomous rental units (a 1-bedroom suite and a self-contained studio), maximizing Airbnb booking frequency and blended occupancy.\n\nStrategically located walking distance from prime commercial towers, multinational headquarters, and fine dining corridors. Equipped with a rooftop running track, co-working club, and high-speed fiber.',
      propertyType: 'Apartment',
      bedrooms: 2,
      bathrooms: 2,
      sizeSqft: 1100,
      furnishing: 'Furnished',
      county: 'Nairobi',
      town: 'Nairobi',
      neighbourhood: 'Westlands',
      address: 'Rhapta Road, Westlands',
      price: 13500000,
      currency: 'KES',
      isAirbnbReady: true,
      isFeatured: true,
      status: 'AVAILABLE',
      estNightlyRate: 8500,
      estMonthlyIncome: 175000,
      estAnnualIncome: 2100000,
      estOccupancyRate: 76,
      estRoiPercentage: 15.6,
      serviceCharge: 11000,
      managementFee: 15,
      investmentNotes: 'Dual-key flexibility allows simultaneous booking of both keys, boosting yield during corporate high seasons.',
      featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      ],
      amenityNames: [
        'High-Speed WiFi',
        'Rooftop Heated Pool',
        'Fully Equipped Gym',
        '24/7 Manned Security',
        'Full Backup Generator',
        'CCTV Surveillance',
        'High-Speed Elevators',
        'Dedicated Covered Parking',
        'Scenic Balcony',
        'Modern Fitted Kitchen',
        'Smart TV & Soundbar',
        'Fully Furnished & Styled',
        'Keyless Digital Smart Lock',
        'Resident Rooftop Lounge',
      ],
    },
    {
      title: 'Chic Compact Studio Apartment with High Rental Velocity',
      slug: 'chic-compact-studio-kilimani-yaya',
      description: 'Ideal starter property for first-time real estate investors or passive income accumulators. This compact studio near Yaya Centre combines low capital entry with extraordinarily high booking velocity. Designed with space-saving custom joinery, integrated breakfast bar, and ambient recessed lighting.',
      propertyType: 'Studio',
      bedrooms: 1,
      bathrooms: 1,
      sizeSqft: 380,
      furnishing: 'Furnished',
      county: 'Nairobi',
      town: 'Nairobi',
      neighbourhood: 'Kilimani',
      address: 'Chania Avenue, Off Ring Road Kilimani',
      price: 4600000,
      currency: 'KES',
      isAirbnbReady: true,
      isFeatured: true,
      status: 'AVAILABLE',
      estNightlyRate: 3500,
      estMonthlyIncome: 65000,
      estAnnualIncome: 780000,
      estOccupancyRate: 75,
      estRoiPercentage: 16.9,
      serviceCharge: 4500,
      managementFee: 15,
      investmentNotes: 'Outstanding entry-level investment with lower maintenance overheads and fast payback period.',
      featuredImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502005229762-ee1afd30f898?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80',
      ],
      amenityNames: [
        'High-Speed WiFi',
        'Fully Equipped Gym',
        '24/7 Manned Security',
        'Full Backup Generator',
        'Borehole Water Backup',
        'High-Speed Elevators',
        'Modern Fitted Kitchen',
        'Smart TV & Soundbar',
        'Fully Furnished & Styled',
        'Keyless Digital Smart Lock',
      ],
    },
    {
      title: 'Luxury 3-Bedroom Penthouse with Panoramic City Views',
      slug: 'luxury-3-bedroom-penthouse-kileleshwa',
      description: 'A grand top-floor 3-bedroom residence offering sweeping vistas of the Nairobi skyline. Features vaulted high ceilings, wrap-around entertainment terrace, premium imported Italian fittings, and an en-suite staff quarter (DSQ). Ideal for visiting diplomatic delegations and high-ticket family vacation rentals.',
      propertyType: 'Penthouse',
      bedrooms: 3,
      bathrooms: 3.5,
      sizeSqft: 2250,
      furnishing: 'Furnished',
      county: 'Nairobi',
      town: 'Nairobi',
      neighbourhood: 'Kileleshwa',
      address: 'Oloitokitok Road, Kileleshwa',
      price: 23500000,
      currency: 'KES',
      isAirbnbReady: true,
      isFeatured: true,
      status: 'AVAILABLE',
      estNightlyRate: 16000,
      estMonthlyIncome: 290000,
      estAnnualIncome: 3480000,
      estOccupancyRate: 65,
      estRoiPercentage: 14.8,
      serviceCharge: 18000,
      managementFee: 15,
      investmentNotes: 'High-ticket corporate stay asset. Commands premium pricing during international conferences and summit seasons.',
      featuredImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80',
      ],
      amenityNames: [
        'High-Speed WiFi',
        'Rooftop Heated Pool',
        'Fully Equipped Gym',
        '24/7 Manned Security',
        'Full Backup Generator',
        'Borehole Water Backup',
        'CCTV Surveillance',
        'High-Speed Elevators',
        'Dedicated Covered Parking',
        'Scenic Balcony',
        'Modern Fitted Kitchen',
        'Smart TV & Soundbar',
        'Fully Furnished & Styled',
        'Resident Rooftop Lounge',
      ],
    },
    {
      title: 'Coastal 2-Bedroom Holiday Villa with Private Plunge Pool',
      slug: 'coastal-2-bedroom-holiday-villa-diani',
      description: 'Immerse yourself in tropical coastal luxury with this Swahili-contemporary styled 2-bedroom private villa located just 400 metres from the renowned powder-white shores of Diani Beach. Includes private swimming pool, lush landscaped garden, outdoor coral-stone shower, and dedicated chef quarter.\n\nStrong year-round international tourist appeal and diaspora holidaymaker booking demand.',
      propertyType: 'Villa',
      bedrooms: 2,
      bathrooms: 2,
      sizeSqft: 1600,
      furnishing: 'Furnished',
      county: 'Kwale',
      town: 'Diani Beach',
      neighbourhood: 'Diani',
      address: 'Diani Beach Road, South Coast',
      price: 16800000,
      currency: 'KES',
      isAirbnbReady: true,
      isFeatured: true,
      status: 'AVAILABLE',
      estNightlyRate: 15000,
      estMonthlyIncome: 240000,
      estAnnualIncome: 2880000,
      estOccupancyRate: 64,
      estRoiPercentage: 17.1,
      serviceCharge: 12000,
      managementFee: 20,
      investmentNotes: 'Exemplary holiday home investment. Peak season rates (Dec-Jan, Jul-Aug) routinely achieve KES 25,000 - 35,000 per night.',
      featuredImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
      ],
      amenityNames: [
        'High-Speed WiFi',
        'Rooftop Heated Pool',
        '24/7 Manned Security',
        'Full Backup Generator',
        'Borehole Water Backup',
        'Dedicated Covered Parking',
        'Scenic Balcony',
        'Modern Fitted Kitchen',
        'Smart TV & Soundbar',
        'Fully Furnished & Styled',
        'Keyless Digital Smart Lock',
      ],
    },
    {
      title: 'High-Yield 1-Bedroom Apartment near Two Rivers Mall',
      slug: 'high-yield-1-bedroom-apartment-ruaka',
      description: 'Capitalize on Ruaka’s booming rental market driven by the diplomatic corridor of Gigiri and the Two Rivers commercial ecosystem. Excellent rental yield, strong capital appreciation trajectory, and solid tenant retention.',
      propertyType: 'Apartment',
      bedrooms: 1,
      bathrooms: 1,
      sizeSqft: 550,
      furnishing: 'Semi-Furnished',
      county: 'Kiambu',
      town: 'Ruaka',
      neighbourhood: 'Ruaka',
      address: 'Limuru Road, Ruaka',
      price: 4800000,
      currency: 'KES',
      isAirbnbReady: true,
      isFeatured: false,
      status: 'AVAILABLE',
      estNightlyRate: 3200,
      estMonthlyIncome: 58000,
      estAnnualIncome: 696000,
      estOccupancyRate: 68,
      estRoiPercentage: 14.5,
      serviceCharge: 4000,
      managementFee: 15,
      investmentNotes: 'Affordable entry into Nairobi’s peripheral growth corridor with steady monthly cash flows.',
      featuredImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502005229762-ee1afd30f898?auto=format&fit=crop&w=1200&q=80',
      ],
      amenityNames: [
        'High-Speed WiFi',
        'Fully Equipped Gym',
        '24/7 Manned Security',
        'Full Backup Generator',
        'Borehole Water Backup',
        'High-Speed Elevators',
        'Dedicated Covered Parking',
        'Scenic Balcony',
        'Modern Fitted Kitchen',
      ],
    },
    {
      title: 'Contemporary 2-Bedroom Urban Apartment in Lavington',
      slug: 'contemporary-2-bedroom-urban-apartment-lavington',
      description: 'Located in the serene green suburbs of Lavington. Generous open-plan living room with expansive floor-to-ceiling sliding glass doors leading onto a green garden balcony. Close to international schools and elite retail centres.',
      propertyType: 'Apartment',
      bedrooms: 2,
      bathrooms: 2,
      sizeSqft: 1250,
      furnishing: 'Furnished',
      county: 'Nairobi',
      town: 'Nairobi',
      neighbourhood: 'Lavington',
      address: 'James Gichuru Road, Lavington',
      price: 14800000,
      currency: 'KES',
      isAirbnbReady: true,
      isFeatured: false,
      status: 'AVAILABLE',
      estNightlyRate: 9500,
      estMonthlyIncome: 185000,
      estAnnualIncome: 2220000,
      estOccupancyRate: 70,
      estRoiPercentage: 15.0,
      serviceCharge: 9500,
      managementFee: 15,
      investmentNotes: 'Lavington attracts long-term corporate expats and affluent family travelers desiring tranquility and top-tier security.',
      featuredImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80',
      ],
      amenityNames: [
        'High-Speed WiFi',
        'Rooftop Heated Pool',
        'Fully Equipped Gym',
        '24/7 Manned Security',
        'Full Backup Generator',
        'Borehole Water Backup',
        'High-Speed Elevators',
        'Dedicated Covered Parking',
        'Scenic Balcony',
        'Modern Fitted Kitchen',
        'Smart TV & Soundbar',
        'Fully Furnished & Styled',
      ],
    },
    {
      title: 'Prime 1-Bedroom Investment Apartment in Westlands',
      slug: 'prime-1-bedroom-investment-apartment-westlands',
      description: 'Centrally situated within 3 minutes of Sarit Centre and Westgate Mall. High demand from visiting NGO consultants, tech hub workers, and weekend staycationers. Fully sold out off-plan in phase 1, now available as immediate rental asset.',
      propertyType: 'Apartment',
      bedrooms: 1,
      bathrooms: 1,
      sizeSqft: 600,
      furnishing: 'Furnished',
      county: 'Nairobi',
      town: 'Nairobi',
      neighbourhood: 'Westlands',
      address: 'Muthithi Road, Westlands',
      price: 7900000,
      currency: 'KES',
      isAirbnbReady: true,
      isFeatured: false,
      status: 'SOLD', // Demo of a sold property to test status filter
      estNightlyRate: 5500,
      estMonthlyIncome: 110000,
      estAnnualIncome: 1320000,
      estOccupancyRate: 74,
      estRoiPercentage: 16.7,
      serviceCharge: 7000,
      managementFee: 15,
      investmentNotes: 'Sold listing demonstration. Verified historical gross rental yield of 16.7%.',
      featuredImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      ],
      amenityNames: [
        'High-Speed WiFi',
        'Fully Equipped Gym',
        '24/7 Manned Security',
        'Full Backup Generator',
        'High-Speed Elevators',
        'Dedicated Covered Parking',
      ],
    },
  ];

  for (const p of propertiesData) {
    const { images, amenityNames, ...propFields } = p;
    
    // Dynamic Takeover Calculations for Airbnb marketplace
    const assetVal = propFields.assetValue || Math.round(propFields.price * 0.75);
    const depositVal = propFields.landlordDeposit || Math.round((propFields.estMonthlyIncome || 70000) * 0.35);
    const rentVal = propFields.monthlyRent || depositVal;
    const goodwillVal = propFields.goodwill || 0;
    const inventoryJson = JSON.stringify([
      "Bed & High-Density Orthopedic Mattress",
      "Living Room Sofa & Accent Coffee Table",
      "55-inch 4K Smart TV & Audio System",
      "Double-Door Refrigerator & Microwave Oven",
      "Complete Kitchen Cookware, Crockery & Cutlery Set",
      "Custom Blackout Curtains & Window Sheers",
      "Bespoke Dining Table & Chairs",
      "Ambient Lighting & Boho Wall Décor Art",
      "High-Speed WiFi Router & Backup UPS",
      "Digital Keyless Smart Deadbolt Lock",
      "2 Sets of Hotel-Grade Egyptian Cotton Bed Linens",
      "Iron, Ironing Board & Turnover Cleaning Kit"
    ]);
    const opsStr = "Turnkey Airbnb setup, operating procedures (SOPs), automated guest messaging templates, verified professional cleaning contacts, linen supply vendor.";
    const notIncStr = "Underlying freehold/leasehold building real estate ownership, landlord building fixtures, seller personal belongings, Airbnb platform account (unless explicitly agreed and permitted by platform policies).";
    const leaseTermsStr = "The unit is occupied under a rental/tenancy arrangement. The buyer may continue with the tenancy subject to the landlord's approval and the applicable tenancy agreement.";

    const dataToSave = {
      ...propFields,
      assetValue: assetVal,
      landlordDeposit: depositVal,
      goodwill: goodwillVal,
      monthlyRent: rentVal,
      inventoryList: inventoryJson,
      operationalAssets: opsStr,
      notIncluded: notIncStr,
      leaseTerms: leaseTermsStr,
    };

    // Upsert property
    const existing = await prisma.property.findUnique({ where: { slug: propFields.slug } });
    let createdProp;
    if (existing) {
      createdProp = await prisma.property.update({
        where: { slug: propFields.slug },
        data: dataToSave,
      });
      console.log(`Property updated: ${createdProp.title}`);
    } else {
      createdProp = await prisma.property.create({
        data: dataToSave,
      });

      // Add Images
      for (let i = 0; i < images.length; i++) {
        await prisma.propertyImage.create({
          data: {
            propertyId: createdProp.id,
            imageUrl: images[i],
            isPrimary: i === 0,
            displayOrder: i,
            caption: `${createdProp.title} - View ${i + 1}`,
          },
        });
      }

      // Add Amenities
      for (const aName of amenityNames) {
        const aId = amenityMap[aName];
        if (aId) {
          await prisma.propertyAmenity.create({
            data: {
              propertyId: createdProp.id,
              amenityId: aId,
            },
          });
        }
      }
      console.log(`Property created: ${createdProp.title}`);
    }
  }

  // 6. Seed Demo Enquiries and Viewing Requests
  const demoProp = await prisma.property.findFirst({ where: { isAirbnbReady: true } });
  if (demoProp) {
    await prisma.enquiry.deleteMany({});
    await prisma.viewingRequest.deleteMany({});
    await prisma.savedListing.deleteMany({});

    // Create a saved listing for verifiedBuyer
    await prisma.savedListing.create({
      data: {
        userId: verifiedBuyer.id,
        propertyId: demoProp.id,
      },
    });

    await prisma.enquiry.create({
      data: {
        userId: verifiedBuyer.id,
        propertyId: demoProp.id,
        fullName: verifiedBuyer.name,
        phone: verifiedBuyer.phone || '+254 722 000 111',
        email: verifiedBuyer.email,
        preferredContact: 'WHATSAPP',
        investmentPurpose: 'AIRBNB',
        budget: 'KES 5M - 8M',
        preferredViewingDate: '2026-09-22',
        message: 'Hello Rentals Kenya, I am interested in this 1 Bedroom Airbnb setup in Kilimani. I would like more information about the items included and the lease takeover process.',
        status: 'NEW',
        internalNotes: 'Initial enquiry from registered buyer. Follow up on Monday regarding inventory checklist and landlord lease transfer terms.',
      },
    });

    await prisma.enquiry.create({
      data: {
        userId: verifiedBuyer.id,
        propertyId: demoProp.id,
        fullName: verifiedBuyer.name,
        phone: verifiedBuyer.phone || '+254 722 000 111',
        email: verifiedBuyer.email,
        preferredContact: 'EMAIL',
        investmentPurpose: 'AIRBNB',
        budget: 'KES 10M - 15M',
        preferredViewingDate: '2026-09-25',
        message: 'Requesting financial breakdown of the operational costs and tenancy renewal dates for this unit.',
        status: 'CONTACTED',
        internalNotes: 'Sent prospectus. Buyer reviewed P&L sheet and requested viewing.',
      },
    });

    await prisma.viewingRequest.create({
      data: {
        userId: verifiedBuyer.id,
        propertyId: demoProp.id,
        fullName: verifiedBuyer.name,
        phone: verifiedBuyer.phone || '+254 722 000 111',
        email: verifiedBuyer.email,
        preferredDate: '2026-09-24',
        preferredTime: 'Morning (10:00 AM)',
        message: 'Interested in touring the rooftop pool and checking the inventory condition in person.',
        status: 'CONFIRMED',
        internalNotes: 'Viewing confirmed with building caretaker. Buyer will visit at 10:00 AM.',
      },
    });
  }

  console.log('Database seeding complete successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
