import React from 'react';
import UserDTO from '../domain/User/UserDTO';

interface IUserContext {
  user: UserDTO;
  setUser: (user: UserDTO) => void;
}

export const UserContext = React.createContext<IUserContext>({
  user: new UserDTO(new UserDTO()),
  setUser: () => {},
});
