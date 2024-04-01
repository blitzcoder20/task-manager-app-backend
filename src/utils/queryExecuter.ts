import { QueryArrayResult } from "pg";
import DbManager from "../dbManager";

//this function handles query executions
const executeQuery= async (query: string, params?: string[]): Promise<QueryArrayResult<any[]> | null> => {
    const db = DbManager.getInstance();
    try {
      await db.createConnection();
      if(!params){
        params = [];
      }
      return await db.query(query,params);
    } catch (error) {
      console.error("Error executing query:", error);
      throw Error(error as string);
    } finally {
        if(db){
            db.closeConnection();
        }
    }
}

export default executeQuery;