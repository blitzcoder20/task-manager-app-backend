import { User } from "../types";
import { getPasswordHash, verifyPassword } from "../utils/passwordManager";
import executeQuery from "../utils/queryExecuter";

//Select all users
export const selectAllUsers = async (): Promise<Array<User>> => {
  const query = "Select * from users";
  const result = await executeQuery(query);
  return result?.rows;
};

//Searches an user by username
export const searchByUsername = async (username: string): Promise<User> => {
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

  //Generates the password hash
  const password_hash = await getPasswordHash(user.password);

  const query =
    "INSERT INTO users (name, email, age, surname, username, password_hash) VALUES ($1, $2, $3, $4, $5, $6)";

  const values = [
    user.name,
    user.email,
    user.age.toString(),
    user.surname,
    user.username,
    password_hash,
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

//Updates an already existing user
export const updateUser = async (username: string, user: User) => {
  //Checks if trying to change your username (illegal operation)
  if (user.username && username != user.username) {
    throw new Error("You can't change your username!");
  }

  const query = `UPDATE users
    SET "name"='$1', email='$2', age=$3, surname='$4'
    WHERE username='$5';`;

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

//Return a single user by his id
export const getUserById = async (id: number): Promise<User | null> => {
  const query = `Select * from users where id=$1`;
  const values = [id.toString()];
  const result = await executeQuery(query, values);

  if (!result || !result.rows || result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};

//Return the id of a user by his id
export const getUserIdByUsername = async (
  username: string
): Promise<number> => {
  const query = `Select id from users where username=$1`;
  const values = [username];
  const result = await executeQuery(query, values);

  return result?.rows[0].id;
};

//Return the id of a user by his id
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const query = `Select * from users where email=$1`;
  const values = [email];
  const result = await executeQuery(query, values);

  if (!result || !result.rows || result.rows.length === 0) {
    return null;
  }

  return result?.rows[0];
};

//Returns an user if login request is valid
export const logIn = async (
  email: string,
  password: string
): Promise<User | null> => {
  //Checks if an user with that email exist and retrieves hashed password
  let user = await getUserByEmail(email);

  if (!user) {
    return null;
  }
  //Verifies if password is correct
  const db_password_hashed = user?.password_hash;
  const logged = await verifyPassword(password, db_password_hashed);
  if (!logged) {
    return null;
  }

  //Returns the logged user
  user.password_hash = "";
  return user;
};
