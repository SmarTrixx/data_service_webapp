import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Add these constants for the options
const WALLET_ACTIONS = [
	{ id: "fund", label: "Fund Wallet", icon: "💳" },
	{ id: "transfer", label: "Transfer", icon: "↗️" },
	{ id: "withdraw", label: "Withdraw", icon: "💰" },
	{ id: "history", label: "History", icon: "📊" },
];

const FUNDING_OPTIONS = [
	{ id: "card", label: "Card Payment", fee: "1.5%" },
	{ id: "bank", label: "Bank Transfer", fee: "₦50" },
	{ id: "ussd", label: "USSD", fee: "₦20" },
];

const services = [
	{
		id: "data",
		title: "Data Bundles",
		desc: "Buy daily, weekly or monthly data bundles from all major networks.",
		priceExample: "from ₦100",
		icon: "📶",
		href: "/services/data",
	},
	{
		id: "airtime",
		title: "Airtime Top-up",
		desc: "Instant airtime for yourself or loved ones — quick and secure.",
		priceExample: "from ₦50",
		icon: "☎️",
		href: "/services/airtime",
	},
	{
		id: "tv",
		title: "TV Subscriptions",
		desc: "Renew DSTV, GOtv and more with flexible packages.",
		priceExample: "packages from ₦500",
		icon: "📺",
		href: "/services/tv",
	},
	{
		id: "electricity",
		title: "Electricity Bills",
		desc: "Pay prepaid electricity meters fast and reliably.",
		priceExample: "meter tokens from ₦200",
		icon: "⚡",
		href: "/services/electricity",
	},
];

export default function Home() {
	const [wallet, setWallet] = useState({ balance: 1250.5, currency: "NGN" });
	const [showManage, setShowManage] = useState(false);
	const [showFunding, setShowFunding] = useState(false);

	// simulate fetching wallet (dummy)
	useEffect(() => {
		const timer = setTimeout(() => {
			// placeholder for API call
			setWallet((w) => ({ ...w }));
		}, 200);
		return () => clearTimeout(timer);
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

	const renderWalletContent = () => {
		if (showFunding) {
			return (
				<div className="space-y-4">
					<div className="flex items-center">
						<button
							onClick={handleBack}
							className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
						>
							← Back
						</button>
						<h3 className="text-lg font-semibold ml-3">Fund Wallet</h3>
					</div>

					<div className="space-y-2">
						{FUNDING_OPTIONS.map((option) => (
							<button
								key={option.id}
								className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
							>
								<div className="flex items-center gap-3">
									<span className="text-lg">{option.label}</span>
								</div>
								<span className="text-sm text-gray-500 dark:text-gray-400">
									Fee: {option.fee}
								</span>
							</button>
						))}
					</div>
				</div>
			);
		}

		return (
			<>
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-sm text-gray-500 dark:text-gray-300">
							Wallet Balance
						</h3>
						<p className="mt-1 text-xl font-bold">
							{wallet.currency} {wallet.balance.toLocaleString()}
						</p>
					</div>
					<div className="text-3xl">💼</div>
				</div>

				<p className="text-sm text-gray-600 dark:text-gray-400">
					Use your wallet to pay faster. Fund via card or bank transfer.
				</p>

				<div className="mt-2 flex gap-2">
					<button
						onClick={() => setShowFunding(true)}
						className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-4 py-2 shadow-md"
					>
						Fund Wallet
					</button>
					<button
						onClick={() => setShowManage(!showManage)}
						className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm hover:shadow"
					>
						{showManage ? "Hide Options" : "Manage"}
					</button>
				</div>

				{showManage && (
					<>
						<hr className="my-4 border-gray-200 dark:border-gray-700" />
						<div className="grid grid-cols-2 gap-2">
							{WALLET_ACTIONS.map((action) => (
								<button
									key={action.id}
									onClick={() => handleActionClick(action.id)}
									className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
								>
									<span className="text-xl">{action.icon}</span>
									<span className="text-sm">{action.label}</span>
								</button>
							))}
						</div>
					</>
				)}
			</>
		);
	};

	return (
		<div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
			<div className="max-w-6xl mx-auto px-6 py-10">
				{/* Hero */}
				<section className="flex flex-col-reverse md:flex-row items-center gap-8">
					<div className="flex-1">
						<h1 className="text-2xl md:text-3xl font-bold leading-tight">
							SmartDev — simple, secure payments for data, airtime, TV & power
						</h1>
						<p className="mt-4 text-gray-600 dark:text-gray-300 max-w-xl">
							Buy data bundles, top-up airtime, renew TV subscriptions and pay
							electricity bills — all in one place. Fast transactions, minimal
							fees, and a modern interface for both light and dark modes.
						</p>

						<div className="mt-6 flex flex-wrap gap-3">
							<Link
								to="/register"
								className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-5 py-3 shadow-md transition"
							>
								Get Started
							</Link>

							<Link
								to="/login"
								className="inline-block border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl px-5 py-3 hover:shadow transition"
							>
								Sign In
							</Link>
						</div>
					</div>

					{/* Updated Wallet Card */}
					<div className="w-full md:w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col gap-4">
						{renderWalletContent()}
					</div>
				</section>

				{/* Services */}
				<section className="mt-12 py-12">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl md:text-2xl font-bold">Services</h2>
						<p className="text-sm text-gray-600 dark:text-gray-300">
							Quick actions for frequent transactions
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
						{services.map((s) => (
							<Link
								key={s.id}
								to={s.href}
								className="block bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-lg transition"
							>
								<div className="flex items-start justify-between">
									<div>
										<div className="text-3xl">{s.icon}</div>
										<h3 className="mt-4 text-lg font-semibold">
											{s.title}
										</h3>
										<p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
											{s.desc}
										</p>
									</div>

									<div className="ml-4 text-right">
										<span className="text-sm text-gray-500 dark:text-gray-400">
											{s.priceExample}
										</span>
										<div className="mt-4">
											<button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-3 py-2 text-sm font-semibold">
												Buy
											</button>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>

					<div className="mt-8 text-center">
						<Link
							to="/services"
							className="inline-block bg-transparent border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-xl px-5 py-3 hover:shadow transition"
						>
							View all services
						</Link>
					</div>
				</section>
			</div>
		</div>
	);
}
