import { Icon, useToast, VStack, FlatList } from "native-base";
import { Octicons } from '@expo/vector-icons';
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { api } from "../services/api";
import { useCallback, useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { getToast } from "../utils/toast";
import { PollCard, PollCardProps } from "../components/PollCard";
import { EmptyPollList } from "../components/EmptyPollList";

export function Polls() {
  const [isLoading, setIsLoading] = useState(true);
  const [polls, setPolls] = useState<PollCardProps[]>([]);

  const toast = useToast();
  const { navigate } = useNavigation();

  async function getPolls() {
    try {
      setIsLoading(true);
      const { data } = await api.get('/polls');
      setPolls(data.polls);
    } catch (error) {
      console.log(error);
      toast.show(getToast('Não foi possível carregar os bolões'))
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    getPolls();
  }, []));

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />

      <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
          onPress={() => navigate('findPoll')}
        />
      </VStack>

      {isLoading ? <Loading /> : (
        <FlatList
          data={polls}
          px={5}
          keyExtractor={(item : PollCardProps) => item.id}
          renderItem={({ item }) => <PollCard data={item} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => <EmptyPollList />}
          _contentContainerStyle={{ paddingBottom: "24" }}
        />
      )}
    </VStack>
  );
}
