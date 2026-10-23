'use client';

import React, { useState, useMemo } from 'react';
import { formatKES, buildWhatsAppUrl } from '@/lib/formatters';
import {
  Calculator,
  TrendingUp,
  AlertCircle,
  MessageCircle,
  HelpCircle,
  DollarSign,
  PackageCheck,
  Building2,
  Receipt,
  ArrowRight,
} from 'lucide-react';

interface InvestmentCalculatorProps {
  initialPrice?: number;
  initialNightlyRate?: number;
  initialOccupancy?: number;
  whatsappNumber?: string;
  isCompact?: boolean;
}

export default function InvestmentCalculator({
  initialPrice = 350000,
  initialNightlyRate = 4500,
  initialOccupancy = 70,
  whatsappNumber = '254100382352',
}: InvestmentCalculatorProps) {
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer');

  // ==========================================
  // 1. BUYER TAKEOVER CALCULATOR (MANUAL INPUTS ONLY, NO SLIDERS)
  // ==========================================
  const [takeoverPrice, setTakeoverPrice] = useState<number>(initialPrice);
  const [monthlyRent, setMonthlyRent] = useState<number>(25000);
  const [serviceCharge, setServiceCharge] = useState<number>(5500);
  const [utilities, setUtilities] = useState<number>(4000); // electricity, water
  const [internet, setInternet] = useState<number>(3500);
  const [cleaning, setCleaning] = useState<number>(4500);
  const [otherExpenses, setOtherExpenses] = useState<number>(2500);
  const [nightlyRate, setNightlyRate] = useState<number>(initialNightlyRate);
  const [occupancyPercent, setOccupancyPercent] = useState<number>(initialOccupancy);

  const buyerStats = useMemo(() => {
    // 30.4 days avg month
    const bookedNightsPerMonth = Math.round((occupancyPercent / 100) * 30.4);
    const estMonthlyRevenue = Math.round(bookedNightsPerMonth * nightlyRate);
    const estAnnualRevenue = estMonthlyRevenue * 12;

    const estMonthlyExpenses =
      monthlyRent + serviceCharge + utilities + internet + cleaning + otherExpenses;
    const estAnnualExpenses = estMonthlyExpenses * 12;

    const estMonthlyProfit = estMonthlyRevenue - estMonthlyExpenses;
    const estAnnualProfit = estMonthlyProfit * 12;

    const paybackPeriodYears =
      estAnnualProfit > 0 && takeoverPrice > 0
        ? (takeoverPrice / estAnnualProfit).toFixed(1)
        : 'N/A';

    const paybackPeriodMonths =
      estMonthlyProfit > 0 && takeoverPrice > 0
        ? (takeoverPrice / estMonthlyProfit).toFixed(1)
        : 'N/A';

    return {
      bookedNightsPerMonth,
      estMonthlyRevenue,
      estMonthlyExpenses,
      estMonthlyProfit,
      estAnnualRevenue,
      estAnnualProfit,
      paybackPeriodYears,
      paybackPeriodMonths,
    };
  }, [
    takeoverPrice,
    monthlyRent,
    serviceCharge,
    utilities,
    internet,
    cleaning,
    otherExpenses,
    nightlyRate,
    occupancyPercent,
  ]);

  // ==========================================
  // 2. SELLER SETUP CALCULATOR (MANUAL INPUTS ONLY, NO SLIDERS)
  // ==========================================
  const [furnitureEquipment, setFurnitureEquipment] = useState<number>(140000);
  const [electronics, setElectronics] = useState<number>(65000);
  const [kitchenEquipment, setKitchenEquipment] = useState<number>(30000);
  const [decor, setDecor] = useState<number>(20000);
  const [otherAssets, setOtherAssets] = useState<number>(15000);
  const [landlordDeposit, setLandlordDeposit] = useState<number>(25000);
  const [goodwill, setGoodwill] = useState<number>(0);

  const sellerStats = useMemo(() => {
    const totalAssetValue =
      furnitureEquipment + electronics + kitchenEquipment + decor + otherAssets;
    const totalAskingPrice = totalAssetValue + landlordDeposit + goodwill;

    return {
      totalAssetValue,
      deposit: landlordDeposit,
      goodwill,
      totalAskingPrice,
    };
  }, [
    furnitureEquipment,
    electronics,
    kitchenEquipment,
    decor,
    otherAssets,
    landlordDeposit,
    goodwill,
  ]);

  const whatsappInquiryText =
    activeTab === 'buyer'
      ? `Hello Rentals Kenya, I ran an Airbnb Takeover calculation with Takeover Price: ${formatKES(takeoverPrice)}, Monthly Rent: ${formatKES(monthlyRent)}, and Nightly Rate: ${formatKES(nightlyRate)}. I would like to review available units matching this profile.`
      : `Hello Rentals Kenya, I calculated an Airbnb Setup Asking Price of ${formatKES(sellerStats.totalAskingPrice)} (Assets: ${formatKES(sellerStats.totalAssetValue)}, Deposit: ${formatKES(sellerStats.deposit)}). I would like to consult on listing my Airbnb setup.`;

  const whatsappUrl = buildWhatsAppUrl(whatsappNumber, whatsappInquiryText);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-navy via-slate-900 to-brand-royal p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center flex-shrink-0">
            <Calculator className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Airbnb Setup & Takeover Calculator
            </h2>
            <p className="text-xs text-sky-200">
              Manual numeric modeling for buyers acquiring setups and sellers pricing setups.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-white/10 p-1 rounded-2xl flex items-center self-start md:self-auto border border-white/15">
          <button
            onClick={() => setActiveTab('buyer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'buyer'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-200 hover:text-white'
            }`}
          >
            Buyer Takeover Calculator
          </button>
          <button
            onClick={() => setActiveTab('seller')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'seller'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-200 hover:text-white'
            }`}
          >
            Seller Setup Calculator
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* TAB 1: BUYER TAKEOVER CALCULATOR */}
        {activeTab === 'buyer' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Inputs (Left 7 Cols) - MANUAL NUMERIC INPUTS ONLY, NO SLIDERS */}
              <div className="lg:col-span-7 space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-sky-600" />
                    <span>Takeover Capital & Operating Variables (KES)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter exact numeric values. No sliders are used for precision modeling.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Takeover Price */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Takeover Price (Setup Asking Price)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">KES</span>
                      <input
                        type="number"
                        value={takeoverPrice || ''}
                        onChange={(e) => setTakeoverPrice(Number(e.target.value) || 0)}
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="350000"
                      />
                    </div>
                  </div>

                  {/* Monthly Rent */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Monthly Rent
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">KES</span>
                      <input
                        type="number"
                        value={monthlyRent || ''}
                        onChange={(e) => setMonthlyRent(Number(e.target.value) || 0)}
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  {/* Service Charge */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Service Charge
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">KES</span>
                      <input
                        type="number"
                        value={serviceCharge || ''}
                        onChange={(e) => setServiceCharge(Number(e.target.value) || 0)}
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  {/* Utilities */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Utilities (Power & Water)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">KES</span>
                      <input
                        type="number"
                        value={utilities || ''}
                        onChange={(e) => setUtilities(Number(e.target.value) || 0)}
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  {/* Internet */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Internet / WiFi
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">KES</span>
                      <input
                        type="number"
                        value={internet || ''}
                        onChange={(e) => setInternet(Number(e.target.value) || 0)}
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  {/* Cleaning */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Cleaning & Supplies
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">KES</span>
                      <input
                        type="number"
                        value={cleaning || ''}
                        onChange={(e) => setCleaning(Number(e.target.value) || 0)}
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  {/* Other Expenses */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Other Operating Expenses
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">KES</span>
                      <input
                        type="number"
                        value={otherExpenses || ''}
                        onChange={(e) => setOtherExpenses(Number(e.target.value) || 0)}
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  {/* Average Nightly Rate */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Average Nightly Rate
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">KES</span>
                      <input
                        type="number"
                        value={nightlyRate || ''}
                        onChange={(e) => setNightlyRate(Number(e.target.value) || 0)}
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  {/* Estimated Occupancy */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Estimated Occupancy (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={occupancyPercent || ''}
                        onChange={(e) => setOccupancyPercent(Number(e.target.value) || 0)}
                        className="w-full pr-8 pl-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Outputs (Right 5 Cols) */}
              <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-7 rounded-3xl space-y-6 shadow-xl border border-slate-800">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400">
                    Projections Output
                  </span>
                  <h4 className="text-xl font-black text-white mt-0.5">Takeover Performance</h4>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-800">
                    <span className="text-slate-400">Estimated Monthly Revenue</span>
                    <span className="text-sm font-black text-white">
                      {formatKES(buyerStats.estMonthlyRevenue)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-800">
                    <span className="text-slate-400">Estimated Monthly Expenses</span>
                    <span className="text-sm font-black text-rose-400">
                      -{formatKES(buyerStats.estMonthlyExpenses)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 bg-slate-800/80 px-3 rounded-xl">
                    <span className="font-bold text-sky-300">Estimated Monthly Profit</span>
                    <span className="text-base font-black text-emerald-400">
                      {formatKES(buyerStats.estMonthlyProfit)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-800">
                    <span className="text-slate-400">Estimated Annual Revenue</span>
                    <span className="text-sm font-black text-white">
                      {formatKES(buyerStats.estAnnualRevenue)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-800">
                    <span className="text-slate-400">Estimated Annual Profit</span>
                    <span className="text-sm font-black text-emerald-400">
                      {formatKES(buyerStats.estAnnualProfit)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 bg-sky-950/60 border border-sky-500/30 px-3 rounded-xl">
                    <span className="font-bold text-sky-300">Estimated Payback Period</span>
                    <span className="text-sm font-black text-sky-200">
                      {buyerStats.paybackPeriodMonths} Months (~{buyerStats.paybackPeriodYears} Yrs)
                    </span>
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Discuss Units with an Advisor</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SELLER SETUP CALCULATOR */}
        {activeTab === 'seller' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Inputs (Left 7 Cols) - MANUAL NUMERIC INPUTS ONLY, NO SLIDERS */}
              <div className="lg:col-span-7 space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-sky-600" />
                    <span>Seller Asset Inventory & Valuation (KES)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Itemize physical furnishings, appliances, deposits, and goodwill.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Furniture & Equipment */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Furniture & Equipment
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">KES</span>
                      <input
                        type="number"
                        value={furnitureEquipment || ''}
                        onChange={(e) => setFurnitureEquipment(Number(e.target.value) || 0)}
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="140000"
                      />
                    </div>
                  </div>

                  {/* Electronics */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Electronics (TV, Audio, Smart Locks)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">KES</span>
                      <input
                        type="number"
                        value={electronics || ''}
                        onChange={(e) => setElectronics(Number(e.target.value) || 0)}
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="65000"
                      />
                    </div>
                  </div>

                  {/* Kitchen Equipment */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Kitchen Equipment (Fridge, Microwave, Cookware)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">KES</span>
                      <input
                        type="number"
                        value={kitchenEquipment || ''}
                        onChange={(e) => setKitchenEquipment(Number(e.target.value) || 0)}
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="30000"
                      />
                    </div>
                  </div>

                  {/* Décor */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Décor, Curtains & Linens
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">KES</span>
                      <input
                        type="number"
                        value={decor || ''}
                        onChange={(e) => setDecor(Number(e.target.value) || 0)}
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="20000"
                      />
                    </div>
                  </div>

                  {/* Other Assets */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Other Assets
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">KES</span>
                      <input
                        type="number"
                        value={otherAssets || ''}
                        onChange={(e) => setOtherAssets(Number(e.target.value) || 0)}
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="15000"
                      />
                    </div>
                  </div>

                  {/* Landlord Deposit */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Landlord Security Deposit
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">KES</span>
                      <input
                        type="number"
                        value={landlordDeposit || ''}
                        onChange={(e) => setLandlordDeposit(Number(e.target.value) || 0)}
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="25000"
                      />
                    </div>
                  </div>

                  {/* Goodwill */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Goodwill (Optional Setup Premium)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">KES</span>
                      <input
                        type="number"
                        value={goodwill || ''}
                        onChange={(e) => setGoodwill(Number(e.target.value) || 0)}
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Output (Right 5 Cols) */}
              <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-7 rounded-3xl space-y-6 shadow-xl border border-slate-800">
                <div className="border-b border-slate-800 pb-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                    Asking Price Calculation
                  </span>
                  <h4 className="text-xl font-black text-white mt-0.5">Setup Asking Valuation</h4>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-800">
                    <span className="text-slate-400">Total Asset Value</span>
                    <span className="text-sm font-black text-white">
                      {formatKES(sellerStats.totalAssetValue)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-800">
                    <span className="text-slate-400">+ Landlord Deposit</span>
                    <span className="text-sm font-black text-sky-300">
                      +{formatKES(sellerStats.deposit)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-800">
                    <span className="text-slate-400">+ Goodwill</span>
                    <span className="text-sm font-black text-sky-300">
                      +{formatKES(sellerStats.goodwill)}
                    </span>
                  </div>

                  <div className="p-4 bg-emerald-950/60 border border-emerald-500/30 rounded-2xl space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">
                      Total Asking Price
                    </span>
                    <div className="text-2xl font-black text-emerald-400">
                      {formatKES(sellerStats.totalAskingPrice)}
                    </div>
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>List Your Airbnb Setup on Rentals Kenya</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Mandatory Explicit Disclaimer */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-extrabold block text-amber-950 tracking-wide">
              ESTIMATES ONLY — ACTUAL PERFORMANCE MAY VARY.
            </span>
            <p className="leading-relaxed">
              Financial calculations, revenue models, expense ratios, and payback periods are indicative projections based solely on your entered numeric values and historical Nairobi hospitality benchmarks. Rentals Kenya does not guarantee rental yield, platform bookings, or specific financial results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
