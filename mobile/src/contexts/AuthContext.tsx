import { createContext, ReactNode, useContext, useState } from "react";
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

type UserProps = {
  name: string;
  avatarUrl: string;
}

type AuthContextData = {
  user: UserProps;
  isUserLoading: boolean;
  signIn: () => Promise<void>;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [isUserLoading, setIsUserLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '1062298532996-sgrkbemjrfm7jd0u95k0q6hm83gnkf1m.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email']
  });

  async function signIn() {
    try {
      setIsUserLoading(true);

      await promptAsync();
    } catch (err) {
      console.log(err.message);
      throw err;
    } finally {
      setIsUserLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{
      user: {
        name: 'Raphael Marques',
        avatarUrl: 'https://github.com/raphaeljcm.png'
      },
      isUserLoading,
      signIn,
     }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);