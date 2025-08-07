import { type User, type UserStat } from "./types";
import data from "./mock.json";

export const fetchUserStats = async (): Promise<UserStat[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return data.stats as UserStat[];
};

export const fetchUsers = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return data.users as User[];
};
