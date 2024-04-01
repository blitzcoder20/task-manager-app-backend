import { Pool, PoolClient, QueryArrayResult } from "pg";
import dotenv from "dotenv";

class DbManager {
    //Ensures to have a single reusable instance
  private static instance: DbManager;
  private pool: Pool;

  private client: PoolClient | null;

  constructor() {
    //setup env variables
    dotenv.config();
    //initializes a db connection pool
    this.pool = new Pool({
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT ?? "5432"),
      user: process.env.DB_USER,
    });

    this.client = null;
  }

  public static getInstance(): DbManager {
    if (!this.instance) {
      this.instance = new DbManager();
    }
    return this.instance;
  }

  async createConnection() {
    if (!this.pool) {
      throw new Error("Database pool is not initialized");
    }
    try {
      //connect to the database
      this.client = await this.pool.connect();
    } catch (error) {
      throw new Error("Could not connect to database");
    }
  }

  async query(query: string, params?: string[]): Promise<QueryArrayResult> {
    if (!this.client) {
      throw new Error("You must connect to the db first");
    }
    return await this.client.query(query, params);
  }

  closeConnection() {
    if (this.client) {
      this.client.release();
      this.client=null;
    }
  }
}

export default DbManager;
