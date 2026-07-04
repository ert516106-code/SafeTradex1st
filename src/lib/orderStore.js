import { useState, useEffect } from 'react';

// In-memory store for active orders shared across the app.
// Lives outside any component so it survives modal close / navigation.
let activeOrders = [];
let listeners = [];

export function addActiveOrder(order) {
  activeOrders = [order, ...activeOrders];
  listeners.forEach(fn => fn([...activeOrders]));
}

export function removeActiveOrder(id) {
  activeOrders = activeOrders.filter(o => o.id !== id);
  listeners.forEach(fn => fn([...activeOrders]));
}

export function updateActiveOrder(id, updates) {
  activeOrders = activeOrders.map(o => o.id === id ? { ...o, ...updates } : o);
  listeners.forEach(fn => fn([...activeOrders]));
}

export function useActiveOrders() {
  const [orders, setOrders] = useState([...activeOrders]);
  useEffect(() => {
    listeners.push(setOrders);
    return () => { listeners = listeners.filter(fn => fn !== setOrders); };
  }, []);
  return orders;
}
