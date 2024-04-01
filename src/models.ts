interface User {
  name: string;
  surname: string;
  email: string;
  age: number;
  username:string;
}

interface Task {
  author: string,
  author_id: number,
  created_at?: Date,
  deadline: Date,
  title: string,
  description: string,
  assigned_to?: string[]   
}