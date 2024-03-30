import { Pool, PoolClient, QueryArrayResult } from 'pg';
import dotenv from 'dotenv';

class dbManager {

    private pool: Pool;

    private client: PoolClient | undefined

    constructor(){

        //setup env variables
        dotenv.config();

        //initializes a db connection pool
        this.pool  = new Pool({
            database: process.env.DB_DATABASE,
            host: process.env.DB_HOST,
            password: process.env.DB_PASSWORD,
            port: parseInt(process.env.DB_PORT ?? "5432"),
            user: process.env.DB_USER,
        });

        this.client = undefined;
    }

    async createConnection() {
        if (!this.pool) {
            throw new Error('Database pool is not initialized');
        } 
        //connect to the database
        this.client = await this.pool.connect();
    }

    async query(query:string,params?:string[]):Promise<QueryArrayResult>{
        if(!this.client){
            throw new Error('You must connect to the db first')
        }
        return await this.client.query(query,params);
    }
    
    closeConnection(){
        if(this.pool){
            this.pool.end();
        }
    }
}

export default dbManager;