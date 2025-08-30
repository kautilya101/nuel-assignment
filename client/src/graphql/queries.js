import { gql } from '@apollo/client';

export const DASHBOARD_STATS = gql`
  query {
    dashboardStats {
      totalStock
      totalDemand
      fillRate
    }
  }
`;

export const GET_PRODUCTS = gql`
  query Products($search: String, $status: String, $warehouse: String, $page: Int, $pageSize: Int) {
    products(search: $search, status: $status, warehouse: $warehouse, page: $page, pageSize: $pageSize) {
      id
      name
      sku
      warehouse
      stock
      demand
      status
    }
  }
`;

export const GET_KPIS = gql`
  query GetKpis($range: String!) {
    kpis(range: $range) {
      date
      stock
      demand
    }
  }
`;

export const GET_WAREHOUSES = gql`
  query {
    warehouses {
      code
      name
      city
      country
    }
  }
`;
