import express,{Request,Response} from "express"
import { selectAllUsers } from "./service/userService";


const app = express();

app.get('/api/users',(req:Request,res:Response)=>{
    console.log("test");
    selectAllUsers().then((rows)=>{
        res.json(rows);
    })
});

app.listen(3000, () => {
    console.log('Server listening at port 3000');
})