import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

/*
 Purchase page for SmartDev
 - Auto-populates service & provider from URL query params: ?service=airtime&provider=mtn
 - Provider-specific data bundles & airtime denominations (amount auto-populated / read-only)
 - Discounts applied to displayed amount
 - Password required before submission
 - Pay button shows transaction status modal (simulated), does NOT navigate immediately
 - Tailwind CSS styling, replace emoji icons with real logos as needed
*/

const PROVIDERS = {
  data: [
    { id: "mtn", name: "MTN", icon: "🟡", discount: "5.5%" },
    { id: "airtel", name: "Airtel", icon: "🔴", discount: "5%" },
    { id: "glo", name: "Glo", icon: "🟢", discount: "3%" },
    { id: "9mobile", name: "9mobile", icon: "🔵", discount: "4%" },
  ],
  airtime: [
    { id: "mtn", name: "MTN", icon: "🟡", discount: "3%" },
    { id: "airtel", name: "Airtel", icon: "🔴", discount: "2.5%" },
    { id: "glo", name: "Glo", icon: "🟢", discount: "2%" },
    { id: "9mobile", name: "9mobile", icon: "🔵", discount: "2%" },
  ],
  tv: [
    { id: "dstv", name: "DSTV", icon: "📺" },
    { id: "gotv", name: "GOtv", icon: "📺" },
    { id: "startimes", name: "Startimes", icon: "📺" },
  ],
  electricity: [
    { id: "ikeja", name: "IKEDC", icon: "⚡" },
    { id: "eko", name: "EKEDC", icon: "⚡" },
    { id: "phed", name: "PHED", icon: "⚡" },
    { id: "kedco", name: "KEDCO", icon: "⚡" },
    { id: "aedc", name: "AEDC", icon: "⚡" },
  ],
};

const TV_PACKAGES = {
  dstv: [
    { id: "premium", name: "Premium", price: 24500 },
    { id: "compact-plus", name: "Compact Plus", price: 16600 },
    { id: "compact", name: "Compact", price: 10500 },
  ],
  gotv: [
    { id: "max", name: "GOtv Max", price: 4850 },
    { id: "jinja", name: "GOtv Jinja", price: 2250 },
    { id: "smallie", name: "GOtv Smallie", price: 900 },
  ],
  startimes: [
    { id: "nova", name: "Nova", price: 900 },
    { id: "basic", name: "Basic", price: 1700 },
    { id: "smart", name: "Smart", price: 2200 },
  ],
};

const METER_TYPES = [
  { id: "prepaid", name: "Prepaid Meter" },
  { id: "postpaid", name: "Postpaid Meter" },
];

const DATA_BUNDLES = {
  mtn: [
    { id: "mtn-500mb", label: "500MB - 7 days", price: 250 },
    { id: "mtn-1gb", label: "1GB - 30 days", price: 490 },
    { id: "mtn-2gb", label: "2GB - 30 days", price: 950 },
  ],
  airtel: [
    { id: "airtel-500mb", label: "500MB - 7 days", price: 230 },
    { id: "airtel-1gb", label: "1GB - 30 days", price: 450 },
    { id: "airtel-2gb", label: "2GB - 30 days", price: 880 },
  ],
  glo: [
    { id: "glo-500mb", label: "500MB - 7 days", price: 200 },
    { id: "glo-1gb", label: "1GB - 30 days", price: 450 },
    { id: "glo-2gb", label: "2GB - 30 days", price: 900 },
  ],
  "9mobile": [
    { id: "9mobile-500mb", label: "500MB - 7 days", price: 240 },
    { id: "9mobile-1gb", label: "1GB - 30 days", price: 480 },
    { id: "9mobile-2gb", label: "2GB - 30 days", price: 920 },
  ],
};

