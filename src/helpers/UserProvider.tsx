import React, { useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import UserDTO from '../domain/User/UserDTO';
import LocalStorageManager from './LocalStorageManager';

interface IUserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<IUserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserDTO>(LocalStorageManager.getUser() || new UserDTO());

  useEffect(() => {
      LocalStorageManager.setUser(user);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
