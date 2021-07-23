import DataLoader from "dataloader";
import { User } from "../entities/User";

// Input: [1, 7, 2, 4, 21]
// Output: [{id: 1, user: 'time}, {...}, {...}, {...}, {...}]
export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);
    const userIdToUser: Record<number, User> = {};
    users.forEach((user) => {
      userIdToUser[user.id] = user;
    });

    console.log(userIds);
    console.log(users);
    console.log(userIdToUser);
    return userIds.map((userId) => userIdToUser[userId]);
  });
