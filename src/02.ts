import {open} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'

enum Play {
  Rock = 1,
  Paper = 2,
  Scissors = 3,
}

enum Outcome {
  Lose = 0,
  Draw = 3,
  Win = 6,
}

const StrategyGuidePlay = {
  A: Play.Rock,
  B: Play.Paper,
  C: Play.Scissors,
  X: Play.Rock,
  Y: Play.Paper,
  Z: Play.Scissors,
}

const file = await open(fileURLToPath(new URL('./02.txt', import.meta.url)))

const results: number[] = []

for await (const line of file.readLines()) {
  const [opponent, , player] = line
  const result = round(
    StrategyGuidePlay[opponent as 'A' | 'C' | 'C'],
    StrategyGuidePlay[player as 'X' | 'Y' | 'Z'],
  )
  results.push(result)
}

const score = results.reduce((acc, cur) => acc + cur, 0)
console.log(`score: ${score}`)

function outcome(opponent: Play, player: Play): number {
  switch (true) {
    case opponent === player:
      return Outcome.Draw
    case isRock(opponent) && isPaper(player):
    case isPaper(opponent) && isScissors(player):
    case isScissors(opponent) && isRock(player):
      return Outcome.Win
    default:
      return Outcome.Lose
  }
}

function round(opponent: Play, player: Play): number {
  return outcome(opponent, player) + player
}

function isRock(play: Play): play is Play.Rock {
  return play === Play.Rock
}
function isPaper(play: Play): play is Play.Paper {
  return play === Play.Paper
}
function isScissors(play: Play): play is Play.Scissors {
  return play === Play.Scissors
}

if (import.meta.vitest) {
  const {describe, test, expect} = import.meta.vitest

  describe('round', () => {
    test.each<[opponent: Play, player: Play, expected: number]>([
      [Play.Paper, Play.Paper, 5],
      [Play.Paper, Play.Rock, 1],
      [Play.Paper, Play.Scissors, 9],
      [Play.Rock, Play.Paper, 8],
      [Play.Rock, Play.Rock, 4],
      [Play.Rock, Play.Scissors, 3],
      [Play.Scissors, Play.Paper, 2],
      [Play.Scissors, Play.Rock, 7],
      [Play.Scissors, Play.Scissors, 6],
    ])('%s <-> %s', (opponent, player, expected) => {
      expect(round(opponent, player)).toEqual(expected)
    })
  })
}
