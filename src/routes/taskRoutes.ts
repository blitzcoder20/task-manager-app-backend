import express from "express";
import { /*createTask,*/ createTask, selectAllTasks, updateTask } from "../service/taskService";
import { getUserById } from "../service/userService";
import { Task, User } from "../types";

const router = express.Router();

router.get("/", (req, res) => {
  selectAllTasks().then((result) => {
      res.json(result);
  }).catch((ex)=>{
    return res.status(400).json({ message: ex.message });
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

router.put("/edit",(req,res)=>{
  const taskToEdit:Task = req.body;
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

export default router;
