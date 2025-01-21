import { FC, useEffect, useState } from "react";

interface UserInfo {
  _id: string;
  username: string;
  email: string;
}

const Profile: FC = () => {
  const [users, setUsers] = useState<UserInfo[]>([]); // State for an array of users

  useEffect(() => {
    // Check if user data is saved in localStorage
    const savedUserData = localStorage.getItem("userdata");
    if (savedUserData) {
      const parsedData: UserInfo[] = JSON.parse(savedUserData); // Parse as an array of users
      setUsers(parsedData);
      console.log(parsedData);
    }
  }, []);

  return (
    <div className="container mx-auto min-h-[83vh] w-full max-w-5xl dark:text-white">
      <h1 className="text-4xl p-4 font-bold font-lora">Your Account</h1>
      <div className="font-karla grid grid-cols-1 gap-4 p-4">
        {users.map((user) => (
          <div key={user._id} className="p-4 border rounded-lg shadow-md">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="font-bold">Username</td>
                  <td>{user.username}</td>
                </tr>
                <tr>
                  <td className="font-bold">Email</td>
                  <td>{user.email}</td>
                </tr>
                <tr>
                  <td className="font-bold">User ID</td>
                  <td>{user._id}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
