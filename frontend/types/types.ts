export interface User {
first_name: string;
  last_name: string;
  email: string;
  user_name: string;
  password: string;
  phone_no: string
}

export type TodoInput = {
  title: string;
  description: string;
  is_complete: boolean;
};

export type Todo = TodoInput & {
  id: number;
  created_at?: string;
  updated_at?: string;
};