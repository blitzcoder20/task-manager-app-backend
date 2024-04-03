import executeQuery from "../utils/queryExecuter";
import { getUserById } from "./userService";

export const associateTaskUser = async (idTask: number, idUser: number) => {
  const query = `INSERT INTO user_task 
                    (task_id, user_id) VALUES($1, $2);`;
  const values = [idTask.toString(), idUser.toString()];

  const result = await executeQuery(query, values);

  return result.rowCount;
};

export const getAssigneesIdsByTaskId = async (taskId: number) => {
  //Retrieving all already associated assignees
  const selectQuery = `Select * from user_task where task_id = $1`;
  let values = [taskId.toString()];
  const result = await executeQuery(selectQuery, values);
  return result;
};

export const getAssignees = async (taskId: number) => {
  //Retrieves ids
  const assigneesId = (await getAssigneesIdsByTaskId(taskId)).rows.map(
    (v) => v.user_id
  );

  if (assigneesId.length === 0) {
    return [];
  }

  //Retrieves usernames
  const usernamePromises = assigneesId.map(
    async (id) => (await getUserById(id))?.username
  );
  const assigneesUsername = await Promise.all(usernamePromises);
  //Combining results
  const assignees = assigneesId.map((id, index) => ({
    id: id,
    username: assigneesUsername[index],
  }));

  return assignees;
};

export const deleteAssociationTaskUser = async (
  idTask: number,
  idUser: number
) => {
  const deleteQuery = `DELETE FROM user_task
    WHERE task_id=$1 AND user_id=$2;`;
  const values = [idTask.toString(), idUser.toString()];
  const result = await executeQuery(deleteQuery, values);
  return result;
};

//Update the assignees
export const updateAssignees = async (
  assigneesIds: number[],
  taskId: number
) => {
  const result = await getAssigneesIdsByTaskId(taskId);

  const dbAssigneesIds = result.rows.map((row) => row.user_id);

  //Remove from db the association that are no longer used
  const assigneesToRemove = dbAssigneesIds.filter((dbId) => {
    for (const id of assigneesIds) {
      if (id == dbId) {
        return false;
      }
    }
    return true;
  });

  const removeAssigneesPromise = assigneesToRemove.forEach(
    async (userId: number) => {
      return await deleteAssociationTaskUser(taskId, userId);
    }
  );

  await Promise.all([removeAssigneesPromise]);

  //Adding to the db the missing assignees
  //Filters the assignees already associated in the db
  const assigneesToAdd = assigneesIds.filter((id) => {
    for (const dbUserId of dbAssigneesIds) {
      if (id === dbUserId) {
        return false;
      }
    }
    return true;
  });
  const addAssigneesPromise = assigneesToAdd.forEach(async (userId: number) => {
    return await associateTaskUser(taskId, userId);
  });

  await Promise.all([addAssigneesPromise]);
};
