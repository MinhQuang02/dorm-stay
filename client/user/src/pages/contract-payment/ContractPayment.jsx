import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

// ── Reusable Header (user layout) ──
function Header() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <header className="sticky top-0 z-50 bg-[#faeddb] rounded-b-3xl px-6 md:px-12 py-4 grid grid-cols-[auto_1fr_auto] items-center shadow-sm">
      <div className="flex-shrink-0">
        <img src="/logo.svg" alt="Logo" className="h-10 md:h-12 object-contain" />
      </div>
      <h1 className="hidden md:block text-center text-[#cc6b34] font-['Playfair_Display'] text-3xl font-bold tracking-wide translate-x-[40px]">
        Contract Payment
      </h1>
      <div className="flex items-center gap-6 justify-end">
        <a href="mailto:mphanquang06@gmail.com"
          className="text-sm font-medium text-gray-600 hover:text-[#cc6b34] transition-colors hidden sm:block">
          Contact us
        </a>
        <span className="bg-[#cc6b34] text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2">
          {user.username || "User"}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth="2" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </div>
    </header>
  );
}

// ── Format helpers ──
const fmt     = (n) => new Intl.NumberFormat("vi-VN").format(n) + "đ";
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("vi-VN") : "—";

// ── STEP 1: Choose Contract ──
function StepChooseContract({ onContinue }) {
  const [contracts, setContracts] = useState([]);
  const [selected, setSelected]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res   = await fetch(`${API_BASE}/payment/my-contracts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data  = await res.json();
        if (data.success) {
          setContracts(data.data);
          if (data.data.length > 0) setSelected(data.data[0]);
        } else {
          setError("Could not load contracts.");
        }
      } catch {
        setError("Connection error.");
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  const hinhThucLabel = (h) => h === "O_GHEP" ? "By Bed" : "Full Room";
  const statusLabel   = (s) => {
    const map = { DA_THUE: "Active", TRONG: "Available", HET_HAN: "Expired", TERMINATED: "Terminated" };
    return map[s] || s;
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
      <div className="w-5 h-5 border-2 border-[#cc6b34] border-t-transparent rounded-full animate-spin" />
      Loading contracts...
    </div>
  );

  if (error) return <p className="text-center py-20 text-red-500">{error}</p>;

  if (contracts.length === 0) return (
    <p className="text-center py-20 text-gray-400">No active contracts found.</p>
  );

  return (
    <div className="px-6 md:px-16 py-10 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Choose your contract</h2>

      <div className="space-y-4">
        {contracts.map((c) => (
          <div key={c.idHopDong}
            onClick={() => setSelected(c)}
            className={`cursor-pointer rounded-2xl p-6 transition-all border-2 ${
              selected?.idHopDong === c.idHopDong
                ? "border-[#cc6b34] bg-[#fdf5ed]"
                : "border-transparent bg-[#faf5ef] hover:border-[#e8c9a8]"
            }`}>
            <div className="flex gap-6 items-start">
              {/* Icon */}
              <div className="w-28 h-28 flex-shrink-0 bg-[#f0e0cc] rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 80 80" className="w-20 h-20">
                  <rect x="10" y="10" width="45" height="60" rx="4" fill="#4A9EDB" />
                  <path d="M25 10 L55 10 L55 55 L25 55 Z" fill="#cc6b34" />
                </svg>
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="text-[#cc6b34] font-bold text-lg mb-3">
                  Contract Code: {c.contractCode}
                </p>
                <div className="grid grid-cols-3 gap-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700">Owner</p>
                    <p className="text-gray-500">
                      {c.owners[0] || "N/A"}
                      {c.owners.length > 1 && (
                        <span className="text-[#cc6b34] ml-1">(+{c.owners.length - 1})</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Creator</p>
                    <p className="text-gray-500">{c.creatorName}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Contract Status</p>
                    <p className="text-gray-500">{statusLabel(c.trangThai)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Form of Rental</p>
                    <p className="text-gray-500">{hinhThucLabel(c.hinhThuc)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Start Date</p>
                    <p className="text-gray-500">{fmtDate(c.ngayBatDau)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Payment Period</p>
                    <p className="text-gray-500">{c.kyThanhToan || "—"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">Creation Date</p>
                    <p className="text-gray-500">{fmtDate(c.ngayLap)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">End Date</p>
                    <p className="text-gray-500">{fmtDate(c.ngayKetThuc)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-5 pt-4 border-t border-[#e8d5be]">
              <button className="flex items-center gap-2 text-[#cc6b34] text-sm font-medium px-4 py-2 border border-[#cc6b34] rounded-lg hover:bg-[#cc6b34]/10 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Report this
              </button>
              {selected?.idHopDong === c.idHopDong && (
                <button
                  onClick={() => onContinue(c)}
                  className="flex items-center gap-2 bg-[#cc6b34] text-white text-sm font-bold px-8 py-2.5 rounded-xl hover:bg-[#b55e2d] transition-all shadow-sm hover:shadow-md active:scale-95">
                  Continue
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── STEP 2: Payment Form ──
function StepPayment({ contract, onSuccess }) {
  const [detail, setDetail]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [payMethod, setPayMethod] = useState("CHUYEN_KHOAN");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState("");

  // Countdown 10 minutes for QR
  const [countdown, setCountdown] = useState(600);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchDetail();
    timerRef.current = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const fetchDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(`${API_BASE}/payment/contract/${contract.idHopDong}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data  = await res.json();
      if (data.success) setDetail(data.data);
      else setError("Could not load contract details.");
    } catch {
      setError("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!detail) return;
    try {
      setSubmitting(true);
      setError("");
      const token = localStorage.getItem("token");
      const res   = await fetch(`${API_BASE}/payment/pay`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({
          idHopDong:    detail.idHopDong,
          tienThanhToan: detail.totalAmount,
          phuongThuc:   payMethod,
        }),
      });
      const data  = await res.json();
      if (data.success) {
        clearInterval(timerRef.current);
        onSuccess(data.data);
      } else {
        setError(data.message || "Payment failed.");
      }
    } catch {
      setError("Connection error.");
    } finally {
      setSubmitting(false);
    }
  };

  const fmtCountdown = () => {
    const m = String(Math.floor(countdown / 60)).padStart(2, "0");
    const s = String(countdown % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
      <div className="w-5 h-5 border-2 border-[#cc6b34] border-t-transparent rounded-full animate-spin" />
      Loading payment details...
    </div>
  );

  const summaryItems = detail ? [
    { label: "Periodic Rent",   desc: "The recurring monthly payment as per the contract.", amount: detail.bedPrice },
    { label: "Utility Fee",     desc: "Monthly electricity & water bill as per the contract.", amount: detail.utilityFee },
    ...detail.services.map((s) => ({ label: s.name, desc: "Monthly service fee as per the contract.", amount: s.amount })),
  ] : [];

  return (
    <div className="px-6 md:px-16 py-10 max-w-5xl mx-auto">
      <div className="flex gap-10">

        {/* ── Left: Payment Form ── */}
        <div className="flex-1 border-r border-gray-200 pr-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Contract Payment</h2>
          <div className="w-full h-px bg-gray-200 mb-6" />

          {/* Pay With */}
          <p className="font-semibold text-gray-700 mb-3">Pay With:</p>
          <div className="flex gap-6 mb-6">
            {[
              { value: "TIEN_MAT", label: "Card" },
              { value: "CHUYEN_KHOAN", label: "Bank" },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-600">
                <input type="radio" name="payMethod" value={opt.value}
                  checked={payMethod === opt.value}
                  onChange={() => setPayMethod(opt.value)}
                  className="accent-[#cc6b34] w-4 h-4" />
                {opt.label}
              </label>
            ))}
          </div>

          {/* Bank Transfer details */}
          {payMethod === "CHUYEN_KHOAN" && detail && (
            <div className="flex gap-5 items-start mb-6">
              {/* QR placeholder */}
              <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                <svg viewBox="0 0 100 100" className="w-20 h-20">
                  {[0,30,60].map((x) => [0,30,60].map((y) => (
                    <rect key={`${x}-${y}`} x={x+2} y={y+2} width={22} height={22} rx={2}
                      fill={Math.random() > 0.4 ? "#1a1a2e" : "#f0f0f0"} />
                  )))}
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Transfer <span className="font-bold text-gray-800">{fmt(detail?.totalAmount || 0)}</span> to:
                </p>
                <p className="font-bold text-gray-800 text-lg">Vietcombank</p>
                <p className="font-bold text-gray-700 text-xl tracking-widest flex items-center gap-2">
                  0123456781
                  <button className="text-gray-400 hover:text-[#cc6b34] transition-colors"
                    onClick={() => navigator.clipboard.writeText("0123456781")}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Expires in{" "}
                  <span className={`font-bold ${countdown < 60 ? "text-red-500" : "text-[#cc6b34]"}`}>
                    {fmtCountdown()}
                  </span>{" "}minutes
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="w-full py-3.5 bg-[#cc6b34] text-white font-bold rounded-xl hover:bg-[#b55e2d] transition-all shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 mb-4">
            {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Confirm Payment
          </button>

          <p className="text-xs text-gray-400 leading-relaxed">
            Your personal data will be used to process your order, support your experience throughout this website,
            and for other purposes described in our privacy policy.
          </p>
        </div>

        {/* ── Right: Contract Summary ── */}
        <div className="w-80 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Contract Summary</h2>
          <div className="w-full h-px bg-gray-200 mb-6" />

          <div className="space-y-5">
            {summaryItems.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-gray-700 text-sm">
                    {idx + 1}. {item.label}
                  </p>
                  <p className="font-bold text-gray-800 text-sm ml-4 whitespace-nowrap">{fmt(item.amount)}</p>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 pr-4">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="w-full h-px bg-gray-200 my-6" />

          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-700">Total</p>
            <p className="text-3xl font-bold text-gray-900">{fmt(detail?.totalAmount || 0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── STEP 3: Success ──
function StepSuccess() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <h2 className="text-4xl font-bold text-[#cc6b34] font-['Playfair_Display'] mb-4 tracking-widest uppercase">
        Success
      </h2>
      <p className="text-gray-600 mb-2">The payment process was successful.</p>
      <p className="text-gray-600 mb-10">The invoice will be send to your email.</p>

      {/* Animated check icon */}
      <svg viewBox="0 0 120 120" className="w-28 h-28 mb-10">
        <circle cx="60" cy="60" r="52" fill="none" stroke="#cc6b34" strokeWidth="5" />
        <polyline points="35,62 52,80 85,42" fill="none" stroke="#cc6b34" strokeWidth="6"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ strokeDasharray: 80, strokeDashoffset: 0 }} />
      </svg>

      <button
        onClick={() => navigate("/")}
        className="px-10 py-3 bg-[#cc6b34] text-white font-bold rounded-xl hover:bg-[#b55e2d] transition-all shadow-sm hover:shadow-md active:scale-95">
        Back to Home
      </button>
    </div>
  );
}

// ── Main Page: orchestrate 3 steps ──
export default function ContractPayment() {
  const [step, setStep]         = useState(1); // 1 | 2 | 3
  const [contract, setContract] = useState(null);

  const handleContinue = (selectedContract) => {
    setContract(selectedContract);
    setStep(2);
  };

  const handleSuccess = () => {
    setStep(3);
  };

  return (
    <div className="w-full min-h-screen bg-[#f5f5f5] flex justify-center" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-[calc(100%-210px)] max-w-[1600px] bg-[#fafaf9] shadow-2xl relative flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {step === 1 && <StepChooseContract onContinue={handleContinue} />}
          {step === 2 && <StepPayment contract={contract} onSuccess={handleSuccess} />}
          {step === 3 && <StepSuccess />}
        </main>
      </div>
    </div>
  );
}
