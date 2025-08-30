import { useState, useMemo, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { Package, TrendingUp, AlertCircle, Search, Filter } from "lucide-react";
import { DateRangeChips } from "../../components/DateRangeChips";
import { KPICard } from "../../components/KPICard";
import { Pagination } from "../../components/Pagination";
import { TrendChart } from "../../components/TrendChart";
import { ProductsTable } from "../../components/ProductsTable";
import { ProductDrawer } from "../../components/ProductDrawer";
import { DASHBOARD_STATS, GET_PRODUCTS } from "../../graphql/queries";
import ErrorData from "../../components/ErrorComponent";
import Loading from "../../components/Loading";
import { useDebounce } from "../../hooks/debounce";
import { TRANSFER_STOCK, UPDATE_DEMAND } from "../../graphql/mutations";
import { from } from "@apollo/client";

const SupplySightDashboard = () => {
	const [dateRange, setDateRange] = useState("7d");

	const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
	const [appliedWarehouseFilter, setAppliedWarehouseFilter] = useState("All");
	const [appliedStatusFilter, setAppliedStatusFilter] = useState("All");

	const [currentPage, setCurrentPage] = useState(1);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [drawerOpen, setDrawerOpen] = useState(false);

	const [rawProductsData, setRawProductsData] = useState([]);
	const [filteredProductsData, setFilteredProductsData] = useState([]);
	const debounceSearchValue = useDebounce(appliedSearchTerm, 700);
	const itemsPerPage = 10;

	const { data: statsData, loading: statsLoading, error: statsError } = useQuery(DASHBOARD_STATS);

	const [updateDemand, { data: updateData }] = useMutation(UPDATE_DEMAND);
	const [transferStock, { data: transferStockData }] = useMutation(TRANSFER_STOCK);

	const {
		data: productsResponse,
		loading: productsLoading,
		error: productsError,
	} = useQuery(GET_PRODUCTS, {
		variables: {
			search: "",
			status: "All",
			warehouse: "All",
			page: 1,
			pageSize: 1000,
		},
		errorPolicy: "all",
		fetchPolicy: "cache-and-network",
	});

	useEffect(() => {
		if (productsResponse?.products) {
			setRawProductsData(productsResponse.products);
		}
	}, [productsResponse]);

	useEffect(() => {
		applyFilters();
	}, [debounceSearchValue, appliedWarehouseFilter, appliedStatusFilter, rawProductsData]);

	const warehouses = useMemo(() => {
		if (!rawProductsData?.length) return [];
		return [...new Set(rawProductsData.map((p) => p?.warehouse).filter(Boolean))];
	}, [rawProductsData]);

	const getStatus = (stock, demand) => {
		if (!stock || !demand) return "Unknown";
		if (stock > demand) return "Healthy";
		if (stock === demand) return "Low";
		return "Critical";
	};

	const applyFilters = () => {
		if (!rawProductsData?.length) {
			setFilteredProductsData([]);
			return;
		}

		const filtered = rawProductsData.filter((product) => {
			if (!product) return false;

			const matchesSearch =
				!debounceSearchValue ||
				product.name?.toLowerCase().includes(debounceSearchValue.toLowerCase()) ||
				product.sku?.toLowerCase().includes(debounceSearchValue.toLowerCase()) ||
				product.id?.toLowerCase().includes(debounceSearchValue.toLowerCase());

			const matchesWarehouse =
				appliedWarehouseFilter === "All" || product.warehouse === appliedWarehouseFilter;

			const status = getStatus(product.stock, product.demand);
			const matchesStatus = appliedStatusFilter === "All" || status === appliedStatusFilter;

			return matchesSearch && matchesWarehouse && matchesStatus;
		});

		setFilteredProductsData(filtered);
		setCurrentPage(1);
	};

	const handleClearFilters = () => {
		setAppliedSearchTerm("");
		setAppliedWarehouseFilter("All");
		setAppliedStatusFilter("All");
	};

	const totalPages = Math.max(1, Math.ceil(filteredProductsData.length / itemsPerPage));
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedProducts = filteredProductsData.slice(startIndex, startIndex + itemsPerPage);

	const kpis = useMemo(() => {
		const dashboardStats = statsData?.dashboardStats || {};
		return {
			totalStock: dashboardStats.totalStock ?? 0,
			totalDemand: dashboardStats.totalDemand ?? 0,
			fillRate: dashboardStats.fillRate ?? 0,
		};
	}, [statsData]);

	const chartData = useMemo(() => {
		const days = dateRange === "7d" ? 7 : dateRange === "14d" ? 14 : 30;
		return Array.from({ length: days }, (_, i) => ({
			day: `Day ${i + 1}`,
			stock: Math.floor(Math.random() * 200 + 400),
			demand: Math.floor(Math.random() * 150 + 300),
		}));
	}, [dateRange]);

	const handleRowClick = (product) => {
		setSelectedProduct(product);
		setDrawerOpen(true);
	};

	const handleUpdateDemand = useCallback(async (productId, newDemand) => {
		try {
			console.log(`Updating demand for ${productId} to ${newDemand}`);
			updateDemand({
				variables: {
					id: productId,
					demand: Number(newDemand),
				},
			});

			console.log("Demand updated:");
			alert("Demand updated successfully!");
			setDrawerOpen(false);
		} catch (error) {
      console.log(error)
			console.error("Error updating demand:", error);
			alert("Failed to update demand. Please try again.");
		}
	},[updateDemand])

	const handleTransferStock = async (productId, quantity, warehouse) => {
		try {
			console.log(`Transferring ${quantity} units of ${productId} from ${selectedProduct.warehouse} to ${warehouse}`);
			transferStock({
				variables: {
					id: productId,
					from: selectedProduct.warehouse,
					to: warehouse,
					qty: Number(quantity),
				},
			});

			console.log("Stock transferred:");
			alert("Stock transfer initiated successfully!");
			setDrawerOpen(false);
		} catch (error) {
			console.error("Error transferring stock:", error);
			alert("Failed to transfer stock. Please try again.");
		}
	};

	// Combined loading state
	if (statsLoading || productsLoading) {
		return <Loading />;
	}

	// Better error handling
	if (statsError || productsError) {
		return <ErrorData errorData={statsError || productsError} />;
	}

	return (
		<div className="min-h-screen max-w-7xl mx-auto bg-white">
			<header className="bg-white border-b">
				<div className="px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<Package className="h-8 w-8 text-blue-600" />
							<h1 className="text-2xl font-bold text-gray-900">SupplySight</h1>
						</div>
						<DateRangeChips dateRange={dateRange} setDateRange={setDateRange} />
					</div>
				</div>
			</header>

			<main className="px-6 py-6 space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<KPICard
						title="Total Stock"
						value={kpis.totalStock?.toLocaleString() || "0"}
						icon={Package}
						color="blue"
					/>
					<KPICard
						title="Total Demand"
						value={kpis.totalDemand?.toLocaleString() || "0"}
						icon={TrendingUp}
						color="green"
					/>
					<KPICard
						title="Fill Rate"
						value={`${kpis.fillRate || 0}%`}
						icon={AlertCircle}
						color="orange"
					/>
				</div>

				<TrendChart data={chartData} dateRange={dateRange} />

				<div className="bg-white p-4 rounded-lg border shadow-sm">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div className="relative">
							<input
								type="text"
								placeholder="Search by name, SKU, or ID..."
								value={appliedSearchTerm}
								onChange={(e) => setAppliedSearchTerm(e.target.value)}
								className="w-full py-3 p-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>

						<select
							name="warehouse-filter"
							value={appliedWarehouseFilter}
							onChange={(e) => setAppliedWarehouseFilter(e.target.value)}
							className="p-2 text-black border border-gray-300 rounded-lg "
						>
							<option value="All">All Warehouses</option>
							{warehouses.map((warehouse) => (
								<option key={warehouse} value={warehouse}>
									{warehouse}
								</option>
							))}
						</select>

						<select
							name="status-filter"
							value={appliedStatusFilter}
							onChange={(e) => setAppliedStatusFilter(e.target.value)}
							className="px-2 text-black border border-gray-300 rounded-lg"
						>
							<option value="All">All Status</option>
							<option value="Healthy">Healthy</option>
							<option value="Low">Low</option>
							<option value="Critical">Critical</option>
						</select>

						<div className="flex gap-2">
							<button
								onClick={handleClearFilters}
								className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
							>
								Clear
							</button>
						</div>
					</div>

					{(appliedSearchTerm ||
						appliedWarehouseFilter !== "All" ||
						appliedStatusFilter !== "All") && (
						<div className="mt-3 flex flex-wrap gap-2">
							{appliedSearchTerm && (
								<span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
									Search: "{appliedSearchTerm}"
								</span>
							)}
							{appliedWarehouseFilter !== "All" && (
								<span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
									Warehouse: {appliedWarehouseFilter}
								</span>
							)}
							{appliedStatusFilter !== "All" && (
								<span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-md text-sm">
									Status: {appliedStatusFilter}
								</span>
							)}
						</div>
					)}
				</div>

				<div className="text-sm text-gray-600">
					Showing {paginatedProducts.length} of {filteredProductsData.length} products
				</div>

				<ProductsTable products={paginatedProducts} onRowClick={handleRowClick} />

				{totalPages > 1 && (
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
					/>
				)}
			</main>

			<ProductDrawer
				isOpen={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				product={selectedProduct}
				onUpdateDemand={handleUpdateDemand}
				onTransferStock={handleTransferStock}
			/>
		</div>
	);
};

export default SupplySightDashboard;
