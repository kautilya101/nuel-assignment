import React, { useState } from "react";
import { StatusBadge } from "./StatusBadge";
import { ArrowUpDown, X } from "lucide-react";

export const ProductDrawer = ({ isOpen, onClose, product, onUpdateDemand, onTransferStock }) => {
	const [demandValue, setDemandValue] = useState(product?.demand || 0);
	const [transferValue, setTransferValue] = useState("");
	const [transferWarehouse, setTransferWarehouse] = useState("");

	React.useEffect(() => {
		if (product) {
			setDemandValue(product.demand);
			setTransferValue("");
			setTransferWarehouse("");
		}
	}, [product]);

	const handleDemandChange = (event) => {
		const inputValue = event.target.value;
		if (!isNaN(inputValue) || inputValue === "") {
			setDemandValue(inputValue);
		}
	};


	if (!isOpen || !product) return null;

	const status =
		product.stock > product.demand
			? "Healthy"
			: product.stock === product.demand
			? "Low"
			: "Critical";

	return (
		<div className="fixed inset-0 z-50 overflow-hidden">
			<div className="absolute inset-0 bg-white/50" onClick={onClose} />
			<div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
				<div className="flex flex-col h-full">
					<div className="flex items-center justify-between p-6 border-b">
						<h2 className="text-lg font-semibold text-gray-900">Product Details</h2>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600 transition-colors"
						>
							<X className="h-6 w-6" />
						</button>
					</div>

					<div className="flex-1 overflow-y-auto p-6 space-y-6">
						<div className="space-y-4">
							<div>
								<h3 className="text-lg font-medium text-gray-900">
									{product.name}
								</h3>
								<p className="text-sm text-gray-600">{product.id}</p>
							</div>

							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<span className="font-medium text-gray-600">SKU:</span>
									<p className="font-mono text-gray-900">{product.sku}</p>
								</div>
								<div>
									<span className="font-medium text-gray-600">Warehouse:</span>
									<p className="text-gray-900">{product.warehouse}</p>
								</div>
								<div>
									<span className="font-medium text-gray-600">
										Current Stock:
									</span>
									<p className="text-xl font-bold text-gray-900">
										{product.stock.toLocaleString()}
									</p>
								</div>
								<div>
									<span className="font-medium text-gray-600">
										Current Demand:
									</span>
									<p className="text-xl font-bold text-gray-900">
										{product.demand.toLocaleString()}
									</p>
								</div>
							</div>

							<div className="flex items-center space-x-2">
								<span className="font-medium text-gray-600">Status:</span>
								<StatusBadge status={status} />
							</div>
						</div>

						<div className="border rounded-lg p-4">
							<h4 className="font-medium text-gray-900 mb-3">Update Demand</h4>
							<div className="space-y-3">
								<input
									type="number"
									value={demandValue}
									onChange={handleDemandChange}
									className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Enter new demand"
								/>
								<button
									onClick={() => onUpdateDemand(product.id, demandValue)}
									className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
								>
									Update Demand
								</button>
							</div>
						</div>

						<div className="border rounded-lg p-4">
							<h4 className="font-medium text-gray-900 mb-3 flex items-center">
								<ArrowUpDown className="h-4 w-4 mr-2" />
								Transfer Stock
							</h4>
							<div className="space-y-3">
								<input
									type="number"
									value={transferValue}
									onChange={(e) => setTransferValue(e.target.value)}
									className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Quantity to transfer"
								/>
								<select
									value={transferWarehouse}
									onChange={(e) => setTransferWarehouse(e.target.value)}
									className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value="">Select destination warehouse</option>
									<option value="BLR-A">BLR-A</option>
									<option value="PNQ-C">PNQ-C</option>
									<option value="DEL-B">DEL-B</option>
								</select>
								<button
									onClick={() =>
										onTransferStock(
											product.id,
											transferValue,
											transferWarehouse
										)
									}
									disabled={!transferValue || !transferWarehouse}
									className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
								>
									Transfer Stock
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
