import { protectedMeProfileAction } from './profile.action';

// This page is for debug, ill style type and fix latter
export async function Profile() {
  const data = await protectedMeProfileAction();
  return !data.ok ? (
    <div>Failed to load user</div>
  ) : (
    <div>
      <h3>User id</h3>
      <p>{data.data.id}</p>
      <h3>User name</h3>
      <p>{data.data.username}</p>
    </div>
  );
}
