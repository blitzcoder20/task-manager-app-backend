import express,{Request,Response} from "express"
import userRouter  from "./routes/userRoutes";
import taskRouter from "./routes/taskRoutes"


const app = express();
app.use(express.json()) // for parsing application/json
app.use('/api/users',userRouter) // manages users routes
app.use('/api/tasks',taskRouter) // manages tasks routes

//Start application and listen for new requests
app.listen(3000, () => {
    console.log('Server listening at port 3000');
})