-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT,
    "preferredContact" TEXT NOT NULL DEFAULT 'WHATSAPP',
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'UNVERIFIED',
    "verificationCodeHash" TEXT,
    "verificationCodeExpires" TIMESTAMP(3),
    "verificationAttempts" INTEGER NOT NULL DEFAULT 0,
    "resetTokenHash" TEXT,
    "resetTokenExpires" TIMESTAMP(3),
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockUntil" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL DEFAULT 1,
    "bathrooms" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "sizeSqft" INTEGER,
    "furnishing" TEXT NOT NULL DEFAULT 'Furnished',
    "county" TEXT NOT NULL DEFAULT 'Nairobi',
    "town" TEXT NOT NULL DEFAULT 'Nairobi',
    "neighbourhood" TEXT NOT NULL,
    "address" TEXT,
    "mapCoordinates" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "assetValue" DOUBLE PRECISION,
    "landlordDeposit" DOUBLE PRECISION,
    "goodwill" DOUBLE PRECISION DEFAULT 0,
    "monthlyRent" DOUBLE PRECISION,
    "leaseTerms" TEXT,
    "inventoryList" TEXT,
    "operationalAssets" TEXT,
    "notIncluded" TEXT,
    "isAirbnbReady" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "estNightlyRate" DOUBLE PRECISION,
    "estMonthlyIncome" DOUBLE PRECISION,
    "estAnnualIncome" DOUBLE PRECISION,
    "estOccupancyRate" DOUBLE PRECISION,
    "estRoiPercentage" DOUBLE PRECISION,
    "serviceCharge" DOUBLE PRECISION,
    "managementFee" DOUBLE PRECISION,
    "investmentNotes" TEXT,
    "featuredImage" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyImage" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Amenity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'General',

    CONSTRAINT "Amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyAmenity" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,

    CONSTRAINT "PropertyAmenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedListing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "propertyId" TEXT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "preferredContact" TEXT NOT NULL DEFAULT 'WHATSAPP',
    "investmentPurpose" TEXT NOT NULL DEFAULT 'AIRBNB',
    "budget" TEXT,
    "preferredViewingDate" TEXT,
    "message" TEXT NOT NULL,
    "additionalQuestions" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ViewingRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "propertyId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "preferredDate" TEXT NOT NULL,
    "preferredTime" TEXT NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "internalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ViewingRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "details" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Property_slug_key" ON "Property"("slug");

-- CreateIndex
CREATE INDEX "Property_status_idx" ON "Property"("status");

-- CreateIndex
CREATE INDEX "Property_neighbourhood_idx" ON "Property"("neighbourhood");

-- CreateIndex
CREATE INDEX "Property_propertyType_idx" ON "Property"("propertyType");

-- CreateIndex
CREATE INDEX "Property_isAirbnbReady_idx" ON "Property"("isAirbnbReady");

-- CreateIndex
CREATE INDEX "Property_isFeatured_idx" ON "Property"("isFeatured");

-- CreateIndex
CREATE INDEX "PropertyImage_propertyId_idx" ON "PropertyImage"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Amenity_name_key" ON "Amenity"("name");

-- CreateIndex
CREATE INDEX "PropertyAmenity_propertyId_idx" ON "PropertyAmenity"("propertyId");

