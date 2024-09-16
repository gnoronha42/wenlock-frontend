import { User } from "./IUser";

export interface IUserState {
    users: User[];
    total: number;
    isEditing: boolean, 
  }