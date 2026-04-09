/**
 * Database access contract (implementations can be swapped).
 *
 * @typedef {object} IDb
 * @property {(text: string, params?: unknown[]) => Promise<import('pg').QueryResult>} query Execute parameterized SQL.
 */

export {};
