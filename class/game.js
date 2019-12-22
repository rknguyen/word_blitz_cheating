// Resolve game
// Created by RK Nguyen

const fetch = require('node-fetch');
const chalk = require('chalk');

class Game {
  openGames = [];
  users = [];
  userInfo = {};
  constructor(signature) {
    this.signature = signature;
  }

  async getListGame() {
    let listGames = await fetch(
      `https://api-prod-dot-lotum-wordblitz.appspot.com/v2/game/list?signature=${this.signature}`,
      {
        referrer: 'https://www.messenger.com/',
        method: 'GET'
      }
    );

    const { openGames, users } = await listGames.json();
    this.openGames = openGames;
    this.users = users;
  }

  initUsers() {
    for (let user of this.users) {
      this.userInfo[user.id] = user;
    }
  }

  async initialize() {
    await this.getListGame();
    this.initUsers();
  }

  getOpenGames() {
    for (let game of this.openGames) {
      console.log(
        chalk.cyanBright(
          this.userInfo.hasOwnProperty(game.playerIds[0])
            ? this.userInfo[game.playerIds[0]].name
            : this.userInfo[game.playerIds[1]].name
        )
      );
    }
  }

  async submitSolution(gameId, round, paths) {
    paths = paths.map(path => `paths=${path}`).join('&');
    let status = await fetch(
      `https://api-prod-dot-lotum-wordblitz.appspot.com/v2/game/play?signature=${this.signature}`,
      {
        credentials: 'omit',
        headers: {
          accept: '*/*',
          'accept-language': 'en,en-US;q=0.9,vi;q=0.8',
          'content-type': 'application/x-www-form-urlencoded',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site'
        },
        referrer:
          'https://apps-2211386328877300.apps.fbsbx.com/instant-bundle/1705010946284994/2606609242763696/index.html?version=665&gcgs=1&source=fbinstant-2211386328877300&entry_point=custom_update_xma&IsMobileWeb=0',
        referrerPolicy: 'no-referrer-when-downgrade',
        body: `gameId=${gameId}&${paths}&round=${round}`,
        method: 'POST',
        mode: 'cors'
      }
    );
  }
}

module.exports = Game;
