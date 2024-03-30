import executeQuery from "../utils/queryExecuter";
import { associateTaskUser } from "./taskUserService";
import { getUserIdByUsername } from "./userService";

//Select all tasks
export const selectAllTasks = async () => {
  const query = "Select * from tasks";
  const result = await executeQuery(query);
  return result?.rows;
};

//Creates a new user
export const createTask = async (task: Task): Promise<boolean> => {
  const query = `INSERT INTO tasks
    (author_id, deadline, title, description)
    VALUES( $1, $2, $3, $4)
    RETURNING id;`;

  //Retrieve author id and checks if exist
  const authorId = await getUserIdByUsername(task.author);
  if (!authorId) {
    throw new Error("Invalid author name provided");
  }
  //Executes the query and exit if no task is added
  const values = [
    authorId.toString(),
    task.deadline.toString(),
    task.title,
    task.description,
  ];

  const result = await executeQuery(query, values);

  if (result?.rowCount !== 1) {
    return false;
  }

  console.log(result)

  const idTask: number = (result?.rows[0] as Record<string, any>).id;

  //Adds assignees associations with table users
  //It is possible to have a task with no assignees
  task.assigned_to?.forEach(async (username) => {
    const userId = await getUserIdByUsername(username);
    if (!userId) {
      throw new Error(`Invalid request - user ${username} does not exist`);
    }
    associateTaskUser(idTask, userId);
  });

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
