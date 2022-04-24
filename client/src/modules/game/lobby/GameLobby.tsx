import styled from 'styled-components';
import { Game, Player } from "../../../types/game.types";
import { GameHandlers } from "../GamePage";
import PlayerList from '../../../ui/atoms/PlayerList';
import { Alert, Button } from '@mantine/core';
import { useCopyToClipboard } from 'react-use';

interface Props
  extends Pick<
    GameHandlers,
    "onGameStart" | "onPlayerKick" | "onSettingsUpdate"
  > {
  game: Game;
  player: Player;
  players: Player[];
}

const Container = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header"
    "players"
    "actions";
  height: 100%;
  width: 100%;
`;

const Header = styled.div`
  grid-area: header;
  width: 100%;
`;

const StyledPlayerList = styled(PlayerList)`
  grid-area: players;
  overflow-y: scroll;
  padding-inline-start: 20px;
`;

const ActionArea = styled.div`
  grid-area: actions;
  width: 100%;
`;

const StyledA = styled.a`
  display: block;
  text-align: center;
`;

const PlayerListItemContents = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  font-size: 1.2rem;
  justify-content: space-between;
  padding-bottom: 10px;

  p {
    margin: 0;
  }

  button {
    font-size: 0.9rem;
    margin: 0;
  }
`;

function GameLobby({
  game,
  onGameStart,
  onPlayerKick,
  onSettingsUpdate,
  player,
  players
}: Props): JSX.Element {

  // eslint-disable-next-line
  const [_, copyToClipboard] = useCopyToClipboard();

  const isAtMinimumPlayerCount = players.length >= 3;

  return (
    <Container className="active-contents">
      <Header>
        <h1 style={{ textAlign: "center", marginBottom: 0 }}>
          Game id: {game.id}
        </h1>
        <StyledA
          onClick={(e) => {
            e.preventDefault();
            copyToClipboard(window.location.href);
            window.alert(`Copied to clipboard: ${window.location.href}`);
          }}
          href="#"
        >
          Copy game join link
        </StyledA>
        {!isAtMinimumPlayerCount && (
          <Alert
            title="Invite your friends!"
            color="yellow"
            style={{ margin: '10px' }}
          >
            At least three players are needed to start the game
          </Alert>
        )}
      </Header>
      <StyledPlayerList
        players={Object.values(game.players)}
        ownPlayerId={player.socketId}
        renderPlayer={(playerToRender, idx, ownPlayerId) => {
          return (
            <PlayerListItemContents>
              <p style={{ marginLeft: "10px" }}>
                {playerToRender.name}
                {playerToRender.socketId === ownPlayerId && " (you)"}
                {playerToRender.isHost && " (host)"}
              </p>
              {player.isHost && playerToRender.socketId !== player.socketId && (
                <button onClick={() => onPlayerKick(playerToRender.socketId)}>
                  x
                </button>
              )}
            </PlayerListItemContents>
          );
        }}
      />
      <ActionArea>
        {player.isHost && (
          <>
            <Button
              fullWidth
              disabled={!isAtMinimumPlayerCount}
              onClick={() => {
                onGameStart();
              }}
            >
              Start game
            </Button>
          </>
        )}
      </ActionArea>
    </Container>
  );
}


export default GameLobby;
