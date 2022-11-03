import { createContext, ReactNode, useContext } from "react";

type UserProps = {
  name: string;
  avatarUrl: string;
}

type AuthContextData = {
  user: UserProps;
  signIn: () => Promise<void>;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  async function signIn() {
    console.log('Signed In!');
  }

  return (
    <AuthContext.Provider value={{
      signIn,
      user: {
        name: 'Raphael Marques',
        avatarUrl: 'https://github.com/raphaeljcm.png'
      }
     }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
