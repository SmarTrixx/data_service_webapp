import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/*
 Dashboard (updated)
 - Adds network providers with discounts under Buy Data & Airtime cards
 - Shows provider logos for TV & Electricity cards
 - Wallet balance hide/show toggle
 - Keeps style: rounded-2xl, subtle shadows, Tailwind, dark/light compatible
 - Uses emojis as placeholders for logos (replace with images in /assets as needed)
*/

const networksData = [
  { id: "mtn", name: "MTN", discount: "5.5%", icon: "🟡" },
  { id: "airtel", name: "Airtel", discount: "5%", icon: "🔴" },
  { id: "glo", name: "Glo", discount: "3%", icon: "🟢" },
  { id: "9mobile", name: "9mobile", discount: "4%", icon: "🔵" },
];

const networksAirtime = [
  { id: "mtn", name: "MTN", discount: "3%", icon: "🟡" },
  { id: "airtel", name: "Airtel", discount: "2.5%", icon: "🔴" },
  { id: "glo", name: "Glo", discount: "2%", icon: "🟢" },
  { id: "9mobile", name: "9mobile", discount: "2%", icon: "🔵" },
];

const tvProviders = [
  { id: "dstv", name: "DSTV", icon: "📺" },
  { id: "gotv", name: "GOtv", icon: "📺" },
  { id: "startimes", name: "Startimes", icon: "📺" },
];

const electricityProviders = [
  { id: "ikeja", name: "IKEDC", icon: "⚡" },
  { id: "eko", name: "EKEDC", icon: "⚡" },
  { id: "phed", name: "PHED", icon: "⚡" },
  { id: "kano", name: "KEDCO", icon: "⚡" },
  { id: "abu", name: "AEDC", icon: "⚡" },
];


const dummyTx = [
  { id: 1, category: "Data", label: "GLO 1GB (30days) - Gifting", amount: -450, date: "23-10-2025 8:05pm" },
  { id: 2, category: "Data", label: "GLO 1GB (30days) - Gifting", amount: -450, date: "22-10-2025 2:05pm" },
  { id: 3, category: "Top-up", label: "ATM wallet funding", amount: 1381.94, date: "22-10-2025 2:03pm" },
];

const WALLET_ACTIONS = [
  { id: "fund", label: "Fund Wallet", icon: "💳" },
  { id: "transfer", label: "Transfer", icon: "↗️" },
  { id: "withdraw", label: "Withdraw", icon: "💰" },
  { id: "history", label: "History", icon: "📊" },
];

const FUNDING_OPTIONS = [
  { id: "card", label: "Card Payment", fee: "1.5%", icon: "💳" },
  { id: "bank", label: "Bank Transfer", fee: "₦50", icon: "🏦" },
  { id: "ussd", label: "USSD", fee: "₦20", icon: "📱" },
];

function ProviderBadge({ icon, name, discount, service, id }) {
  return (
    <Link 
      to={`/purchase?service=${service}&provider=${id}`}
      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
    >
      <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-xl">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold">{name}</div>
        {discount && <div className="text-xs text-green-600 dark:text-green-400">{discount} discount</div>}
      </div>
    </Link>
  );
}

