import express from "express";
import { createTask, selectAllTasks } from "../service/taskService";
import { getUserById } from "../service/userService";

const router = express.Router();

router.get("/", (req, res) => {
  selectAllTasks().then((rows) => {
    const promises = rows?.map(async (row) => {
      const author = await getUserById((row as Object as Task).author_id);
      const authorName = (author as Object as User).username;
      const newRow = { ...row, 'author': authorName };
      return newRow;
    });
    Promise.all(promises as Promise<Object>[]).then((newRows)=>{
      return res.json(newRows);
    })
    
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

export default router;
