
import { useState, useCallback } from 'react';
import * as query from '@/utils/nestedQueries';

// Generic hook for performing nested queries
export function useNestedQuery<T>(initialData: T[]) {
  const [data, setData] = useState<T[]>(initialData);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Execute a nested query and track it in history
  const executeQuery = useCallback(
    (queryName: string, queryFn: (data: T[]) => T[]) => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Add artificial delay to simulate database operation
        setTimeout(() => {
          const result = queryFn(data);
          setData(result);
          setQueryHistory((prev) => [...prev, queryName]);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown query error');
        setIsLoading(false);
      }
    },
    [data]
  );

  // Reset to initial data
  const resetData = useCallback((newInitialData: T[]) => {
    setData(newInitialData);
    setQueryHistory([]);
    setError(null);
  }, []);

  return {
    data,
    queryHistory,
    isLoading,
    error,
    executeQuery,
    resetData,
  };
}

// Predefined query for filtering inventory by stock level
export function useInventoryStockQuery(inventory: any[]) {
  const { data, executeQuery, isLoading, error } = useNestedQuery(inventory);

  const findLowStock = useCallback(() => {
    executeQuery('Find Low Stock Items', (items) => {
      // Nested query 1: Find items with low stock (less than 10 units)
      return query.subquery(items, (data) => {
        // Inner query: Filter by stock quantity
        return query.where(data, (item) => (item.stock_quantity || 0) < 10);
      });
    });
  }, [executeQuery]);

  const findExpiringItems = useCallback(() => {
    executeQuery('Find Expiring Items', (items) => {
      // Nested query 2: Find items expiring in the next 30 days
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      return query.subquery(items, (data) => {
        // Inner query 1: Filter by expiry date
        const expiringItems = query.where(data, (item) => {
          if (!item.expiry_date) return false;
          const expiryDate = new Date(item.expiry_date);
          return expiryDate <= thirtyDaysFromNow;
        });
        
        // Inner query 2: Sort by expiry date
        return query.orderBy(expiringItems, 'expiry_date', 'asc');
      });
    });
  }, [executeQuery]);

  return {
    data,
    isLoading,
    error,
    findLowStock,
    findExpiringItems,
  };
}

// Predefined query for analyzing sales data 
export function useSalesAnalyticsQuery(sales: any[]) {
  const { data, executeQuery, isLoading, error } = useNestedQuery(sales);

  const findTopSellingItems = useCallback(() => {
    executeQuery('Find Top Selling Items', (salesData) => {
      // Nested query 3: Get top selling items by revenue
      return query.subquery(salesData, (data) => {
        // Inner query 1: Group by product
        const groupedByProduct = query.groupBy(data, 'product_id', (group) => ({
          product_id: group[0].product_id,
          product_name: group[0].product_name,
          total_quantity: group.reduce((sum, item) => sum + item.quantity, 0),
          total_revenue: group.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        }));
        
        // Inner query 2: Sort by total revenue
        return query.orderBy(groupedByProduct, 'total_revenue', 'desc').slice(0, 5);
      });
    });
  }, [executeQuery]);

  const analyzeMonthlySales = useCallback(() => {
    executeQuery('Monthly Sales Analysis', (salesData) => {
      // Nested query 4: Analyze sales by month
      return query.subquery(salesData, (data) => {
        // Inner query 1: Add month property
        const withMonth = data.map(item => ({
          ...item,
          month: new Date(item.sale_date).getMonth() + 1
        }));
        
        // Inner query 2: Group by month
        return query.groupBy(withMonth, 'month', (group) => ({
          month: group[0].month,
          total_sales: group.length,
          total_revenue: group.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          average_order_value: group.reduce((sum, item) => sum + (item.price * item.quantity), 0) / group.length
        }));
      });
    });
  }, [executeQuery]);

  return {
    data,
    isLoading,
    error,
    findTopSellingItems,
    analyzeMonthlySales,
  };
}

// Predefined query for customer segmentation
export function useCustomerSegmentationQuery(customers: any[]) {
  const { data, executeQuery, isLoading, error } = useNestedQuery(customers);

  const segmentByPurchaseValue = useCallback(() => {
    executeQuery('Segment by Purchase Value', (customersData) => {
      // Nested query 5: Segment customers by lifetime value
      return query.subquery(customersData, (data) => {
        // Inner query 1: Calculate lifetime value
        const withLTV = data.map(customer => ({
          ...customer,
          lifetimeValue: (customer.purchases || []).reduce(
            (sum: number, purchase: any) => sum + purchase.amount, 
            0
          )
        }));
        
        // Inner query 2: Segment customers
        return query.select(withLTV, ['id', 'name', 'lifetimeValue']).map(customer => ({
          ...customer,
          segment: customer.lifetimeValue > 10000 
            ? 'VIP' 
            : customer.lifetimeValue > 5000 
              ? 'Regular' 
              : 'Occasional'
        }));
      });
    });
  }, [executeQuery]);

  return {
    data,
    isLoading,
    error,
    segmentByPurchaseValue,
  };
}
