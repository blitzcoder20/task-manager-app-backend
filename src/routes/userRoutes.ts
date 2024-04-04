import express from "express";
import { createUser, logIn, selectAllUsers } from "../service/userService";
import { LogIn, User } from "../types";

const router = express.Router();

//Gets all user list
router.get("/", (req, res) => {
  selectAllUsers().then((rows) => {
    return res.json(rows);
  });
});

//Creates a new user
router.post("/create", (req, res) => {
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

//Gets authentication request and if valid return 
//the user object
router.post("/authenticate", (req, res) => {
  const user: LogIn = req.body;
  logIn(user.email, user.password)
    .then((user) => {
      if (!user) {
        return res.status(401).send();
      }
      return res.status(200).json(user);
    })
    .catch((ex) => {
      return res.status(400).json({ message: ex.message });
    });
});
export default router;
