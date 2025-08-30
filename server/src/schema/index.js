import { gql } from "apollo-server";

const typeDefs = gql`
  type Warehouse {
    code: ID!
    name: String!
    city: String!
    country: String!
  }

  type Product {
    id: ID!
    name: String!
    sku: String!
    warehouse: String!
    stock: Int!
    demand: Int!
    status: String! # Derived field: Healthy, Low, Critical
  }

  type KPI {
    date: String!
    stock: Int!
    demand: Int!
  }

  type DashboardStats {
    totalStock: Int!
    totalDemand: Int!
    fillRate: Float!
  }

  type Query {
    products(search: String, status: String, warehouse: String, page: Int = 1, pageSize: Int = 10): [Product!]!
    warehouses: [Warehouse!]!
    kpis(range: String!): [KPI!]!
    dashboardStats: DashboardStats!
  }

  type Mutation {
    updateDemand(id: ID!, demand: Int!): Product!
    transferStock(id: ID!, from: String!, to: String!, qty: Int!): Product!
  }
`;

export default typeDefs;