-- CreateIndex
CREATE INDEX "PropertyAmenity_amenityId_idx" ON "PropertyAmenity"("amenityId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyAmenity_propertyId_amenityId_key" ON "PropertyAmenity"("propertyId", "amenityId");

-- CreateIndex
CREATE UNIQUE INDEX "Location_name_key" ON "Location"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Location_slug_key" ON "Location"("slug");

-- CreateIndex
CREATE INDEX "Location_slug_idx" ON "Location"("slug");

-- CreateIndex
CREATE INDEX "SavedListing_userId_idx" ON "SavedListing"("userId");

-- CreateIndex
CREATE INDEX "SavedListing_propertyId_idx" ON "SavedListing"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedListing_userId_propertyId_key" ON "SavedListing"("userId", "propertyId");

-- CreateIndex
CREATE INDEX "Enquiry_status_idx" ON "Enquiry"("status");

-- CreateIndex
CREATE INDEX "Enquiry_propertyId_idx" ON "Enquiry"("propertyId");

-- CreateIndex
CREATE INDEX "Enquiry_userId_idx" ON "Enquiry"("userId");

-- CreateIndex
CREATE INDEX "ViewingRequest_status_idx" ON "ViewingRequest"("status");

-- CreateIndex
CREATE INDEX "ViewingRequest_propertyId_idx" ON "ViewingRequest"("propertyId");

-- CreateIndex
CREATE INDEX "ViewingRequest_userId_idx" ON "ViewingRequest"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "PropertyImage" ADD CONSTRAINT "PropertyImage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAmenity" ADD CONSTRAINT "PropertyAmenity_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAmenity" ADD CONSTRAINT "PropertyAmenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedListing" ADD CONSTRAINT "SavedListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedListing" ADD CONSTRAINT "SavedListing_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewingRequest" ADD CONSTRAINT "ViewingRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ViewingRequest" ADD CONSTRAINT "ViewingRequest_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;



-- ==========================================================
-- SEED INITIAL DATA (Settings, Locations, Amenities, Admin)
-- ==========================================================

-- 1. Create Default Admin User. This hash is for a publicly known default password:
--    change the admin password immediately after running this script.
INSERT INTO "User" ("id", "name", "email", "phone", "country", "preferredContact", "passwordHash", "role", "isEmailVerified", "status", "updatedAt")
VALUES 
  ('admin_rentals_ke', 'Rentals Kenya Admin', 'admin@rentals.ke', '+254100382352', 'Kenya', 'WHATSAPP', '$2a$10$4lYr5.i6Ahxe5L0MfGB.Nef3frvHU9UKxe5169KNGRQdmhZRMP9tm', 'ADMIN', true, 'VERIFIED', NOW()),
  ('admin_rentalsinkenya_co_ke', 'Rentals Kenya Admin', 'admin@rentalsinkenya.co.ke', '+254100382352', 'Kenya', 'WHATSAPP', '$2a$10$4lYr5.i6Ahxe5L0MfGB.Nef3frvHU9UKxe5169KNGRQdmhZRMP9tm', 'ADMIN', true, 'VERIFIED', NOW())
ON CONFLICT ("email") DO UPDATE SET "role" = 'ADMIN', "status" = 'VERIFIED';

-- 2. Seed Official Site Settings
INSERT INTO "SiteSetting" ("id", "key", "value", "description", "updatedAt") VALUES
('setting_1', 'company_name', 'Rentals Kenya', 'Official company name', NOW()),
('setting_2', 'brand_name', 'Rentals.ke', 'Platform brand domain', NOW()),
('setting_3', 'whatsapp_number', '254100382352', 'Primary WhatsApp number (digits only with country code)', NOW()),
('setting_4', 'phone_number', '+254100382352', 'Support phone number', NOW()),
('setting_5', 'email', 'invest@rentals.ke', 'Primary investor inquiries email', NOW()),
('setting_6', 'office_address', 'The Oval, 4th Floor, Ring Road Parklands, Westlands, Nairobi, Kenya', 'Physical office address', NOW()),
('setting_7', 'business_hours', 'Mon - Sat: 8:00 AM - 6:00 PM EAT', 'Office operating hours', NOW()),
('setting_8', 'instagram_handle', 'rentals.kenya', 'Instagram handle', NOW()),
('setting_9', 'instagram_url', 'https://instagram.com/rentals.kenya', 'Instagram URL', NOW()),
('setting_10', 'default_currency', 'KES', 'Standard currency display', NOW()),
('setting_11', 'meta_title', 'Rentals Kenya | Houses & Apartments for Rent in Kenya | Turnkey Airbnb Setups', 'SEO title', NOW()),
('setting_12', 'meta_description', 'Discover verified rental houses and apartments across Nairobi and Kenya, along with turnkey Airbnb business takeovers and furnished setups for sale.', 'SEO meta description', NOW())
ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updatedAt" = NOW();

-- 3. Seed Strategic Locations
INSERT INTO "Location" ("id", "name", "slug", "county", "description", "imageUrl", "isFeatured", "displayOrder", "createdAt") VALUES
('loc_1', 'Kilimani', 'kilimani', 'Nairobi', 'Nairobi’s premier rental and short-term corridor, renowned for high demand, proximity to Yaya Centre, fine dining, and diplomatic hubs.', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80', true, 1, NOW()),
('loc_2', 'Westlands', 'westlands', 'Nairobi', 'The undisputed commercial and residential epicentre of East Africa. High demand from expatriates, multinational business travellers, and corporate executives.', 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80', true, 2, NOW()),
('loc_3', 'Kileleshwa', 'kileleshwa', 'Nairobi', 'Serene upscale residential enclave offering modern multi-bedroom apartments favored by families, executives, and long-term expatriates.', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80', true, 3, NOW()),
('loc_4', 'Diani Beach', 'diani', 'Kwale', 'Award-winning white sand beach destination. Premium holiday rental villas and serviced residences commanding high demand and international tourist traffic.', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80', true, 4, NOW()),
('loc_5', 'Ruaka', 'ruaka', 'Kiambu', 'Fast-growing high-yield suburban corridor bordering the UN complex in Gigiri and Two Rivers Mall. Convenient, modern residences at attractive rental rates.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80', true, 5, NOW()),
('loc_6', 'Naivasha', 'naivasha', 'Nakuru', 'Kenya’s leading weekend getaway and conferencing haven around Lake Naivasha, boasting consistent holiday bookings and serene executive retreats.', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1000&q=80', false, 6, NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name";

-- 4. Seed Amenities
INSERT INTO "Amenity" ("id", "name", "icon", "category") VALUES
('am_1', 'High-Speed WiFi', 'Wifi', 'Connectivity'),
('am_2', 'Rooftop Heated Pool', 'Waves', 'Wellness'),
('am_3', 'Fully Equipped Gym', 'Dumbbell', 'Wellness'),
('am_4', '24/7 Manned Security', 'ShieldCheck', 'Security'),
('am_5', 'Full Backup Generator', 'Zap', 'Utilities'),
('am_6', 'Borehole Water Backup', 'Droplets', 'Utilities'),
('am_7', 'CCTV Surveillance', 'Video', 'Security'),
('am_8', 'High-Speed Elevators', 'ArrowUpDown', 'Building'),
('am_9', 'Dedicated Covered Parking', 'Car', 'Building'),
('am_10', 'Scenic Balcony', 'Maximize2', 'Apartment'),
('am_11', 'Modern Fitted Kitchen', 'Utensils', 'Apartment'),
('am_12', 'Smart TV & Soundbar', 'Tv', 'Entertainment'),
('am_13', 'Fully Furnished & Styled', 'Sparkles', 'Furnishing'),
('am_14', 'Keyless Digital Smart Lock', 'Key', 'Access')
ON CONFLICT ("name") DO NOTHING;

-- 5. Seed Initial Properties (Rental Apartments + Turnkey Airbnb Takeovers)
INSERT INTO "Property" (
  "id", "title", "slug", "description", "propertyType", "bedrooms", "bathrooms", "sizeSqft",
  "furnishing", "county", "town", "neighbourhood", "address", "price", "currency",
  "monthlyRent", "landlordDeposit", "isAirbnbReady", "isFeatured", "status",
  "estNightlyRate", "estMonthlyIncome", "estAnnualIncome", "estOccupancyRate", "estRoiPercentage",
  "featuredImage", "createdAt", "updatedAt"
) VALUES
(
  'prop_rental_1',
  'Spacious 2-Bedroom Apartment in Kilimani',
  'spacious-2-bedroom-apartment-kilimani',
  'A modern and spacious 2-bedroom rental apartment in Kilimani along Argwings Kodhek Road. Features a large balcony, fitted kitchen, master en-suite, borehole water, full backup generator, 24/7 manned security, and covered parking. Move-in ready with flexible 1-year renewable tenancy lease.',
  'Apartment', 2, 2, 1100, 'Furnished', 'Nairobi', 'Nairobi', 'Kilimani', 'Argwings Kodhek Rd, Kilimani',
  65000, 'KES', 65000, 65000, false, true, 'AVAILABLE',
  NULL, NULL, NULL, NULL, NULL,
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', NOW(), NOW()
),
(
  'prop_rental_2',
  'Modern 2-Bedroom Executive Residence in Westlands',
  'modern-2-bedroom-executive-residence-westlands',
  'Exceptional 2-bedroom executive rental residence in Westlands, minutes from Sarit Centre and Westgate. Enjoy panoramic city views, high-speed elevators, resident gym, heated rooftop swimming pool, and round-the-clock concierge services.',
  'Apartment', 2, 2, 1250, 'Furnished', 'Nairobi', 'Nairobi', 'Westlands', 'Rhapta Road, Westlands',
  85000, 'KES', 85000, 85000, false, true, 'AVAILABLE',
  NULL, NULL, NULL, NULL, NULL,
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', NOW(), NOW()
),
(
  'prop_takeover_1',
  'Turnkey 1-Bedroom Airbnb Business Haven with Rooftop Heated Pool',
  'turnkey-1-bedroom-airbnb-haven-kilimani',
  'Complete Airbnb business takeover in Kilimani. Fully furnished and styled unit with confirmed landlord lease transfer, all appliances, linens, smart lock, and active booking history. Building amenities include a rooftop heated swimming pool, fitness gym, backup generator, and CCTV.',
  'Apartment', 1, 1, 620, 'Furnished', 'Nairobi', 'Nairobi', 'Kilimani', 'Argwings Kodhek Road, Kilimani',
  6800000, 'KES', 35000, 70000, true, true, 'AVAILABLE',
  4500, 88000, 1056000, 72, 15.5,
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', NOW(), NOW()
)
ON CONFLICT ("slug") DO NOTHING;
