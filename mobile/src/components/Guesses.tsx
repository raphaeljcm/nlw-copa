import { FlatList, useToast } from "native-base";
import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import { getToast, TOAST_SUCCESS_KEY } from "../utils/toast";
import { EmptyMyPollList } from "./EmptyMyPollList";
import { Game, GameProps } from "./Game";
import { Loading } from "./Loading";

interface GuessesProps {
  pollId: string;
  code: string;
}

export function Guesses({ pollId, code }: GuessesProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');

  const toast = useToast();

  async function getGames() {
    try {
      setIsLoading(true);

      const { data } = await api.get(`/polls/${pollId}/games`);
      setGames(data.games);
    } catch (error) {
      console.log(error);
      toast.show(getToast('Não foi possível carregar os jogos'));
    } finally {
      setIsLoading(false);
    }
  }

  const handleGuessConfirm = useCallback(async (gameId: string) => {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show(getToast('Informe o placar do palpite!'));
      }

      await api.post(`/polls/${pollId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints)
      });

      toast.show(getToast('Palpite enviado com sucesso!', TOAST_SUCCESS_KEY));
      getGames();
    } catch (error) {
      console.log(error);

      if (error.response?.data?.message === "You're not allowed to create a guess on this poll.") {
        toast.show(getToast('Você não tem permissão de criar um palpite neste bolão!'));
      }

      if (error.response?.data?.message === "Game not found") {
        toast.show(getToast('Jogo não encontrado!'));
      }

      if (error.response?.data?.message === "You cannot send guesses after the game has ended") {
        toast.show(getToast('Você não pode enviar um palpite depois que o jogo terminou!'));
      }

      if (error.response?.data?.message === "You have already sent a guess to this game on this poll") {
        toast.show(getToast('Você já enviou um palpite para este jogo!'));
      }
    }
  }, [firstTeamPoints, secondTeamPoints]);

  useEffect(() => {
    getGames();
  }, [pollId]);

  if (isLoading) return <Loading />;

  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 20 }}
      ListEmptyComponent={() => <EmptyMyPollList code={code} />}
    />
  )
}
