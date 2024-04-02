import express from "express";
import { createUser, logIn, selectAllUsers } from "../service/userService";
import { LogIn, User } from "../types";

const router = express.Router();

router.get("/", (req, res) => {
  selectAllUsers().then((rows) => {
    return res.json(rows);
  });
});

router.put("/create", (req, res) => {
  const newUser: User = req.body;
  createUser(newUser)
    .then((response) => {
      if (response) {
        return res.status(200).send();
      }
      return res.status(400).send();
    })
    .catch((ex) => {
      return res.status(400).json({ message: ex.message });
    });
});


router.post("/authenticate",(req,res)=>{
  const user : LogIn = req.body;
  logIn(user.email,user.password).then(ok=>{
    if(ok === true){
      return res.status(200).send();
    }
    return res.status(401).send();
  }).catch((ex) => {
    return res.status(400).json({ message: ex.message });
  });
})
export default router;
