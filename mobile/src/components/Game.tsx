import { Button, HStack, Modal, Text, useTheme, VStack } from "native-base";
import { getName } from 'country-list';
import { Team } from "./Team";
import { Check, X } from "phosphor-react-native";
import dayjs from 'dayjs';
import ptBR from 'dayjs/locale/pt-br';
import { useState } from "react";

type Guess = {
  id: string;
  gameId: string;
  createdAt: string;
  participantId: string;
  firstTeamPoints: number;
  secondTeamPoints: number;
}

export type GameProps = {
  id: string;
  date: string;
  firstTeamCountryCode: string;
  secondTeamCountryCode: string;
  guess: null | Guess;
}

interface GameComponentProps {
  data: GameProps;
  onGuessConfirm: () => void;
  setFirstTeamPoints: (value: string) => void;
  setSecondTeamPoints: (value: string) => void;
}

export function Game({ data, onGuessConfirm, setFirstTeamPoints, setSecondTeamPoints }: GameComponentProps) {
  const [showModal, setShowModal] = useState(false);
  const { colors, sizes } = useTheme();

  const when = dayjs(data.date).locale(ptBR).format('DD [de] MMMM [de] YYYY [às] HH:00[h]');

  function handleGuessConfirmOnModal() {
    setShowModal(false);
    onGuessConfirm();
  }

  return (
    <VStack
      w="full"
      bgColor="gray.800"
      rounded="sm"
      alignItems="center"
      borderBottomWidth={3}
      borderBottomColor="yellow.500"
      mb={3}
      p={4}
    >
      <Text color="gray.100" fontFamily="heading" fontSize="sm">
        {getName(data.firstTeamCountryCode)} vs. {getName(data.secondTeamCountryCode)}
      </Text>

      <Text color="gray.200" fontSize="xs">
        {when}
      </Text>

      <HStack mt={4} w="full" justifyContent="space-between" alignItems="center">
        <Team
          code={data.firstTeamCountryCode}
          position="left"
          onChangeText={setFirstTeamPoints}
          gameId={data.id}
        />

        <X color={colors.gray[300]} size={sizes[6]} />

        <Team
          code={data.secondTeamCountryCode}
          position="right"
          onChangeText={setSecondTeamPoints}
          gameId={data.id}
        />
      </HStack>

      {
        !data.guess &&
          <Button size="xs" bgColor="green.500" mt={4} onPress={() => setShowModal(true)}>
            <HStack alignItems="center">
              <Text color="white" fontSize="xs" fontFamily="heading" mr={3}>
                CONFIRMAR PALPITE
              </Text>

              <Check color={colors.white} size={sizes[4]} />
            </HStack>

            <Modal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
            >
              <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header bgColor="gray.600">
                  <Text color="white">Você tem certeza que deseja {'\n'}fazer este palpite?</Text>
                </Modal.Header>
                <Modal.Body bgColor="gray.600">
                  <Button.Group space={2}>
                    <Button flex={1} bgColor="green.500" onPress={handleGuessConfirmOnModal}>Confirmar</Button>
                    <Button flex={1} bgColor="red.500" onPress={() => setShowModal(false)}>Cancelar</Button>
                  </Button.Group>
                </Modal.Body>
              </Modal.Content>
            </Modal>
          </Button>
      }
    </VStack>
  );
}
