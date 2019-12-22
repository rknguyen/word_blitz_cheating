// Initial player's credentials
// Run this script on browser, Messenger
// Created by RK Nguyen

const WORDBLITZ_APP_ID = '2211386328877300';
const GET_SIGNED_INFO_DOC_ID = '1609924195693669';

class Player {
  player_id = null;
  signature = null;
  constructor() {
    this.fb_dtsg = require('DTSGInitialData').token;
    this.user_id = require('CurrentUserInitialData').USER_ID;
  }

  async getSignedPlayerInfo() {
    let body = new URLSearchParams();
    body.append('__a', 1);
    body.append('av', this.user_id);
    body.append('__user', this.user_id);
    body.append('fb_dtsg', this.fb_dtsg);
    body.append(
      'variables',
      JSON.stringify({
        input: {
          client_mutation_id: new Date().getTime(),
          actor_id: this.user_id,
          game_id: WORDBLITZ_APP_ID,
          request_payload: null
        }
      })
    );
    body.append('doc_id', GET_SIGNED_INFO_DOC_ID);

    const { playerID, signedRequest } = await fetch(
      'https://www.messenger.com/api/graphql/',
      {
        credentials: 'include',
        headers: {
          accept: '*/*',
          'accept-language': 'en,en-US;q=0.9,vi;q=0.8',
          'content-type': 'application/x-www-form-urlencoded',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin'
        },
        referrer: window.location.href,
        referrerPolicy: 'origin-when-cross-origin',
        body: body.toString(),
        method: 'POST',
        mode: 'cors'
      }
    )
      .then(data => data.json())
      .then(signedInfo => signedInfo.data.signedPlayerInfo);

    this.player_id = playerID;
    this.signature = signedRequest;
  }
}

(async () => {
  const me = new Player();
  await me.getSignedPlayerInfo();
  console.log(`Your credentials are: ${me.signature}`);
})();
