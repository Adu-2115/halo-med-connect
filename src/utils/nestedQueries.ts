
/**
 * Utility functions for performing nested queries on frontend data
 * These functions mimic SQL-like nested queries but operate on JavaScript arrays
 */

// Helper to filter data based on a condition
export const where = <T>(data: T[], condition: (item: T) => boolean): T[] => {
  return data.filter(condition);
};

// Helper to select specific fields from data (like SQL SELECT)
export const select = <T, K extends keyof T>(
  data: T[],
  fields: K[]
): Pick<T, K>[] => {
  return data.map((item) => {
    const result = {} as Pick<T, K>;
    fields.forEach((field) => {
      result[field] = item[field];
    });
    return result;
  });
};

// Helper to join two arrays (like SQL JOIN)
export const join = <T, U, K extends keyof T, J extends keyof U>(
  leftData: T[],
  rightData: U[],
  leftKey: K,
  rightKey: J,
  select: (left: T, right: U | undefined) => any
): any[] => {
  return leftData.map((leftItem) => {
    const rightItem = rightData.find(
      (rightItem) => rightItem[rightKey] === leftItem[leftKey]
    );
    return select(leftItem, rightItem);
  });
};

// Helper to group data (like SQL GROUP BY)
export const groupBy = <T, K extends keyof T>(
  data: T[],
  key: K,
  aggregator: (group: T[]) => any
): any[] => {
  const groups = data.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);

  return Object.entries(groups).map(([key, group]) => ({
    key,
    ...aggregator(group),
  }));
};

// Helper to aggregate values (like SQL aggregate functions)
export const aggregate = <T>(
  data: T[],
  aggregations: Record<string, (items: T[]) => any>
): Record<string, any> => {
  const result: Record<string, any> = {};
  Object.entries(aggregations).forEach(([key, fn]) => {
    result[key] = fn(data);
  });
  return result;
};

// Helper for subqueries (nested queries)
export const subquery = <T, R>(
  data: T[],
  queryFn: (data: T[]) => R
): R => {
  return queryFn(data);
};

// Helper for having clause (like SQL HAVING)
export const having = <T>(
  groups: T[],
  condition: (group: T) => boolean
): T[] => {
  return groups.filter(condition);
};

// Helper for ordering data (like SQL ORDER BY)
export const orderBy = <T, K extends keyof T>(
  data: T[],
  key: K,
  direction: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...data].sort((a, b) => {
    if (direction === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    } else {
      return a[key] < b[key] ? 1 : -1;
    }
  });
};
