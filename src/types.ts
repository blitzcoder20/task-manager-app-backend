export type User= {
  name: string,
  surname: string,
  email: string,
  age: number,
  username:string,
  password:string
}

export type Task= {
  id:number,
  author: string,
  author_id: number,
  created_at?: Date,
  deadline: Date,
  title: string,
  description: string,
  assigned_to?: AssigneesUsers[]   
}

export type AssigneesUsers = {"id":number,"username":string} 

export type LogIn = {"email":string,"password":string}
