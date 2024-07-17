import { useAppStore } from "@/store";

const Profile = () => {
  const { userInfo } = useAppStore();
  return (
    <div>
      Profile
      <p>Email: {userInfo.email}</p>
    </div>
  );
};

export default Profile;