const AIRTIME_DENOMS = [50, 100, 200, 500, 1000];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Purchase() {
  const query = useQuery();
  const navigate = useNavigate();

  const initialService = (query.get("service") || "data").toLowerCase();
  const initialProvider = (query.get("provider") || "").toLowerCase();

  const [service, setService] = useState(initialService);
  const [provider, setProvider] = useState(initialProvider || "");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("WALLET");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  const [txModalOpen, setTxModalOpen] = useState(false);
  const [txResult, setTxResult] = useState(null);

  const [wallet] = useState({ balance: 938.68, currency: "₦" });

  const [selectedBundle, setSelectedBundle] = useState("");
  const [selectedAirtime, setSelectedAirtime] = useState(null);
  const [customAirtime, setCustomAirtime] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [meterType, setMeterType] = useState("prepaid");
  const [meterNumber, setMeterNumber] = useState("");

  useEffect(() => {
    const list = PROVIDERS[service] || [];
    if (initialProvider) {
      const found = list.find((p) => p.id.toLowerCase() === initialProvider);
      if (found) {
        setProvider(found.id);
        return;
      }
    }
    if (!provider && list.length) setProvider(list[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, initialProvider]);

  useEffect(() => {
    setSelectedBundle("");
    setSelectedAirtime(null);
    setCustomAirtime("");
    setAmount("");
    setSelectedPackage("");
    setMeterNumber("");
    setRecipient("");
  }, [provider, service]);

  const providersForService = PROVIDERS[service] || [];

  const parseDiscount = (discountStr = "0%") => {
    const m = String(discountStr).match(/([\d.]+)%/);
    return m ? Number(m[1]) / 100 : 0;
  };

  const formatCurrency = (v) => {
    if (v === "" || v === null || isNaN(Number(v))) return `₦0.00`;
    return `₦${Number(v).toFixed(2)}`;
  };

  const handleSelectBundle = (bundleId) => {
    const bundle = Object.values(DATA_BUNDLES).flat().find((b) => b.id === bundleId);
    if (!bundle) return;
    setSelectedBundle(bundle.id);
    const discount = parseDiscount(PROVIDERS.data.find((p) => p.id === provider)?.discount);
    const discounted = Math.round((bundle.price * (1 - (discount || 0)) + Number.EPSILON) * 100) / 100;
    setAmount(discounted.toFixed(2));
  };

  const handleSelectAirtime = (denom) => {
    setSelectedAirtime(denom);
    setCustomAirtime("");
    const discount = parseDiscount(PROVIDERS.airtime.find((p) => p.id === provider)?.discount);
    const discounted = Math.round((denom * (1 - (discount || 0)) + Number.EPSILON) * 100) / 100;
    setAmount(discounted.toFixed(2));
  };

  const handleCustomAirtimeChange = (val) => {
    setCustomAirtime(val);
    setSelectedAirtime(null);
    const num = Number(val);
    if (!num || num < 50) {
      setAmount("");
      return;
    }
    const capped = Math.min(10000, num);
    const discount = parseDiscount(PROVIDERS.airtime.find((p) => p.id === provider)?.discount);
    const discounted = Math.round((capped * (1 - (discount || 0)) + Number.EPSILON) * 100) / 100;
    setAmount(discounted.toFixed(2));
  };

  const renderServiceFields = () => {
    switch (service) {
      case "tv":
        return (
          <>
            <div>
              <label className="text-sm font-medium block mb-2">Package</label>
              <select
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
              >
                <option value="">Select package</option>
                {TV_PACKAGES[provider]?.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} - ₦{pkg.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Smart Card Number</label>
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter smart card number"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
              />
            </div>
          </>
        );

      case "electricity":
        return (
          <>
            <div>
              <label className="text-sm font-medium block mb-2">Meter Type</label>
              <select
                value={meterType}
                onChange={(e) => setMeterType(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
              >
                {METER_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Meter Number</label>
              <input
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                placeholder="Enter meter number"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
              />
            </div>
          </>
        );

      case "data": {
        const bundles = DATA_BUNDLES[provider] || [];
        return (
          <>
            <div className="mb-3">
              <div className="text-sm font-medium mb-2">Select bundle (combo)</div>

              {/* simple combo: filter + select to accommodate many options */}
              <div className="mb-2">
                {/* <input
                  placeholder="Filter bundles..."
                  onChange={(e) => {
                    const filter = e.target.value.toLowerCase();
                    // keep simple: set a temporary filter state by reassigning provider's filtered list via DOM select below
                    document.querySelectorAll(`#bundle-option`).forEach((opt) => {
                      opt.style.display = opt.dataset.label.toLowerCase().includes(filter) ? "block" : "none";
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent mb-2"
                /> */}
                <select
                  value={selectedBundle}
                  onChange={(e) => handleSelectBundle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
                >
                  <option value="">-- select bundle --</option>
                  {bundles.map((b) => {
                    const discount = parseDiscount(PROVIDERS.data.find((p) => p.id === provider)?.discount);
                    const discounted = Math.round((b.price * (1 - (discount || 0)) + Number.EPSILON) * 100) / 100;
                    return (
                      <option
                        id="bundle-option"
                        key={b.id}
                        value={b.id}
                        data-label={b.label}
                      >
                        {b.label} — {formatCurrency(discounted)} ({formatCurrency(b.price)})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="text-xs text-gray-500">Selected bundle populates amount (discount applied)</div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Phone number</label>
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. 08150411479"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-600"
              />
            </div>
          </>
        );
      }

      case "airtime": {
        const discountForAirtime = parseDiscount(PROVIDERS.airtime.find((p) => p.id === provider)?.discount);
        return (
          <>
            <div className="mb-3">
              <div className="text-sm font-medium mb-2">Quick amounts</div>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {AIRTIME_DENOMS.map((d) => {
                  const discounted = Math.round((d * (1 - (discountForAirtime || 0)) + Number.EPSILON) * 100) / 100;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleSelectAirtime(d)}
                      className={`p-2 rounded-xl border text-sm ${
                        selectedAirtime === d ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                      }`}
                    >
                      <div>{d}N</div>
                      <div className="text-xs text-green-500">{formatCurrency(discounted)}</div>
                    </button>
                  );
                })}
              </div>

              <div className="mb-2">
                <label className="text-sm font-medium block mb-1">Custom amount (50 to 10000)</label>
                <input
                  type="number"
                  min="50"
                  max="10000"
                  value={customAirtime}
                  onChange={(e) => handleCustomAirtimeChange(e.target.value)}
                  placeholder="50 to 10000"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
                />
                <div className="text-xs text-gray-500 mt-1">Entered amount will be discounted based on provider rate and populated in Amount field.</div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Phone number</label>
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. 08150411479"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-600"
              />
            </div>
          </>
        );
      }

      default:
        return null;
    }
  };

  const validate = () => {
    if (!provider) return "Please select a provider.";

    switch (service) {
      case "tv":
        if (!selectedPackage) return "Please select a package.";
        if (!recipient || recipient.length < 10) return "Please enter a valid smart card number.";
        break;

      case "electricity":
        if (!meterNumber || meterNumber.length < 6) return "Please enter a valid meter number.";
        break;

      case "data":
        if (!selectedBundle) return "Please select a data bundle.";
        if (!recipient || recipient.length < 11) return "Please enter a valid phone number.";
        break;

      case "airtime":
        if (!selectedAirtime && (!customAirtime || Number(customAirtime) < 50)) return "Please select or enter an airtime amount (min 50).";
        if (!recipient || recipient.length < 11) return "Please enter a valid phone number.";
        break;

      default:
        break;
    }

    if (!password || password.length < 4) return "Password is required to authenticate transaction.";

    const amt = Number(amount);
    if (!amt || amt <= 0) return "Please enter a valid amount.";

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const v = validate();
    if (v) return setError(v);

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      const tx = {
        id: `TX${Math.floor(Math.random() * 900000 + 100000)}`,
        status: "SUCCESSFUL",
        type:
          service === "data"
            ? "DATA PURCHASE"
            : service === "airtime"
            ? "AIRTIME PURCHASE"
            : service === "tv"
            ? "TV SUBSCRIPTION"
            : "ELECTRICITY",
        description:
          service === "data"
            ? Object.values(DATA_BUNDLES)
                .flat()
                .find((b) => b.id === selectedBundle)?.label
            : service === "airtime"
            ? `${selectedAirtime ?? customAirtime} Naira top-up`
            : service === "tv"
            ? TV_PACKAGES[provider]?.find((p) => p.id === selectedPackage)?.name
            : service === "electricity"
            ? `${meterType} - meter`
            : "",
        recipient: recipient || "-",
        amount: Number(amount),
        paymentMethod,
        date: new Date().toISOString(),
      };

      setTxResult(tx);
      setTxModalOpen(true);
      setPassword("");
    }, 900);
  };

  const closeModal = () => {
    setTxModalOpen(false);
    setTxResult(null);
  };

  const doneAndGotoTransactions = () => {
    closeModal();
    navigate("/transactions");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {service === "data"
                ? "Buy Data"
                : service === "airtime"
                ? "Buy Airtime"
                : service === "tv"
                ? "TV Subscription"
                : "Pay Electricity"}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Quick checkout — select provider and complete purchase</p>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <Link to="/dashboard" className="text-blue-600 hover:underline mr-3">Back to dashboard</Link>
            <span>Autofill: {provider || "none"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-semibold mb-3">Select provider</h3>

              <div className="space-y-3">
                {providersForService.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setProvider(p.id); setService(service); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border ${provider === p.id ? "border-blue-500 shadow" : "border-gray-100 dark:border-gray-700"} bg-white dark:bg-gray-800 hover:shadow-sm transition`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-2xl">{p.icon}</div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{p.name}</div>
                      {p.discount && <div className="text-xs text-green-600 dark:text-green-400">{p.discount} discount</div>}
                    </div>
                    {provider === p.id && <div className="text-sm text-blue-600 font-semibold">Selected</div>}
                  </button>
                ))}

                {providersForService.length === 0 && <div className="text-xs text-gray-500">No providers available for this service.</div>}
              </div>
            </div>

            <div className="mt-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 text-sm">
              <div className="font-semibold mb-2">Need help?</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">For TV or Electricity purchases, ensure you have the correct smartcard or meter number.</div>
            </div>
          </aside>

          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium block mb-2">Service</label>
                <select value={service} onChange={(e) => setService(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-600 outline-none">
                  <option value="data">Data</option>
                  <option value="airtime">Airtime</option>
                  <option value="tv">TV Subscription</option>
                  <option value="electricity">Electricity</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Provider</label>
                <select value={provider} onChange={(e) => setProvider(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-600 outline-none">
                  {providersForService.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderServiceFields()}
              <div>
                <label className="text-sm font-medium block mb-2">Amount</label>
                <input value={amount} readOnly={service === "data" || service === "airtime"} onChange={(e) => setAmount(e.target.value)} placeholder={service === "airtime" ? "50 to 10000" : "0.00"} type="number" min="0" step="0.01" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-600" />
                {(service === "data" || service === "airtime") ? <div className="text-xs text-gray-500 mt-1">Amount populated from selected bundle/denomination (discount applied)</div> : null}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-sm font-medium block mb-2">Payment method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-600">
                  <option value="WALLET">Wallet</option>
                  <option value="CARD">Card</option>
                  <option value="BANK">Bank Transfer</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium block mb-2">Enter Password to complete transaction</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-600" />
              </div>
            </div>

            {error && <div className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</div>}

            <div className="mt-6 flex items-center justify-between gap-4">
              <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-6 py-3 shadow-md disabled:opacity-60 transition">
                {loading ? "Processing..." : `Pay ${wallet.currency} ${Number(amount || 0).toFixed(2)}`}
              </button>

              <div className="text-sm text-gray-600 dark:text-gray-300">Wallet: <span className="font-semibold">{wallet.currency} {wallet.balance.toLocaleString()}</span></div>
            </div>
          </form>
        </div>
      </div>

      {txModalOpen && txResult && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-md w-full p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{txResult.status === "SUCCESSFUL" ? "✅" : "❌"}</div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">{txResult.status}</div>
                  <div className="font-semibold">{txResult.type}</div>
                </div>
              </div>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">✕</button>
            </div>

            <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <div><span className="font-medium">Description:</span> {txResult.description}</div>
              <div><span className="font-medium">Recipient:</span> {txResult.recipient || "-"}</div>
              <div><span className="font-medium">Amount:</span> {formatCurrency(txResult.amount)}</div>
              <div><span className="font-medium">Payment:</span> {txResult.paymentMethod}</div>
              <div><span className="font-medium">Transaction ID:</span> {txResult.id}</div>
              <div><span className="font-medium">Date:</span> {new Date(txResult.date).toLocaleString()}</div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={doneAndGotoTransactions} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}