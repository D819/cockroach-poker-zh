import { selectActiveGamePhase, selectActivePlayer, selectCardPrediction, selectCurrentPassRecord, selectIsFirstPass, selectIsFurtherPassPossible, selectPassingPlayer } from "../selectors/game-selectors";
import { Game, GamePhase, Player } from "../types/game.types";

export const getGameHeadlineMarkdown = (game: Game, player: Player): string => {
  const phase = selectActiveGamePhase(game);
  const pass = selectCurrentPassRecord(game);
  const passer = selectPassingPlayer(game);
  const activePlayer = selectActivePlayer(game);
  const isActivePlayer = activePlayer.socketId === player.socketId;
  const isPasser = passer?.socketId === player.socketId;

  const activePlayerIs = isActivePlayer
    ? "***You*** are"
    : `**${activePlayer.name}** is`;

  const passerHas = isPasser ? "***You*** have" : `${passer?.name} has`

  const passerPossessive = isPasser ? "***your***" : `**${passer?.name}**'s`

  switch (phase) {
    case GamePhase.CARD_REVEAL: {
      const prediction = selectCardPrediction(game);
      return `${activePlayerIs} predicting that ${passerPossessive} **"${pass?.claim}"** is ${prediction ? "true" : "a lie"}`
    }

    case GamePhase.PASS_SELECTION:
      return pass
        ? `${activePlayerIs} peeking at ${passerPossessive} **"${pass?.claim}"**`
        : `${
            activePlayerIs
          } starting a new pass`;
    
    case GamePhase.PREDICT_OR_PASS:
      return `${passerHas} passed a **"${pass?.claim}"** to **${
        isActivePlayer ? "*you*" : activePlayer.name
      }**`;
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

  const activePlayerIs = isActivePlayer
    ? "***You*** are"
    : `**${activePlayer.name}** is`;

  const passerHas = isPasser ? "***You*** have" : `${passer?.name} has`;

  const passerPossessive = isPasser ? "***your***" : `**${passer?.name}**'s`;

  switch (phase) {
    case GamePhase.CARD_REVEAL: {
      const prediction = selectCardPrediction(game);
      return [
        `${activePlayerIs} predicting that ${passerPossessive} **"${
          pass?.claim
        }"** is ${prediction ? "true" : "a lie"}.`,
        `If the prediction is accurate, ${isPasser ? "***you***" : `**${passer?.name}**`} will take the card.`,
        `If the prediction is inaccurate, ${isActivePlayer ? "***you***" : `**${activePlayer.name}**`} will take the card.`
      ].join("\n\n");
    }

    case GamePhase.PASS_SELECTION: {
      const peekMessage = `${activePlayerIs} peeking at ${passer?.name}'s claimed **"${pass?.claim}"**.`;

      const message = `${activePlayerIs} going to pick ${
        pass
          ? "a *claim* and *player* to pass the card to."
          : `a *card* from ${isActivePlayer ? "your" : "their"} hand with a *claim* and a *player* to *pass* it to.`}`;

      return pass ? peekMessage + "\n\n" + message : message;
    }

    case GamePhase.PREDICT_OR_PASS: {
      const passMessage = `${passerHas} passed ${isFirstPass ? "a" : "the"} card onto **${isActivePlayer ? "*you*" : activePlayer.name}** with a claim of **"${pass?.claim}"**.`;

      const peekOrPassMessage = `${activePlayer} due to *predict* the claim's truthfulness, or peek and *pass* it on.`;

      const mustPassMessage = `Since all other players have seen the card, **${
        isActivePlayer ? "*you*" : activePlayer.name
      }** must *predict* the claim's truthfulness.`;

      const predictionConsequenceMessage = `If ${
        isActivePlayer
          ? "***you*** predict"
          : `**${activePlayer.name}** predicts`
      } correctly, ${
        isPasser ? "***you*** are" : `**${passer?.name}** is`
      } forced to take the card. Otherwise, ${
        isActivePlayer ? "***you*** take" : `**${activePlayer.name}** takes`
      } the card.`;

      return [
        passMessage,
        isFurtherPassPossible ? peekOrPassMessage : mustPassMessage,
        predictionConsequenceMessage,
      ].join("\n\n");
    }
  }
}