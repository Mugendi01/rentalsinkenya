import { z } from 'zod';

const phoneRegex = /^(\+?[1-9]\d{1,14}|07\d{8}|01\d{8})$/;

export const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Please enter your full name').max(100),
    email: z.string().email('Please enter a valid email address').toLowerCase(),
    phone: z
      .string()
      .min(9, 'Please enter a valid phone number (e.g. +254 100 382 352 or 0100382352)')
      .refine(
        (val) => {
          const cleaned = val.replace(/[\s\-\(\)]/g, '');
          return phoneRegex.test(cleaned);
        },
        { message: 'Please enter a valid Kenyan (+254 / 07XX / 01XX) or international phone number' }
      ),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character (!@#$%^&*)'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
    country: z.string().max(80).optional().nullable(),
    preferredContact: z.enum(['WHATSAPP', 'PHONE', 'EMAIL']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const verifyEmailSchema = z.object({
  email: z.string().email('Valid email is required').toLowerCase(),
  code: z.string().length(6, 'Verification code must be exactly 6 digits').regex(/^\d{6}$/, 'Code must contain only digits'),
});

export const resendCodeSchema = z.object({
  email: z.string().email('Valid email is required').toLowerCase(),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required').max(128),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(10, 'Invalid or expired reset token').max(200),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const userProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().min(9, 'Valid phone number is required').max(30),
  country: z.string().max(80).optional().nullable(),
  preferredContact: z.enum(['WHATSAPP', 'PHONE', 'EMAIL']),
  email: z.string().email('Valid email address is required').toLowerCase(),
});

export const enquirySchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name').max(100),
  phone: z.string().min(9, 'Please enter a valid phone number (e.g. +254 100 382 352 or +254100382352)').max(30),
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  propertyId: z.string().optional().nullable(),
  preferredContact: z.enum(['WHATSAPP', 'PHONE', 'EMAIL']),
  investmentPurpose: z.enum(['AIRBNB', 'LONG_TERM_RENTAL', 'PERSONAL_USE', 'OTHER']),
  budget: z.string().max(100).optional().nullable(),
  preferredViewingDate: z.string().max(50).optional().nullable(),
  additionalQuestions: z.string().max(2000).optional().nullable(),
  message: z.string().min(5, 'Please provide a short message or question').max(5000),
});

export const viewingRequestSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  fullName: z.string().min(2, 'Please enter your full name').max(100),
  phone: z.string().min(9, 'Please enter a valid phone number').max(30),
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  preferredDate: z.string().min(8, 'Please select your preferred viewing date').max(50),
  preferredTime: z.string().min(2, 'Please select a preferred time slot').max(50),
  message: z.string().max(5000).optional().nullable(),
});

export const propertyFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  slug: z.string().min(3, 'Slug is required').max(200),
  description: z.string().min(20, 'Detailed description is required').max(20000),
  propertyType: z.string().min(2, 'Property type is required').max(100),
  bedrooms: z.coerce.number().finite().min(0),
  bathrooms: z.coerce.number().finite().min(0.5),
  sizeSqft: z.coerce.number().finite().optional().nullable(),
  furnishing: z.string().max(100).default('Furnished'),
  county: z.string().min(2).max(100),
  town: z.string().min(2).max(100),
  neighbourhood: z.string().min(2).max(100),
  address: z.string().max(300).optional().nullable(),
  price: z.coerce.number().finite().positive('Price must be greater than 0'),
  currency: z.string().max(10).default('KES'),
  
  // Ready-to-Run Airbnb Takeover Attributes
  assetValue: z.coerce.number().finite().optional().nullable(),
  landlordDeposit: z.coerce.number().finite().optional().nullable(),
  goodwill: z.coerce.number().finite().default(0),
  monthlyRent: z.coerce.number().finite().optional().nullable(),
  leaseTerms: z.string().max(5000).optional().nullable(),
  inventoryList: z.string().max(10000).optional().nullable(),
  operationalAssets: z.string().max(5000).optional().nullable(),
  notIncluded: z.string().max(5000).optional().nullable(),

  isAirbnbReady: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  status: z.enum(['AVAILABLE', 'SOLD', 'RESERVED', 'COMING_SOON', 'HIDDEN']).default('AVAILABLE'),
  
  estNightlyRate: z.coerce.number().finite().optional().nullable(),
  estMonthlyIncome: z.coerce.number().finite().optional().nullable(),
  estAnnualIncome: z.coerce.number().finite().optional().nullable(),
  estOccupancyRate: z.coerce.number().finite().optional().nullable(),
  estRoiPercentage: z.coerce.number().finite().optional().nullable(),
  serviceCharge: z.coerce.number().finite().optional().nullable(),
  managementFee: z.coerce.number().finite().optional().nullable(),
  investmentNotes: z.string().max(10000).optional().nullable(),
  
  featuredImage: z.string().max(2048).optional().nullable(),
  seoTitle: z.string().max(200).optional().nullable(),
  seoDescription: z.string().max(500).optional().nullable(),
  amenities: z.array(z.string().max(100)).max(100).default([]),
  images: z.array(z.string().max(2048).refine((u) => u.startsWith('/') || u.startsWith('https://'), 'Image URLs must be https or site-relative')).max(50).default([]),
});

export const rentalFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  slug: z.string().min(3, 'Slug is required').max(200),
  description: z.string().min(15, 'Detailed description is required').max(20000),
  propertyType: z.string().min(2, 'Property type is required').max(100),
  bedrooms: z.coerce.number().finite().min(0),
  bathrooms: z.coerce.number().finite().min(0.5),
  sizeSqft: z.coerce.number().finite().optional().nullable(),
  furnishing: z.string().max(100).default('Furnished'),
  county: z.string().min(2, 'County is required').max(100),
  town: z.string().min(2, 'Town is required').max(100),
  neighbourhood: z.string().min(2, 'Neighbourhood/suburb is required').max(100),
  address: z.string().max(300).optional().nullable(),
  monthlyRent: z.coerce.number().finite().positive('Monthly rent must be greater than 0'),
  landlordDeposit: z.coerce.number().finite().optional().nullable(),
  serviceCharge: z.coerce.number().finite().optional().nullable(),
  leaseTerms: z.string().max(5000).optional().nullable(),
  contactName: z.string().max(100).optional().nullable(),
  contactPhone: z.string().max(30).optional().nullable(),
  contactEmail: z.string().max(254).optional().nullable(),
  viewingInstructions: z.string().max(2000).optional().nullable(),
  isFeatured: z.boolean().default(false),
  status: z.enum(['AVAILABLE', 'HIDDEN', 'RESERVED', 'SOLD']).default('AVAILABLE'),
  featuredImage: z.string().max(2048).optional().nullable(),
  amenities: z.array(z.string().max(100)).max(100).default([]),
  images: z.array(z.string().max(2048).refine((u) => u.startsWith('/') || u.startsWith('https://'), 'Image URLs must be https or site-relative')).max(50).default([]),
});
