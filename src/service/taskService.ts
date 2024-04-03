import { AssigneesUsers, Task } from "../types";
import executeQuery from "../utils/queryExecuter";
import { getAssignees, updateAssignees } from "./taskUserService";
import { getUserById, getUserIdByUsername } from "./userService";

//Select all tasks
export const selectAllTasks = async (): Promise<Array<Task>> => {
  const query = `SELECT * FROM tasks;`;

  const result = await executeQuery(query);

  //Retrieving associates and author username
  const tasksPromises = result.rows.map(async (row) => {
    return { ...row, assigned_to: await getAssignees(row.id), author: (await getUserById(row.author_id))?.username};
  });
  
  return await Promise.all(tasksPromises);
};

//Creates a new user
export const createTask = async (task: Task): Promise<boolean> => {
  const query = `INSERT INTO tasks
    (author_id, deadline, title, description)
    VALUES( $1, $2, $3, $4)
    RETURNING id;`;

  let authorId = task.author_id;
  //Retrieve author id and checks if exist
  if (!authorId) {
    authorId = await getUserIdByUsername(task.author);
    if (!authorId) {
      throw new Error("Invalid author provided");
    }
  }

  //Executes the query and exit if no task is added
  const values = [
    authorId.toString(),
    task.deadline.toString(),
    task.title,
    task.description,
  ];

  const result = await executeQuery(query, values);

  if (result.rowCount !== 1) {
    return false;
  }

  const idTask: number = result.rows[0].id;

  if (task.assigned_to) {
    updateAssignees(
      task.assigned_to.map((v) => v.id),
      idTask
    );
  }

  return true;
};

//Delete a task
export const deleteTask = async (taskId: number): Promise<boolean> => {
  const query = `DELETE FROM tasks
                WHERE id=$1`;
  const values = [taskId.toString()];

  const result = await executeQuery(query, values);
  return result?.rowCount === 1;
};

//Update an existing task
export const updateTask = async (newTask: Task): Promise<boolean> => {
  const query = `UPDATE public.tasks
    SET author_id=$1, deadline=$2, title=$3, description=$4
    WHERE id=$5`;

  const values = [
    newTask.author_id.toString(),
    newTask.deadline.toString(),
    newTask.title,
    newTask.description,
    newTask.id.toString(),
  ];
  
  const result = await executeQuery(query, values);
  //Assigning an empty array
  //I need it to update the assignees to remove it
  //To already assigned ones
  if (!newTask.assigned_to) {
    newTask.assigned_to = [];
  }
  const assigneesIds: number[] = newTask.assigned_to.map((obj) => obj.id);
  try {
    await updateAssignees(assigneesIds, newTask.id);
  } catch {
    throw Error("Error while updating assignees");
  }

  return result?.rowCount == 1 ? true : false;
};
