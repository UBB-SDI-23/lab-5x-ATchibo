import React, { useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import UserDTO from '../domain/User/UserDTO';
import UserRequests from '../api/UserRequests';
import LocalStorageManager from './LocalStorageManager';

interface IUserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<IUserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserDTO>(new UserDTO());

  const fetchUser = async () => {
	if (!LocalStorageManager.getAuthToken() || LocalStorageManager.getAuthToken() === "") {
		return;
	}

    await UserRequests.getCurrentUser()
      .then((response) => {
          if (response.status === 200) {
              setUser(new UserDTO(response.data));
          }
      }
      )
      .catch((error) => {
			    console.log("buba mare");
          if (error.response.status !== 404) {
              console.log(error.response.data);
          }
      }
    );
  }

  useEffect(() => {
      fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
