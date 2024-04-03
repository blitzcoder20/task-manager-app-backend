import express from "express";
import {
  createTask,
  deleteTask,
  selectAllTasks,
  updateTask,
} from "../service/taskService";
import { getUserById } from "../service/userService";
import { Task, User } from "../types";

const router = express.Router();

//Selects all tasks
router.get("/", (req, res) => {
  selectAllTasks()
    .then((result) => {
      res.json(result);
    })
    .catch((ex) => {
      return res.status(400).json({ message: ex.message });
    });
});

//Create a new task
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

//Edit a task
router.put("/edit", (req, res) => {

  const taskToEdit: Task = req.body;
  updateTask(taskToEdit)
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

//Delete a task
router.delete("/delete/:id", (req, res) => {
  const taskToRemove: string = req.params.id;
  deleteTask(parseInt(taskToRemove))
    .then((response) => {
      if (response) {
        return res.status(200).send();
      }
      return res.status(400).send();
    })
    .catch(() => {
      return res.status(400);
    });
});
export default router;
