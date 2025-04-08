import { resetUsersToDefault } from "./lib/users";

async function reset() {
  try {
    await resetUsersToDefault();
    console.log('Users reset successfully');
  } catch (error) {
    console.error('Failed to reset users:', error);
  }
}

reset();