function TxItem({ tx }) {
  const isExpense = tx.amount < 0;
  return (
    <li className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-sm transition-shadow">
      <div>
        <div className="text-sm font-semibold">{tx.label}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tx.date}</div>
      </div>

      <div className="text-right">
        <div className={`text-sm font-semibold ${isExpense ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
          {isExpense ? "-" : "+"}₦ {Math.abs(tx.amount).toLocaleString()}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tx.category}</div>
      </div>
    </li>
  );
}

export default function Dashboard() {
  const [wallet] = useState({ balance: 488.68, currency: "₦" });
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState(dummyTx);
  const [showManage, setShowManage] = useState(false);
  const [showFunding, setShowFunding] = useState(false);

  useEffect(() => {
    // placeholder for fetching wallet & transactions
    const t = setTimeout(() => {
      setTransactions(dummyTx);
    }, 200);
    return () => clearTimeout(t);
  }, []);

  const handleActionClick = (actionId) => {
    if (actionId === "fund") {
      setShowFunding(true);
    }
    // Handle other actions as needed
  };

  const handleBack = () => {
    if (showFunding) {
      setShowFunding(false);
    } else {
      setShowManage(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Jane</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Quick overview of your account</p>
          </div>

          <div className="w-full md:w-auto max-w-md">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl shadow-lg p-4">
              {showFunding ? (
                <>
                  <div className="flex items-center mb-3">
                    <button 
                      onClick={handleBack}
                      className="text-white/80 hover:text-white"
                    >
                      ← Back
                    </button>
                    <h3 className="ml-3 font-semibold">Fund Wallet</h3>
                  </div>
                  <div className="space-y-2">
                    {FUNDING_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{option.icon}</span>
                          <span className="text-sm">{option.label}</span>
                        </div>
                        <span className="text-sm text-white/80">
                          Fee: {option.fee}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl text-2xl">💼</div>
                    <div className="flex-1">
                      <div className="text-xs opacity-90">Wallet balance</div>
                      <div className="text-2xl font-bold mt-1">
                        {showBalance ? `${wallet.currency} ${wallet.balance.toLocaleString()}` : "••••••"}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowBalance((s) => !s)}
                        className="bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 text-sm"
                      >
                        {showBalance ? "Hide" : "Show"}
                      </button>
                      <button 
                        onClick={() => setShowManage(!showManage)}
                        className="bg-white text-blue-600 rounded-xl px-3 py-2 text-sm font-semibold"
                      >
                        {showManage ? "Hide" : "Manage"}
                      </button>
                    </div>
                  </div>

                  {showManage && (
                    <>
                      <hr className="my-3 border-white/20" />
                      <div className="grid grid-cols-2 gap-2">
                        {WALLET_ACTIONS.map((action) => (
                          <button
                            key={action.id}
                            onClick={() => handleActionClick(action.id)}
                            className="flex items-center gap-2 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            <span className="text-lg">{action.icon}</span>
                            <span className="text-sm">{action.label}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick action cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Buy Data (with providers & discounts) */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Buy Data</h2>
              <Link to="/services/data" className="text-sm text-blue-600 hover:underline">Buy now</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {networksData.map((n) => (
                <ProviderBadge 
                  key={n.id} 
                  icon={n.icon} 
                  name={n.name} 
                  discount={n.discount}
                  service="data"
                  id={n.id}
                />
              ))}
            </div>
          </div>

          {/* Airtime (with providers & discounts) */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Airtime Purchase</h2>
              <Link to="/services/airtime" className="text-sm text-blue-600 hover:underline">Buy now</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {networksAirtime.map((n) => (
                <ProviderBadge 
                  key={n.id} 
                  icon={n.icon} 
                  name={n.name} 
                  discount={n.discount}
                  service="airtime"
                  id={n.id}
                />
              ))}
            </div>
          </div>
        </div>

        {/* TV & Electricity provider logos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Cable TV Subscription</h2>
              <Link to="/services/tv" className="text-sm text-blue-600 hover:underline">Manage</Link>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {tvProviders.map((p) => (
                <Link
                  key={p.id}
                  to={`/purchase?service=tv&provider=${p.id}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl">{p.icon}</div>
                  <div className="text-sm font-medium">{p.name}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Electricity Bills Payment</h2>
              <Link to="/services/electricity" className="text-sm text-blue-600 hover:underline">Pay now</Link>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {electricityProviders.map((p) => (
                <Link
                  key={p.id}
                  to={`/purchase?service=electricity&provider=${p.id}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl">{p.icon}</div>
                  <div className="text-sm font-medium text-center">{p.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Recent Transactions</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">Showing (1 to {transactions.length}) of 49 Transactions</div>
          </div>

          <ul className="space-y-3">
            {transactions.map((tx) => (
              <Link key={tx.id} to={`/transactions/${tx.id}`} className="block">
                <TxItem tx={tx} />
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}