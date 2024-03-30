import express from "express";
import { createTask, selectAllTasks } from "../service/taskService";

const router = express.Router();

router.get("/", (req, res) => {
  selectAllTasks().then((rows) => {
    return res.json(rows);
  });
});

router.post("/create", (req, res) => {
  const newTask: Task = req.body;
  createTask(newTask)
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
