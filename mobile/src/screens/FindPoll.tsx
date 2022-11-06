import { Heading, useToast, VStack } from "native-base";
import { Header } from "../components/Header";

import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { getToast, TOAST_SUCCESS_KEY } from "../utils/toast";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function FindPoll() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");

  const { navigate } = useNavigation();
  const toast = useToast();

  async function handleJoinPoll() {
    try {
      setIsLoading(true);

      if (!code.trim()) {
        toast.show(getToast('Informe o código'));
      }

      await api.post('/polls/join', { code });
      setIsLoading(false);

      toast.show(getToast('Você entrou no bolão com sucesso!', TOAST_SUCCESS_KEY));
      navigate('polls');
    } catch (error) {
      console.log(error);
      setIsLoading(false);

      if (error.response?.data?.message === 'Poll not found') {
        toast.show(getToast('Não foi possível encontrar o bolão'));
      }

      if (error.response?.data?.message === 'You have already joined this poll') {
        toast.show(getToast('Você já está nesse bolão'));
      }
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
          Encontre um bolão através de {'\n'}
          seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          autoCapitalize="characters"
          onChangeText={setCode}
          value={code}
        />

        <Button
          title="BUSCAR BOLÃO"
          isLoading={isLoading}
          onPress={handleJoinPoll}
        />
      </VStack>
    </VStack>
  )
}
