import { selectActiveGamePhase, selectActivePlayer, selectCurrentPassRecord, selectIsFirstPass, selectIsFurtherPassPossible, selectPassingPlayer } from "../selectors/game-selectors";
import { Game, GamePhase, Player } from "../types/game.types";

export const getGameHeadlineMarkdown = (game: Game, player: Player): string => {
  const phase = selectActiveGamePhase(game);
  const pass = selectCurrentPassRecord(game);
  const passer = selectPassingPlayer(game);
  const activePlayer = selectActivePlayer(game);
  const isActivePlayer = activePlayer.socketId === player.socketId;
  const isPasser = passer?.socketId === player.socketId;

  switch (phase) {
    case GamePhase.PREDICT_OR_PASS:
      return `**${isPasser ? "*You*" : passer?.name}** pass${isPasser ? "" : "es"} a **"${pass?.claim}"** to **${isActivePlayer ? "*you*" : activePlayer.name}**`;

    case GamePhase.PASS_SELECTION:
      return pass
        ? `${isActivePlayer ? "***You*** are" : `**${activePlayer.name}** is`} peeking at ${isPasser ? "your" : `${passer?.name}'s`} **"${pass?.claim}"**`
        : `${
            isActivePlayer ? "***You*** are" : `**${activePlayer.name}** is`
          } starting a new pass`;
  }
}

export const getGameInfoMarkdown = (game: Game, player: Player): string => {
  const phase = selectActiveGamePhase(game);
  const pass = selectCurrentPassRecord(game);
  const passer = selectPassingPlayer(game);
  const isFirstPass = selectIsFirstPass(game);
  const isFurtherPassPossible = selectIsFurtherPassPossible(game);
  const activePlayer = selectActivePlayer(game);
  const isActivePlayer = activePlayer.socketId === player.socketId;
  const isPasser = passer?.socketId === player.socketId;

  switch (phase) {
    case GamePhase.PREDICT_OR_PASS: {
      const passMessage = `${
        isPasser ? "***You*** have" : `**${passer?.name}** has`
      } passed ${isFirstPass ? "a" : "the"} card onto **${
        isActivePlayer ? "*you*" : activePlayer.name
      }** with a claim of **"${pass?.claim}"**.`;

      const peekOrPassMessage = `${
        isActivePlayer ? "***You*** need" : `**${activePlayer.name}** needs`
      } to *predict* the claim's truthfulness, or peek and *pass* it on.`;

      const mustPassMessage = `Since all other players have seen the card, **${
        isActivePlayer ? "*you*" : activePlayer.name
      }** must *predict* the claim's truthfulness.`;

      const predictionConsequenceMessage = `If ${isActivePlayer ? "***you*** predict" : `**${activePlayer.name}** predicts`} correctly, ${isPasser ? "***you*** are" : `**${passer?.name}** is`} forced to take the card. Otherwise, ${isActivePlayer ? "***you*** take" : `**${activePlayer.name}** takes`} the card.`

      return [passMessage, isFurtherPassPossible ? peekOrPassMessage : mustPassMessage, predictionConsequenceMessage].join("\n\n")
    }

    case GamePhase.PASS_SELECTION: {
      const peekMessage = `${
        isActivePlayer ? "***You*** are" : `**${activePlayer.name}** is`
      } peeking at ${passer?.name}'s claimed **"${pass?.claim}"**.`;

      const message = `${
        isActivePlayer ? "***You*** need" : `**${activePlayer.name}** needs`
      } to ${
        pass
          ? "*pass* the card on"
          : `*pick* a card from ${
              isActivePlayer ? "your" : "their"
            } hand and *pass* it on`
      } with a *claim*.`;

      return pass ? peekMessage + "\n\n" + message : message
    }
  }
}