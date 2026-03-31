import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database | null = null;

export async function openDb() {
  if (!db) {
    db = await open({
      // Adjust this path if your db is somewhere else.
      // process.cwd() is the root of your Next.js project.
      filename: path.join(process.cwd(), 'src', 'data', 'parkshare.db'),
      driver: sqlite3.Database
    });
  }
  return db;
}