type UserProfile = {
  id: number;
  username: string;
  settings?: {
    notifications?: boolean;
  };
};

const users: UserProfile[] = [
  { id: 1, username: "michael", settings: { notifications: true } },
  { id: 2, username: "sylvester" },
  { id: 3, username: "wambua", settings: {} },
];

function isNotified(user: UserProfile): boolean {
  return user.settings?.notifications ?? false;
}

for (const user of users) {
  console.log(`${user.username}: ${isNotified(user)}`);
}