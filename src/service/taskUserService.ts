import executeQuery from "../utils/queryExecuter"

export const associateTaskUser= async(idTask:number,idUser:number) => {
    const query = `INSERT INTO user_task 
                    (task_id, user_id) VALUES($1, $2);`
    const values = [idTask.toString(),idUser.toString()]
    return await executeQuery(query,values);
}