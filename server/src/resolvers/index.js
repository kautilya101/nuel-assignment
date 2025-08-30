import { products, warehouses, kpis } from "../data/data.js";

const getStatus = (stock, demand) => {
  if (stock > demand) return "Healthy";
  if (stock === demand) return "Low";
  return "Critical";
};

const resolvers = {
  Query: {
    products: (_, { search, status, warehouse, page, pageSize }) => {
      let filtered = products.map(p => ({
        ...p,
        status: getStatus(p.stock, p.demand),
      }));

      console.log({ search, status, warehouse, page, pageSize })
      if (search && search != '') {
        const query = search.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.id.toLowerCase().includes(query)
        );
      }
      
      if (status && status !== "All") {
        filtered = filtered.filter(p => p.status === status);
      }

      if (warehouse && warehouse != 'All') {
        filtered = filtered.filter(p => p.warehouse === warehouse);
      }

      const start = (page - 1) * pageSize;
      return filtered.slice(start, start + pageSize);
    },

    warehouses: () => warehouses,
    kpis: (_, { range }) => {
      // Return full KPIs list; filtering can be added if needed
      return kpis;
    },
    dashboardStats: () => {
      const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
      const totalDemand = products.reduce((sum, p) => sum + p.demand, 0);
      const fillRate =
        totalDemand > 0
          ? (products.reduce((sum, p) => sum + Math.min(p.stock, p.demand), 0) /
              totalDemand) *
            100
          : 0;

      return {
        totalStock,
        totalDemand,
        fillRate: parseFloat(fillRate.toFixed(2)),
      };
    },
  },

  Mutation: {
    updateDemand: (_, { id, demand }) => {
      const product = products.find(p => p.id === id);
      if (!product) throw new Error("Product not found");
      product.demand = demand;
      return { ...product, status: getStatus(product.stock, product.demand) };
    },
    transferStock: (_, { id, from, to, qty }) => {
      const product = products.find(p => p.id === id);
      if (!product) throw new Error("Product not found");
      if (product.warehouse !== from)
        throw new Error("Invalid source warehouse");
      product.stock -= qty;
      product.warehouse = to;
      return { ...product, status: getStatus(product.stock, product.demand) };
    },
  },
};

export default resolvers;
