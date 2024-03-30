import express,{Request,Response} from "express"
import { Pool } from 'pg';
import dbManager from "./dbManager";

const app = express();

app.get('/',async (req:Request,res:Response)=>{
    const db = new dbManager();
    db.createConnection().then(()=>{
        db.query("Select * from users").then(result => console.log(result.rows));
    })

});

app.listen(3000, () => {
    console.log('Server listening at port 3000');
})