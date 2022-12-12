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
  X: Outcome.Lose,
  Y: Outcome.Draw,
  Z: Outcome.Win,
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

function round(opponent: Play, outcome: Outcome): number {
  const play = getPlayCausingOutcome(opponent, outcome)
  return outcome + play
}

function getPlayCausingOutcome(opponent: Play, outcome: Outcome): Play {
  switch (outcome) {
    case Outcome.Draw:
      return opponent
    case Outcome.Win:
      switch (opponent) {
        case Play.Paper:
          return Play.Scissors
        case Play.Rock:
          return Play.Paper
        case Play.Scissors:
          return Play.Rock
      }
    case Outcome.Lose:
      switch (opponent) {
        case Play.Paper:
          return Play.Rock
        case Play.Rock:
          return Play.Scissors
        case Play.Scissors:
          return Play.Paper
      }
  }
}

if (import.meta.vitest) {
  const {describe, test, expect} = import.meta.vitest

  describe('getPlayCausingOutcome', () => {
    test.each<[opponent: Play, outcome: Outcome, expected: Play]>([
      [Play.Rock, Outcome.Draw, Play.Rock],
      [Play.Rock, Outcome.Win, Play.Paper],
      [Play.Rock, Outcome.Lose, Play.Scissors],
      [Play.Paper, Outcome.Draw, Play.Paper],
      [Play.Paper, Outcome.Win, Play.Scissors],
      [Play.Paper, Outcome.Lose, Play.Rock],
      [Play.Scissors, Outcome.Draw, Play.Scissors],
      [Play.Scissors, Outcome.Win, Play.Rock],
      [Play.Scissors, Outcome.Lose, Play.Paper],
    ])('%s -> %s (%s)', (opponent, outcome, expected) => {
      expect(getPlayCausingOutcome(opponent, outcome)).toEqual(expected)
    })
  })
}
