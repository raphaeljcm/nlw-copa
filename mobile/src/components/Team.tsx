import { useRoute } from "@react-navigation/native";
import { HStack, useToast } from "native-base";
import { useEffect, useState } from "react";
import CountryFlag from "react-native-country-flag";
import { api } from "../services/api";
import { Input } from "./Input";

type TeamRouteParams = {
  id: string;
}

type TeamGuessProps = {
  firstTeamPoints: number;
  secondTeamPoints: number;
}
interface TeamProps {
  code: string;
  position: 'left' | 'right';
  gameId: string;
  onChangeText: (value: string) => void;
}

export function Team({ code, position, onChangeText, gameId }: TeamProps) {
  const [guessWasSent, setGuessWasSent] = useState(false);
  const [guess, setGuess] = useState({} as TeamGuessProps);

  const route = useRoute();
  const { id } = route.params as TeamRouteParams;

  async function getGuess() {
    try {
      const { data } = await api.get(`polls/${id}/games/${gameId}/guesses`);

      if (data) {
        setGuessWasSent(true);
        setGuess(data.guess);
      }
    } catch (error) {
      console.log(error);
      setGuessWasSent(false);
    }
  }

  useEffect(() => {
    getGuess();
  }, []);

  return (
    <HStack alignItems="center">
      {position === 'left' && <CountryFlag isoCode={code} size={25} style={{ marginRight: 12 }} />}

      {guessWasSent ? (
        <Input
          w={10}
          h={9}
          textAlign="center"
          fontSize="xs"
          keyboardType="numeric"
          value={position === 'right' ? String(guess.secondTeamPoints) : String(guess.firstTeamPoints)}
          isDisabled={true}
        />
      ): (
        <Input
          w={10}
          h={9}
          textAlign="center"
          fontSize="xs"
          keyboardType="numeric"
          onChangeText={onChangeText}
        />
      )}

      {position === 'right' && <CountryFlag isoCode={code} size={25} style={{ marginLeft: 12 }} />}
    </HStack>
  );
}
