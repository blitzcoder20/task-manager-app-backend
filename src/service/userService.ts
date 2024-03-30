import executeQuery from "../utils/queryExecuter";

//Select all users
export const selectAllUsers = async () => {
  const query = "Select * from users";
  const result = await executeQuery(query);
  return result?.rows;
};

//Searches an user by username
export const searchByUsername = async (username: string) => {
  const query = "Select * from users where username = $1";
  const values = [username];
  const result = await executeQuery(query, values);
  return result?.rows[0];
};

//Creates a new user
export const createUser = async (user: User): Promise<boolean> => {
  //verify if the user is unique
  const alreadyPresent = await searchByUsername(user.username);
  if (alreadyPresent) {
    throw new Error("An user with this username already exist");
  }
  const query =
    "INSERT INTO users (name, email, age, surname, username) VALUES ($1, $2, $3, $4, $5)";
  const values = [
    user.name,
    user.email,
    user.age.toString(),
    user.surname,
    user.username,
  ];
  const result = await executeQuery(query, values);
  return result?.rowCount === 1;
};

//Deletes user by id
export const deleteUser = async (username: string): Promise<boolean> => {
  const query = `DELETE FROM public.users
    WHERE username=$1`;
  const values = [username];
  const result = await executeQuery(query, values);
  return result?.rowCount == 1 ? true : false;
};

export const updateUser = async (username: string, user: User) => {
  //Checks if trying to change your username (illegal operation)
  if (user.username && username != user.username) {
    throw new Error("You can't change your username!");
  }

  const query = `UPDATE users
    SET "name"='$1', email='$2', age=$3, surname='$4'
    WHERE username='$5;'`;

  const values = [
    user.name,
    user.email,
    user.age.toString(),
    user.surname,
    username,
  ];
  
  const result = await executeQuery(query, values);
  return result?.rowCount == 1 ? true : false;
};
