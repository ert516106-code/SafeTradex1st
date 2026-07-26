import { useSyncExternalStore } from 'react';

let activeOrders = [];
let transactions = [];

const activeListeners = new Set();
const transactionListeners = new Set();

function emitActive() {
  activeListeners.forEach((listener) => listener());
}

function emitTransactions() {
  transactionListeners.forEach((listener) => listener());
}

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function addActiveOrder(order) {
  const record = { id: order.id ?? generateId(), startTime: order.startTime ?? Date.now(), ...order };
  activeOrders = [...activeOrders, record];
  emitActive();
  return record.id;
}

export function removeActiveOrder(id) {
  activeOrders = activeOrders.filter((order) => order.id !== id);
  emitActive();
}

export function updateActiveOrder(id, updates) {
  activeOrders = activeOrders.map((order) => (order.id === id ? { ...order, ...updates } : order));
  emitActive();
}

export function addTransaction(tx) {
  const record = { id: tx.id ?? generateId(), created_date: tx.created_date ?? new Date().toISOString(), ...tx };
  transactions = [record, ...transactions].slice(0, 50);
  emitTransactions();
  return record.id;
}

function subscribeActive(listener) {
  activeListeners.add(listener);
  return () => activeListeners.delete(listener);
}

function subscribeTransactions(listener) {
  transactionListeners.add(listener);
  return () => transactionListeners.delete(listener);
}

function getActiveSnapshot() {
  return activeOrders;
}

function getTransactionsSnapshot() {
  return transactions;
}

export function useActiveOrders() {
  return useSyncExternalStore(subscribeActive, getActiveSnapshot, getActiveSnapshot);
}

export function useTransactions() {
  return useSyncExternalStore(subscribeTransactions, getTransactionsSnapshot, getTransactionsSnapshot);
}
