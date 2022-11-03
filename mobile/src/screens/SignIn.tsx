import { Center, Icon, Text } from "native-base";
import { Fontisto } from '@expo/vector-icons';

import Logo from '../assets/logo.svg';
import { Button } from "../components/Button";
import { useAuthContext } from "../contexts/AuthContext";

export function SignIn() {
  const { signIn } = useAuthContext();

  return (
    <Center flex={1} bgColor="gray.900" p={7}>
      <Logo width={212} height={40} />

      <Button
        title="entrar com o google"
        type="SECONDARY"
        mt={12}
        leftIcon={<Icon as={Fontisto} name="google" color="white" size="md" />}
        onPress={signIn}
      />

      <Text color="white" textAlign="center" mt={4}>
        Não utilizamos nenhuma informação além {'\n'}
        do seu email para criação de sua conta.
      </Text>
    </Center>
  );
}
