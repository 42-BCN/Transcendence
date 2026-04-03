import { protectedMeProfileAction } from './profile.action';

// TODO WIP
export async function Profile() {
  const data = await protectedMeProfileAction();
  return !data.ok ? (
    <div className="p-8">Failed to load user</div>
  ) : (
    <div className="p-8">
      <h3>User id</h3>
      <p>{data.data.id}</p>
      <h3>User name</h3>
      <p>{data.data.username}</p>
    </div>
  );
}
