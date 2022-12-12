import {FileHandle, open} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'

type Elf = number[]

const file = await open(fileURLToPath(new URL('./01.txt', import.meta.url)))
const calories = await fileToCalories(file)
const maxCalories = Math.max(...calories)

console.log(`max calories: ${maxCalories}`)

async function fileToCalories(file: FileHandle): Promise<number[]> {
  const elves: Elf[] = []

  let currentElf: Elf = []
  for await (const line of file.readLines()) {
    console.log(line)
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
}
