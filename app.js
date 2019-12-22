// This script write to cheat Word Blitz
// Created by RK Nguyen

const chalk = require('chalk');
const inquirer = require('inquirer');

const Game = require('./class/game');
const Board = require('./class/board');

async function bootstrap() {
  const { signature } = await inquirer.prompt([
    {
      type: 'input',
      name: 'signature',
      message: 'Nhập signature'
    }
  ]);

  const WordBlitz = new Game(signature);
  await WordBlitz.initialize();
  let openGames = WordBlitz.openGames;

  openGames = openGames.map(game => {
    let [me, enemy] = game.playerIds;
    if (WordBlitz.userInfo.hasOwnProperty(me)) {
      [me, enemy] = [enemy, me];
    }

    let myTurn = true;
    let roundNum = null;
    for (let [index, round] of game.rounds.entries()) {
      if (Object.keys(round.foundPaths).length === 2) continue;
      if (round.foundPaths.hasOwnProperty(me)) {
        myTurn = false;
      }
      roundNum = index + 1;
      break;
    }
    return {
      ...game,
      extends: {
        me,
        roundNum,
        enemy: WordBlitz.userInfo.hasOwnProperty(enemy)
          ? WordBlitz.userInfo[enemy]
          : { name: 'Không xác định' },
        myTurn
      }
    };
  });

  openGames = openGames.filter(game => game.extends.myTurn);
  const { game } = await inquirer.prompt([
    {
      type: 'list',
      name: 'game',
      message: 'Chọn ván game đang mở',
      choices: openGames.map(game => {
        return {
          name: `Chơi với ${game.extends.enemy.name} - Vòng ${game.extends.roundNum}`,
          value: game
        };
      })
    }
  ]);

  const currentRound = game.rounds[game.extends.roundNum - 1];
  const board = new Board(currentRound.board.letters, currentRound.board.words);
  await board.generatePath();

  await WordBlitz.submitSolution(
    game.id,
    game.extends.roundNum - 1,
    board.paths
  );
  console.log(
    chalk.cyanBright(
      `Đã chơi xong vòng ${game.extends.roundNum} với ${game.extends.enemy.name}!`
    )
  );
}

bootstrap();
