type UserProfile = {
  id: number;
  username: string;
  settings?: {
    notifications?: boolean;
  };
};

// Each user covers one case, labelled so the output shows what is being tested
const cases: { label: string; user: UserProfile }[] = [
  {
    label: "notifications on",
    user: { id: 1, username: "michael", settings: { notifications: true } },
  },
  {
    label: "no settings",
    user: { id: 2, username: "sylvester" },
  },
  {
    label: "settings, no notifications",
    user: { id: 3, username: "wambua", settings: {} },
  },
  {
    label: "notifications explicitly off",
    user: { id: 4, username: "kamau", settings: { notifications: false } },
  },
];

function isNotified(user: UserProfile): boolean {
  return user.settings?.notifications ?? false;
}

for (const { label, user } of cases) {
  console.log(`${user.username} (${label}): ${isNotified(user)}`);
}