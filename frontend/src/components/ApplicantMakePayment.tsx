"use client";

import React, { useState, useMemo } from "react";
import { Application, formatINR } from "../context/VisaContext";
import {
  CreditCard,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Download,
  Tag,
  Zap,
  Info,
  HelpCircle,
  QrCode,
  Building2,
  Clock,
  FileText,
  Check,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldAlert,
  User,
  Plane
} from "lucide-react";

interface ApplicantMakePaymentProps {
  applications: Application[];
  walletBalance: number;
  onPaymentSuccess?: (amount: number, reference: string) => void;
  onNavigateSupport?: () => void;
}

export default function ApplicantMakePayment({
  applications,
  walletBalance = 25000,
  onPaymentSuccess,
  onNavigateSupport
}: ApplicantMakePaymentProps) {
  // Target Application Mock Reference
  const activeApp = useMemo(() => {
    return applications[0] || {
      id: "VO-2026-1025",
      travelerName: "Geeta Sharma",
      dob: "1995-06-12",
      passportNumber: "Z9817264",
      destination: "Australia",
      visaType: "Tourist Subclass 600",
      fees: 16500
    };
  }, [applications]);

  // Payment Method Selection State
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking" | "wallet" | "emi">("card");

  // Form Fields State
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8892");
  const [cardHolder, setCardHolder] = useState("Geeta Sharma");
  const [expiry, setExpiry] = useState("08/29");
  const [cvv, setCvv] = useState("•••");

  const [upiId, setUpiId] = useState("geeta@okaxis");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  // Billing Address State
  const [billingName, setBillingName] = useState("Geeta Sharma");
  const [billingEmail, setBillingEmail] = useState("geeta.sharma@gmail.com");
  const [billingPhone, setBillingPhone] = useState("+91 98765 43210");
  const [billingAddress, setBillingAddress] = useState("104, Park Street, Connaught Place");
  const [billingPincode, setBillingPincode] = useState("110001");

  // Promo Code State
  const [promoCode, setPromoCode] = useState("WELCOME10");
  const [discountApplied, setDiscountApplied] = useState(1000);
  const [promoSuccess, setPromoSuccess] = useState(true);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);

  // Price breakdown calculations
  const consularFee = 12500;
  const platformFee = 2500;
  const gstTax = 1500;
  const totalPayable = consularFee + platformFee + gstTax - discountApplied;

  // Handle Apply Coupon
  const handleApplyCoupon = () => {
    if (promoCode.toUpperCase() === "WELCOME10") {
      setDiscountApplied(1000);
      setPromoSuccess(true);
    } else if (promoCode.toUpperCase() === "PHANTOM500") {
      setDiscountApplied(500);
      setPromoSuccess(true);
    } else {
      setDiscountApplied(0);
      setPromoSuccess(false);
    }
  };

  // Handle Submit Payment
  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaidSuccess(true);
      if (onPaymentSuccess) {
        onPaymentSuccess(totalPayable, `PAY-2026-${activeApp.id.replace("VO-", "")}`);
      }
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      
      {/* ============================================================ */}
      {/* SECTION 1: HEADER & CHECKOUT STATUS BANNER */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4848F7] mb-1">
            <span>Home</span>
            <span>/</span>
            <span>Payments</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">Make Payment</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Instant Consular Checkout & Fee Settlement</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Lock size={12} className="text-emerald-600" /> 256-Bit SSL Encrypted
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-3xl">
            Select your preferred payment method, review itemized consular charges, apply promo codes, and complete instant checkout.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => alert("Downloading Proforma Invoice PDF...")}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition flex items-center gap-2 cursor-pointer"
          >
            <Download size={16} />
            <span>Proforma Invoice PDF</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: DASHBOARD STATISTICS CARDS GRID (6 CARDS) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Payable */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-[#4848F7]">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Total Payable</p>
          <p className="text-2xl font-black text-[#4848F7] mt-1">₹{formatINR(totalPayable)}</p>
          <span className="text-[10px] text-[#4848F7] font-semibold flex items-center gap-1">
            <Zap size={10} /> Instant Checkout
          </span>
        </div>

        {/* Card 2: Wallet Balance */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-emerald-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Wallet Balance</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">₹{formatINR(walletBalance)}</p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <Wallet size={10} /> 1-Click Pay Ready
          </span>
        </div>

        {/* Card 3: Consular Fee */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Consular Fee</p>
          <p className="text-xl font-bold text-slate-900 mt-1">₹{formatINR(consularFee)}</p>
          <span className="text-[10px] text-slate-400 font-medium">Embassy charge</span>
        </div>

        {/* Card 4: Platform Fee */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Service Fee</p>
          <p className="text-xl font-bold text-slate-900 mt-1">₹{formatINR(platformFee)}</p>
          <span className="text-[10px] text-slate-400 font-medium">Doc processing</span>
        </div>

        {/* Card 5: GST / Taxes */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">GST (18%)</p>
          <p className="text-xl font-bold text-slate-900 mt-1">₹{formatINR(gstTax)}</p>
          <span className="text-[10px] text-slate-400 font-medium">Tax invoice compliant</span>
        </div>

        {/* Card 6: Discount Applied */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs border-l-4 border-l-indigo-500">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Discount Saved</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">-₹{formatINR(discountApplied)}</p>
          <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
            <Tag size={10} /> Promo Code Applied
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: CONCEPTUAL WORKFLOW BANNER (CONNECTED 3-PARTY PAYMENT FLOW) */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="text-[#4848F7]" size={20} />
            <h3 className="text-sm font-extrabold tracking-wide uppercase text-indigo-200">
              Connected Payment Workflow (Applicant ➔ Agent ➔ Admin / Gateway)
            </h3>
          </div>
          <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full font-bold">
            100% Money-Back Guarantee
          </span>
        </div>

        {/* Workflow Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs font-semibold">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 1</span>
            <p className="text-white">Applicant Selects Payment Method</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 2</span>
            <p className="text-white">Payment Gateway SSL Authorization</p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <span className="text-indigo-300 block text-[10px] uppercase">Step 3</span>
            <p className="text-white">Consular Processing Instantly Triggered</p>
          </div>

          <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/30 space-y-1 text-emerald-300">
            <span className="text-emerald-300 block text-[10px] uppercase">Step 4</span>
            <p className="font-bold">GST Tax Invoice Generated ✓</p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 4: MAIN PAYMENT CHECKOUT GRID */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Payment Form & Methods (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Payment Method Selector Tabs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard size={18} className="text-[#4848F7]" />
              <span>Select Payment Method</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                  paymentMethod === "card"
                    ? "bg-indigo-50 border-[#4848F7] text-[#4848F7]"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <CreditCard size={18} />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("upi")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                  paymentMethod === "upi"
                    ? "bg-indigo-50 border-[#4848F7] text-[#4848F7]"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <QrCode size={18} />
                <span>UPI Instant</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("netbanking")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                  paymentMethod === "netbanking"
                    ? "bg-indigo-50 border-[#4848F7] text-[#4848F7]"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Building2 size={18} />
                <span>Net Banking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("wallet")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                  paymentMethod === "wallet"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Wallet size={18} />
                <span>Wallet ({formatINR(walletBalance)})</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("emi")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                  paymentMethod === "emi"
                    ? "bg-indigo-50 border-[#4848F7] text-[#4848F7]"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Clock size={18} />
                <span>EMI / Pay Later</span>
              </button>
            </div>

            {/* Input Forms Based on Selected Method */}
            <form onSubmit={handlePayNow} className="space-y-4 pt-2">
              
              {/* CARD FORM */}
              {paymentMethod === "card" && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 0000 0000 0000"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-[#4848F7]"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Name on Card</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:border-[#4848F7]"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-[#4848F7]"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">CVV Code</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-[#4848F7]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI FORM */}
              {paymentMethod === "upi" && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Enter Virtual Payment Address (VPA / UPI ID)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okicici"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-[#4848F7]"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">Supports Google Pay, PhonePe, Paytm, BHIM, and all UPI apps.</p>
                </div>
              )}

              {/* NET BANKING FORM */}
              {paymentMethod === "netbanking" && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <label className="text-slate-700 font-semibold block">Select Popular Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:border-[#4848F7]"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {/* WALLET FORM */}
              {paymentMethod === "wallet" && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-950 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Available Wallet Credit:</span>
                    <span className="text-lg font-black text-emerald-700">₹{formatINR(walletBalance)}</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Instant 1-click payment with 0% gateway transaction fees. ₹{formatINR(totalPayable)} will be deducted.
                  </p>
                </div>
              )}

              {/* EMI FORM */}
              {paymentMethod === "emi" && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-2">
                  <p className="font-bold text-slate-900">Select EMI Provider</p>
                  <select className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold">
                    <option>ZestMoney (3 Months No Cost EMI @ ₹5,166/mo)</option>
                    <option>LazyPay (Pay Later in 15 Days)</option>
                  </select>
                </div>
              )}

              {/* Billing Address Subform */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <User size={15} className="text-[#4848F7]" /> Billing Address & Tax Receipt Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-500 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={billingName}
                      onChange={(e) => setBillingName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 block mb-1">Email for Receipt</label>
                    <input
                      type="email"
                      value={billingEmail}
                      onChange={(e) => setBillingEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#4848F7] hover:bg-indigo-700 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? <RefreshCw size={18} className="animate-spin" /> : <Lock size={18} />}
                  <span>{isProcessing ? "Authorizing Secure Payment..." : `Pay ₹${formatINR(totalPayable)} Now`}</span>
                </button>
              </div>

              {paidSuccess && (
                <div className="p-4 bg-emerald-50 text-emerald-900 text-xs font-bold rounded-xl border border-emerald-200 space-y-1">
                  <p className="flex items-center gap-2 text-sm">
                    <CheckCircle2 size={18} className="text-emerald-600" /> Payment Successful!
                  </p>
                  <p className="text-[11px] font-normal text-emerald-800">
                    Transaction ID: <strong>PAY-2026-{activeApp.id.replace("VO-", "")}</strong> &bull; Consular processing has been triggered.
                  </p>
                </div>
              )}

            </form>
          </div>

        </div>

        {/* Right Column: Fee Summary & Promo Code (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Itemized Fee Summary Breakdown Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText size={16} className="text-[#4848F7]" />
              <span>Itemized Fee Summary</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Embassy Consular Visa Fee</span>
                <span className="font-bold text-slate-900">₹{formatINR(consularFee)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Documentation & Platform Fee</span>
                <span className="font-bold text-slate-900">₹{formatINR(platformFee)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">GST Tax (18%)</span>
                <span className="font-bold text-slate-900">₹{formatINR(gstTax)}</span>
              </div>

              {discountApplied > 0 && (
                <div className="flex justify-between text-indigo-600 font-bold bg-indigo-50 p-2 rounded-lg">
                  <span>Promo Code (WELCOME10)</span>
                  <span>-₹{formatINR(discountApplied)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm font-black text-slate-900">
              <span>Total Payable</span>
              <span className="text-xl text-[#4848F7]">₹{formatINR(totalPayable)}</span>
            </div>
          </div>

          {/* Promo Code Selector */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Tag size={15} className="text-indigo-600" />
              <span>Apply Discount Coupon</span>
            </h4>

            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="ENTER PROMO CODE"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase focus:outline-none focus:border-[#4848F7]"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Apply
              </button>
            </div>

            {promoSuccess && (
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <Check size={12} /> Coupon WELCOME10 applied! ₹1,000 saved.
              </span>
            )}
          </div>

          {/* Application Reference Details Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs">
            <h4 className="font-extrabold uppercase tracking-wider text-slate-500">Target Application Reference</h4>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Application ID:</span>
                <span className="font-mono font-bold text-slate-900">{activeApp.id}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="font-bold text-slate-900">{activeApp.destination} 🇦🇺</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Traveler Name:</span>
                <span className="font-bold text-slate-900">{activeApp.travelerName}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* SECTION 5: RECENT PAYMENT TRANSACTIONS TABLE */}
      {/* ============================================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <CreditCard size={16} className="text-[#4848F7]" />
            <span>Recent Payment Ledger & Receipts</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition">
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">PAY-2026-1025</td>
                <td className="py-3.5 px-4 text-slate-600">07 Aug 2026</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">₹15,500</td>
                <td className="py-3.5 px-4 text-slate-700">Credit Card (Visa)</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 size={12} /> Success
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => alert("Downloading receipt PDF...")}
                    className="p-1.5 text-[#4848F7] hover:bg-slate-100 rounded-lg transition font-bold"
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 6: MAKE PAYMENT FAQS ACCORDION */}
      {/* ============================================================ */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#4848F7]" />
          <span>Frequently Asked Questions regarding Payments</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">Is my payment information secure?</p>
            <p className="text-slate-600 leading-relaxed">
              Yes, all transactions are encrypted using AES-256 SSL and processed through PCI-DSS Level 1 compliant gateways.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
            <p className="font-bold text-slate-900">What happens after payment is successful?</p>
            <p className="text-slate-600 leading-relaxed">
              Your application is immediately routed to consular desk processing and your GST tax invoice is emailed to you.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
