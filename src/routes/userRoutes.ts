import express from "express";
import { createUser, selectAllUsers } from "../service/userService";

const router = express.Router();

router.get("/", (req, res) => {
  selectAllUsers().then((rows) => {
    return res.json(rows);
  });
});

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

export default router;
