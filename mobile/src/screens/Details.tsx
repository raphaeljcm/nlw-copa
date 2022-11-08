import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { useCallback, useEffect, useState } from "react";
import { Share } from "react-native";
import { EmptyMyPollList } from "../components/EmptyMyPollList";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Option } from "../components/Option";
import { PollCardProps } from "../components/PollCard";
import { PollHeader } from "../components/PollHeader";
import { api } from "../services/api";
import { getToast } from "../utils/toast";

type DetailsRouteParams = {
  id: string;
}

export function Details() {
  const [selectedOption, setSelectedOption] = useState<'guesses' | 'ranking'>('guesses');
  const [isLoading, setIsLoading] = useState(true);
  const [pollDetails, setPollDetails] = useState({} as PollCardProps);

  const route =  useRoute();
  const { id } = route.params as DetailsRouteParams;

  const toast = useToast();

  async function getPollDetails() {
    try {
      setIsLoading(true);

      const { data } = await api.get(`/polls/${id}`);
      setPollDetails(data.poll);
    } catch (error) {
      toast.show(getToast('Não foi possível carregar os detalhes do bolão'));
    } finally {
      setIsLoading(false);
    }
  }

  const handleCodeShare = useCallback(async () =>  {
    await Share.share({
      message: pollDetails.code,
    });
  }, []);

  useEffect(() => {
    getPollDetails();
  }, [id]);

  if (isLoading) return <Loading />;

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title={pollDetails.title} showBackButton showShareButton onShare={handleCodeShare} />

      {pollDetails._count?.participants < 0 ? (
        <VStack px={5} flex={1}>
          <PollHeader data={pollDetails} />

          <HStack bgColor='gray.800' p={1} rounded="sm" mb="5">
            <Option
              title="Seus palpites"
              isSelected={selectedOption === 'guesses'}
              onPress={() => setSelectedOption('guesses')}
            />
            <Option
              title="Ranking do grupo"
              isSelected={selectedOption === 'ranking'}
              onPress={() => setSelectedOption('ranking')}
            />
          </HStack>
        </VStack>
      ): (
        <EmptyMyPollList code={pollDetails.code} onShare={handleCodeShare} />
      )}
    </VStack>
  );
}
