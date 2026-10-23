import { z } from 'zod';

const phoneRegex = /^(\+?[1-9]\d{1,14}|07\d{8}|01\d{8})$/;

export const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Please enter your full name'),
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
    country: z.string().optional().nullable(),
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
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(10, 'Invalid or expired reset token'),
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
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(9, 'Valid phone number is required'),
  country: z.string().optional().nullable(),
  preferredContact: z.enum(['WHATSAPP', 'PHONE', 'EMAIL']),
  email: z.string().email('Valid email address is required').toLowerCase(),
});

export const enquirySchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  phone: z.string().min(9, 'Please enter a valid phone number (e.g. +254 100 382 352 or +254100382352)'),
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  propertyId: z.string().optional().nullable(),
  preferredContact: z.enum(['WHATSAPP', 'PHONE', 'EMAIL']),
  investmentPurpose: z.enum(['AIRBNB', 'LONG_TERM_RENTAL', 'PERSONAL_USE', 'OTHER']),
  budget: z.string().optional().nullable(),
  preferredViewingDate: z.string().optional().nullable(),
  additionalQuestions: z.string().optional().nullable(),
  message: z.string().min(5, 'Please provide a short message or question'),
});

export const viewingRequestSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  fullName: z.string().min(2, 'Please enter your full name'),
  phone: z.string().min(9, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  preferredDate: z.string().min(8, 'Please select your preferred viewing date'),
  preferredTime: z.string().min(2, 'Please select a preferred time slot'),
  message: z.string().optional().nullable(),
});

export const propertyFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(3, 'Slug is required'),
  description: z.string().min(20, 'Detailed description is required'),
  propertyType: z.string().min(2, 'Property type is required'),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0.5),
  sizeSqft: z.coerce.number().optional().nullable(),
  furnishing: z.string().default('Furnished'),
  county: z.string().min(2),
  town: z.string().min(2),
  neighbourhood: z.string().min(2),
  address: z.string().optional().nullable(),
  price: z.coerce.number().positive('Price must be greater than 0'),
  currency: z.string().default('KES'),
  
  // Ready-to-Run Airbnb Takeover Attributes
  assetValue: z.coerce.number().optional().nullable(),
  landlordDeposit: z.coerce.number().optional().nullable(),
  goodwill: z.coerce.number().default(0),
  monthlyRent: z.coerce.number().optional().nullable(),
  leaseTerms: z.string().optional().nullable(),
  inventoryList: z.string().optional().nullable(),
  operationalAssets: z.string().optional().nullable(),
  notIncluded: z.string().optional().nullable(),

  isAirbnbReady: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  status: z.enum(['AVAILABLE', 'SOLD', 'RESERVED', 'COMING_SOON', 'HIDDEN']).default('AVAILABLE'),
  
  estNightlyRate: z.coerce.number().optional().nullable(),
  estMonthlyIncome: z.coerce.number().optional().nullable(),
  estAnnualIncome: z.coerce.number().optional().nullable(),
  estOccupancyRate: z.coerce.number().optional().nullable(),
  estRoiPercentage: z.coerce.number().optional().nullable(),
  serviceCharge: z.coerce.number().optional().nullable(),
  managementFee: z.coerce.number().optional().nullable(),
  investmentNotes: z.string().optional().nullable(),
  
  featuredImage: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
});

export const rentalFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(3, 'Slug is required'),
  description: z.string().min(15, 'Detailed description is required'),
  propertyType: z.string().min(2, 'Property type is required'),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0.5),
  sizeSqft: z.coerce.number().optional().nullable(),
  furnishing: z.string().default('Furnished'),
  county: z.string().min(2, 'County is required'),
  town: z.string().min(2, 'Town is required'),
  neighbourhood: z.string().min(2, 'Neighbourhood/suburb is required'),
  address: z.string().optional().nullable(),
  monthlyRent: z.coerce.number().positive('Monthly rent must be greater than 0'),
  landlordDeposit: z.coerce.number().optional().nullable(),
  serviceCharge: z.coerce.number().optional().nullable(),
  leaseTerms: z.string().optional().nullable(),
  contactName: z.string().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  contactEmail: z.string().optional().nullable(),
  viewingInstructions: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  status: z.enum(['AVAILABLE', 'HIDDEN', 'RESERVED', 'SOLD']).default('AVAILABLE'),
  featuredImage: z.string().optional().nullable(),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
});
