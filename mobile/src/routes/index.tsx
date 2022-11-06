import { NavigationContainer } from '@react-navigation/native';
import { Box } from 'native-base';
import { useAuthContext } from '../contexts/AuthContext';
import { SignIn } from '../screens/SignIn';
import { AppRoutes } from './app.routes';

export function Routes() {
  const { user } = useAuthContext();

  return (
    <Box flex={1} bg="gray.900">
      <NavigationContainer>
        {user.name ? <AppRoutes /> : <SignIn />}
      </NavigationContainer>
    </Box>
  );
}
