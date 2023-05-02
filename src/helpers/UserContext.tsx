import React from 'react';
import UserDTO from '../domain/User/UserDTO';
import LocalStorageManager from './LocalStorageManager';

interface IUserContext {
  user: UserDTO;
  setUser: (user: UserDTO) => void;
}

export const UserContext = React.createContext<IUserContext>({
  user: new UserDTO(LocalStorageManager.getUser()) || new UserDTO(),
  setUser: () => {},
});
