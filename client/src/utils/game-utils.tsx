import {
  selectActiveGamePhase,
  selectActivePlayer,
  selectCardPrediction,
  selectCurrentPassRecord,
  selectIsFirstPass,
  selectIsFurtherPassPossible,
  selectLosingPlayer,
  selectLossInfo,
  selectPassingPlayer,
} from "../selectors/game-selectors";
import { Game, GamePhase, Player } from "../types/game.types";
import i18n from "../i18n/config";

export const getGameHeadlineMarkdown = (game: Game, player: Player): string => {
  const phase = selectActiveGamePhase(game);
  const pass = selectCurrentPassRecord(game);
  const passer = selectPassingPlayer(game);
  const activePlayer = selectActivePlayer(game);
  const isActivePlayer = activePlayer.socketId === player.socketId;
  const isPasser = passer?.socketId === player.socketId;

  const activePlayerIs = isActivePlayer
    ? `***${i18n.t('lobby.you')}*** ${i18n.t('game.are')}`
    : `**${activePlayer.name}** ${i18n.t('game.is')}`;

  const passerHas = isPasser 
    ? `***${i18n.t('lobby.you')}*** ${i18n.t('game.have')}` 
    : `**${passer?.name}** ${i18n.t('game.has')}`;

  const passerPossessive = isPasser 
    ? `***${i18n.t('game.your')}***` 
    : `**${passer?.name}**${i18n.t('game.possessive')}`;

  switch (phase) {
    case GamePhase.DECLARE_LOSER: {
      const losingPlayer = selectLosingPlayer(game);

      return `${
        losingPlayer?.socketId === player.socketId
          ? `***${i18n.t('lobby.you')}*** ${i18n.t('game.lose')}`
          : `**${losingPlayer?.name}** ${i18n.t('game.loses')}`
      }`;
    }

    case GamePhase.CARD_REVEAL: {
      const prediction = selectCardPrediction(game);
      return `${activePlayerIs} ${i18n.t('game.predicting')} ${i18n.t('game.a')} **${
        prediction ? i18n.t('game.truth') : i18n.t('game.lie')
      } "${pass?.claim && i18n.t(`suits.${pass.claim}`)}"** ${i18n.t('game.claim')} ${i18n.t('game.from')} ${isPasser ? i18n.t('lobby.you') : passer?.name}`;
    }

    case GamePhase.PASS_SELECTION:
      return pass
        ? `${activePlayerIs} ${i18n.t('game.peeking_at')} ${passerPossessive} **"${pass?.claim && i18n.t(`suits.${pass.claim}`)}"**`
        : `${activePlayerIs} ${String(i18n.t('game.is_starting_new_pass'))}`;

    case GamePhase.PREDICT_OR_PASS:
      return `${passerHas} ${i18n.t('game.passed_a')} **"${pass?.claim && i18n.t(`suits.${pass.claim}`)}"** ${i18n.t('game.to')} **${
        isActivePlayer ? `*${i18n.t('lobby.you')}*` : activePlayer.name
      }**`;
  }
};

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
    ? `***${i18n.t('lobby.you')}*** ${i18n.t('game.are')}`
    : `**${activePlayer.name}** ${i18n.t('game.is')}`;

  const passerHas = isPasser 
    ? `***${i18n.t('lobby.you')}*** ${i18n.t('game.have')}` 
    : `${passer?.name} ${i18n.t('game.has')}`;

  const passerPossessive = isPasser 
    ? `***${i18n.t('game.your')}***` 
    : `**${passer?.name}**${i18n.t('game.possessive')}`;

  switch (phase) {
    case GamePhase.DECLARE_LOSER: {
      const lossInfo = selectLossInfo(game);
      const losingPlayer = selectLosingPlayer(game);

      return `${i18n.t('game.by_collecting')} 4 ${lossInfo?.suit && i18n.t(`suits.${lossInfo.suit}`)} ${i18n.t('game.cards')}, ${
        losingPlayer?.socketId === player.socketId
          ? `${i18n.t('lobby.you')} ${i18n.t('game.have_lost')}`
          : `${losingPlayer?.name} ${i18n.t('game.has_lost')}`
      } ${i18n.t('game.the_game')}. \n\n${i18n.t('game.all_other_winners')}`;
    }

    case GamePhase.CARD_REVEAL: {
      const prediction = selectCardPrediction(game);
      return [
        `${activePlayerIs} ${i18n.t('game.predicting_that')} ${passerPossessive} **"${
          pass?.claim && i18n.t(`suits.${pass.claim}`)
        }"** ${i18n.t('game.is')} ${prediction ? i18n.t('game.truth') : i18n.t('game.lie')}.`,
        `${i18n.t('game.if_prediction_accurate')}, ${
          isPasser ? `***${i18n.t('lobby.you')}***` : `**${passer?.name}**`
        } ${i18n.t('game.will_take_card')}.`,
        `${i18n.t('game.if_prediction_inaccurate')}, ${
          isActivePlayer ? `***${i18n.t('lobby.you')}***` : `**${activePlayer.name}**`
        } ${i18n.t('game.will_take_card')}.`,
      ].join("\n\n");
    }

    case GamePhase.PASS_SELECTION: {
      const peekMessage = `${activePlayerIs} ${i18n.t('game.peeking_at')} ${passer?.name}${i18n.t('game.possessive')} ${i18n.t('game.claimed')} **"${pass?.claim && i18n.t(`suits.${pass.claim}`)}"**.`;

      const message = `${activePlayerIs} ${
        pass
          ? i18n.t('game.going_to_pick_claim_and_player')
          : String(i18n.t('game.is_going_to_pick'))
      }`;

      return pass ? peekMessage + "\n\n" + message : message;
    }

    case GamePhase.PREDICT_OR_PASS: {
      const passMessage = `${passerHas} ${i18n.t('game.passed')} ${
        isFirstPass ? i18n.t('game.a_card') : i18n.t('game.the_card')
      } ${i18n.t('game.onto')} **${
        isActivePlayer ? `*${i18n.t('lobby.you')}*` : activePlayer.name
      }** ${i18n.t('game.with_claim')} **"${pass?.claim && i18n.t(`suits.${pass.claim}`)}"**.`;

      const peekOrPassMessage = `${activePlayer} ${i18n.t('game.due_to_predict_or_pass')}`;

      const mustPassMessage = `${i18n.t('game.since_all_seen')}, **${
        isActivePlayer ? `*${i18n.t('lobby.you')}*` : activePlayer.name
      }** ${i18n.t('game.must_predict')}`;

      const predictionConsequenceMessage = `${i18n.t('game.if')} ${
        isActivePlayer
          ? `***${i18n.t('lobby.you')}*** ${i18n.t('game.predict')}`
          : `**${activePlayer.name}** ${i18n.t('game.predicts')}`
      } ${i18n.t('game.correctly')}, ${
        isPasser ? `***${i18n.t('lobby.you')}*** ${i18n.t('game.are')}` : `**${passer?.name}** ${i18n.t('game.is')}`
      } ${i18n.t('game.forced_to_take')}. ${i18n.t('game.otherwise')}, ${
        isActivePlayer ? `***${i18n.t('lobby.you')}*** ${i18n.t('game.take')}` : `**${activePlayer.name}** ${i18n.t('game.takes')}`
      } ${i18n.t('game.the_card')}.`;

      return [
        passMessage,
        isFurtherPassPossible ? peekOrPassMessage : mustPassMessage,
        predictionConsequenceMessage,
      ].join("\n\n");
    }
  }
};

// export const pluraliseSuit = (suit: CardSuit): string => {
//   switch (suit) {
//     case CardSuit.BAT
//   }
// }
