import React, { useState } from "react";


const TRANSACTIONS = [
	{
		id: "tx1",
		status: "SUCCESSFUL",
		type: "DATA PURCHASE",
		description: "GLO 1GB (30days) - Gifting",
		recipient: "08150411479",
		amount: 450,
		paymentMethod: "WALLET",
		balanceBefore: 938.68,
		balanceAfter: 488.68,
		date: "2025-10-23T20:05:00",
		icon: "📶",
	},
	{
		id: "tx2",
		status: "SUCCESSFUL",
		type: "DATA PURCHASE",
		description: "GLO 1GB (30days) - Gifting",
		recipient: "08150411479",
		amount: 450,
		paymentMethod: "WALLET",
		balanceBefore: 1388.68,
		balanceAfter: 938.68,
		date: "2025-10-22T14:05:00",
		icon: "📶",
	},
	{
		id: "tx3",
		status: "SUCCESSFUL",
		type: "WALLET FUNDING",
		description: "ATM wallet funding",
		amount: 1381.94,
		paymentMethod: "ATM",
		balanceBefore: 6.74,
		balanceAfter: 1388.68,
		date: "2025-10-22T14:03:00",
		icon: "💳",
	},
];

function TransactionCard({ tx, onClick }) {
	const formatDate = (dateStr) => {
		const date = new Date(dateStr);
		return new Intl.DateTimeFormat("en-NG", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		}).format(date);
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
			minimumFractionDigits: 2,
		})
			.format(amount)
			.replace("NGN", "₦");
	};

	return (
		<button
			onClick={() => onClick(tx)}
			className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-200"
		>
			<div className="flex items-start gap-4">
				<div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-xl">
					{tx.icon}
				</div>

				<div className="flex-1">
					<div className="flex items-start justify-between gap-4">
						<div>
							<div className="flex items-center gap-2">
								<span
									className={`text-xs font-medium px-2 py-1 rounded-full ${
										tx.status === "SUCCESSFUL"
											? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
											: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
									}`}
								>
									{tx.status}
								</span>
								<span className="text-sm font-medium text-gray-600 dark:text-gray-300">
									{tx.type}
								</span>
							</div>

							<h3 className="text-base font-semibold mt-1">
								{tx.description}
							</h3>

							{/* show tx id */}
							{/* <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
								ID: {tx.id}
							</div> */}

							{tx.recipient && (
								<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
									{tx.recipient}
								</p>
							)}
						</div>

						<div className="text-right">
							<div className="text-sm font-semibold">
								{formatCurrency(tx.amount)} / {tx.paymentMethod}
							</div>
							<div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
								{formatCurrency(tx.balanceBefore)}/
								{formatCurrency(tx.balanceAfter)}
							</div>
							<div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
								{formatDate(tx.date)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</button>
	);
}

export default function Transactions() {
	const [dateRange, setDateRange] = useState({ from: "", to: "" });
	const [search, setSearch] = useState("");
	const [showFilters, setShowFilters] = useState(false);
	const [selectedTx, setSelectedTx] = useState(null);

	const handleTxClick = (tx) => {
		setSelectedTx(tx);
		// You can also navigate to a detail page:
		// navigate(`/transactions/${tx.id}`);
	};

	// helper formatters for modal
	const modalFormatDate = (dateStr) => {
		const date = new Date(dateStr);
		return new Intl.DateTimeFormat("en-NG", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		}).format(date);
	};
	const modalFormatCurrency = (amount) =>
		new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
			minimumFractionDigits: 2,
		})
			.format(amount)
			.replace("NGN", "₦");

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="max-w-5xl mx-auto px-4 py-8">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold text-gray-800 dark:text-white">
						Transactions
					</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Showing (1 to {TRANSACTIONS.length}) of 49 Transactions
					</p>
				</div>

				{/* Filters */}
				<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
						<div className="flex-1">
							<input
								type="text"
								placeholder="Search transactions..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 outline-none transition-shadow duration-200"
							/>
						</div>
						<button
							onClick={() => setShowFilters(!showFilters)}
							className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200"
						>
							<span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
							<span>{showFilters ? "↑" : "↓"}</span>
						</button>
					</div>

					{showFilters && (
						<div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="text-sm font-medium mb-1 block">
										From Date
									</label>
									<input
										type="date"
										value={dateRange.from}
										onChange={(e) =>
											setDateRange((r) => ({
												...r,
												from: e.target.value,
											}))
										}
										className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
									/>
								</div>
								<div>
									<label className="text-sm font-medium mb-1 block">
										To Date
									</label>
									<input
										type="date"
										value={dateRange.to}
										onChange={(e) =>
											setDateRange((r) => ({
												...r,
												to: e.target.value,
											}))
										}
										className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent"
									/>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Transactions List */}
				<div className="space-y-4">
					{TRANSACTIONS.map((tx) => (
						<TransactionCard key={tx.id} tx={tx} onClick={handleTxClick} />
					))}
				</div>

				{/* Transaction Detail Modal - Add your modal component here */}
				{selectedTx && (
					<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-lg">
							<div className="flex items-start justify-between gap-4">
								<div className="flex items-center gap-4">
									<div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-2xl">
										{selectedTx.icon}
									</div>
									<div>
										<div className="text-xs text-gray-500 dark:text-gray-300">
											{selectedTx.status}
										</div>
										<div className="text-lg font-semibold">
											{selectedTx.type}
										</div>
										<div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
											{selectedTx.description}
										</div>
										<div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
											Transaction ID:{" "}
											<span className="font-mono text-xs">
												{selectedTx.id}
											</span>
										</div>
									</div>
								</div>

								<button
									onClick={() => setSelectedTx(null)}
									className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
								>
									✕
								</button>
							</div>

							<div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
								<div>
									<div className="text-xs text-gray-500">
										Recipient
									</div>
									<div className="font-medium">
										{selectedTx.recipient || "-"}
									</div>
								</div>
								<div>
									<div className="text-xs text-gray-500">
										Amount
									</div>
									<div className="font-medium">
										{modalFormatCurrency(selectedTx.amount)}
									</div>
								</div>
								<div>
									<div className="text-xs text-gray-500">
										Payment Method
									</div>
									<div className="font-medium">
										{selectedTx.paymentMethod}
									</div>
								</div>
								<div>
									<div className="text-xs text-gray-500">Date</div>
									<div className="font-medium">
										{modalFormatDate(selectedTx.date)}
									</div>
								</div>
								<div>
									<div className="text-xs text-gray-500">
										Balance Before
									</div>
									<div className="font-medium">
										{modalFormatCurrency(
											selectedTx.balanceBefore ?? 0
										)}
									</div>
								</div>
								<div>
									<div className="text-xs text-gray-500">
										Balance After
									</div>
									<div className="font-medium">
										{modalFormatCurrency(
											selectedTx.balanceAfter ?? 0
										)}
									</div>
								</div>
							</div>

							<div className="mt-6 text-right">

								<button
									onClick={() => setSelectedTx(null)}
									className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
								>
									Close
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}