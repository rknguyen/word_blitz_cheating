// Generate all available paths on board
// Created by RK Nguyen

class Board {
  words = [];
  board = [];
  boardSize = null;

  listIndex = {};

  dx = [0, 0, 1, -1, -1, -1, 1, 1];
  dy = [-1, 1, 0, 0, -1, 1, -1, 1];
  constructor(letters = '', words = []) {
    this.words = words;
    this.boardSize = Math.sqrt(letters.length);
    let row = [''];
    [...letters, ''].forEach((letter, index) => {
      if (index % 4 === 0 && row.length > 0) {
        this.board.push(row);
        row = [''];
      }
      row.push(letter);
      if (!this.listIndex.hasOwnProperty(letter)) {
        this.listIndex[letter] = [];
      }
      this.listIndex[letter].push(index + 1);
    });
  }

  toCoordinate(n) {
    let x = Math.trunc(n / this.boardSize) + (n % this.boardSize !== 0);
    let y = n - this.boardSize * (x - 1);
    return { x, y };
  }

  inBoard(x, y) {
    return 1 <= x && x <= this.boardSize && 1 <= y && y <= this.boardSize;
  }

  visited = {};
  async findPath(way, word, callback) {
    if (way.length === word.length) {
      return callback(way);
    }

    let at = way.length - 1;
    let { x, y } = this.toCoordinate(way[way.length - 1]);
    for (var i = 0; i < 8; ++i) {
      let u = x + this.dx[i];
      let v = y + this.dy[i];
      let p = (u - 1) * this.boardSize + v;
      if (
        !this.visited.hasOwnProperty(p) &&
        this.inBoard(u, v) &&
        this.board[u][v] === word[at + 1]
      ) {
        this.visited[p] = true;
        let found = await this.findPath([...way, p], word, callback);
        if (found !== false) return true;
        delete this.visited[p];
      }
    }

    return false;
  }

  paths = [];
  async generatePath() {
    for (let word of this.words) {
      for (let index of this.listIndex[word[0]]) {
        this.visited = {};
        this.visited[index] = true;
        let way = await this.findPath([index], word, way => {
          way = way.map(u => u - 1);
          this.paths.push(way.toString());
        });

        if (way === false) continue;
        break;
      }
    }
  }
}

module.exports = Board;
