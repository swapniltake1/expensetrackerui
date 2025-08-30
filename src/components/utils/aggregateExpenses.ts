// utils/aggregateExpenses.ts
export function aggregateByCategory(expenses: any[]) {
  const map = new Map<string, number>();

  expenses.forEach((e) => {
    const category = e.category || "Unknown";
    const amount = Number(e.amount) || 0;

    map.set(category, (map.get(category) || 0) + amount);
  });

  return Array.from(map, ([category, amount]) => ({ category, amount }));
}
