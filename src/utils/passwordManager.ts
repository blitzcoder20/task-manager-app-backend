import bcrypt from 'bcrypt';

export async function getPasswordHash(password : string) : Promise<string>{
  const salt = await bcrypt.genSalt(10); // Salt with 10 rounds
  return await bcrypt.hash(password, salt);
}

export async function verifyPassword(enteredPassword:string, storedHash:string) : Promise<boolean>{
  return await bcrypt.compare(enteredPassword, storedHash);
}