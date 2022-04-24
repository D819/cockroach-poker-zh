import { useQuery } from "react-query";
import { useHistory } from "react-router";
import { Alert, Button, Image } from "@mantine/core";
// import { Button, Icon, Image, Message } from "semantic-ui-react";
import useSocketListener from "../hooks/useSocketListener";
import { socketUrl, useSocket } from "../socket";
import { ClientEvent, ServerEvent } from "../types/event.types";
import { Icon } from "semantic-ui-react";

function IndexRoute(): JSX.Element {
  const socket = useSocket();
  const history = useHistory();

  useSocketListener(ServerEvent.GAME_CREATED, (data) => {
    history.push(`/game/${data.id}`);
  });

  const handleNewGame = () => {
    socket.emit(ClientEvent.CREATE_GAME, socket.id);
  };

  const { isLoading } = useQuery("server-ping", () =>
    fetch(`${socketUrl}/ping`).then((res) => res.json())
  );

  return (
    <div
      className="active-contents"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div className="flex-center" style={{ textAlign: "center" }}>
        <h1>Cockroach Poker</h1>
        <Image src="/assets/cockroach-poker.jpg" style={{ maxHeight: "50%" }} />

        {isLoading ? (
          <Alert
            icon={<Icon name="circle notched" loading />}
            title="Loading..."
            style={{ textAlign: "left", margin: "10px" }}
          >
            This can be 30-40s on first boot. Thanks for waiting!
          </Alert>
        ) : (
          <p style={{ margin: "5%" }}>
            The social bluffing game of creepy critters!
          </p>
        )}
      </div>
      <div style={{ width: "100%" }}>
        {/* <Button
          fullWidth
          color="black"
          onClick={() => window.open("https://github.com/richardcrng/2r1b")}
        >
          LEARN
        </Button>
        <Button
          disabled={isLoading}
          fullWidth
          color="green"
          onClick={handleJoinGame}
        >
          JOIN
        </Button> */}
        <Button disabled={isLoading} fullWidth onClick={handleNewGame}>
          NEW
        </Button>
      </div>
    </div>
  );
}

export default IndexRoute;
