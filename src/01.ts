import {FileHandle, open} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'

type Elf = number[]

const file = await open(fileURLToPath(new URL('./01.txt', import.meta.url)))
const calories = await fileToCalories(file)
calories.sort((a, b) => b - a)
const top3 = sum(take(calories, 3))
console.log(`top 3 total calories: ${top3}`)

async function fileToCalories(file: FileHandle): Promise<number[]> {
  const elves: Elf[] = []

  let currentElf: Elf = []
  for await (const line of file.readLines()) {
    if (line.length === 0) {
      elves.push(currentElf)
      currentElf = []
      continue
    }

    currentElf.push(parseInt(line, 10))
  }

  if (currentElf.length > 0) {
    elves.push(currentElf)
  }

  return elves.map(sum)
}

function sum(ns: number[]): number {
  return ns.reduce((acc, cur) => acc + cur, 0)
}

function take<T>(array: T[], count: number): T[] {
  const result: T[] = []

  for (let i = 0; i < count; i++) {
    const value = array[i]
    if (value) {
      result.push(value)
    }
  }

  return result
}

if (import.meta.vitest) {
  const {test, expect} = import.meta.vitest

  test('fileToCalories', async () => {
    const lines = ['1000', '', '1000', '1000', '1000', '', '1000', '1000']
    const file = {
      readLines() {
        return lines
      },
    } as any
    expect(await fileToCalories(file)).toEqual([1000, 3000, 2000])
  })

  test('sum', () => {
    expect(sum([])).toBe(0)
    expect(sum([1])).toBe(1)
    expect(sum([1, 2, 3])).toBe(6)
  })

  test('take', () => {
    expect(take([], 1)).toEqual([])
    expect(take(['a', 'b', 'c'], 1)).toEqual(['a'])
    expect(take(['a', 'b', 'c'], 2)).toEqual(['a', 'b'])
    expect(take(['a', 'b', 'c'], 3)).toEqual(['a', 'b', 'c'])
    expect(take(['a', 'b', 'c'], 4)).toEqual(['a', 'b', 'c'])
  })
}
