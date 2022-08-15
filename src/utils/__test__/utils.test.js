import { describe, expect, test } from '@jest/globals'
import {
  calculateDistance,
  flattenObject,
  generateCoordinates,
  generateRandomCoordinates,
  getFewItems,
  getRandomItem,
  limitFloat,
} from '../utils.js'

describe('calculateDistance', () => {
  test('it should calculate distance correctly', () => {
    const input = [50.450001, 30.523333, 50.46313, 30.50719, true]
    expect(calculateDistance(...input)).toBeCloseTo(1853.99)
  })
})

describe('generateRandomCoordinates', () => {
  test('it should generate coordinates', () => {
    const [lat, long] = generateRandomCoordinates()
    expect(lat).toBeLessThanOrEqual(90)
    expect(long).toBeLessThanOrEqual(180)
  })
})

describe('generateCoordinates', () => {
  test('it should generate coordinates in radius', () => {
    const [lat, long] = generateCoordinates(50.450001, 30.523333)
    expect(lat).toBeCloseTo(50.45, 1)
    expect(long).toBeCloseTo(30.52, 1)
  })
})

describe('getRandomItem', () => {
  test('it should return random item', () => {
    expect(getRandomItem(['A', 'B', 'C'])).toEqual(expect.stringMatching(/A|B|C/))
  })
})

describe('getFewItems', () => {
  test('it should return few items', () => {
    expect(getFewItems(['A', 'B', 'C'], 3)).toEqual(['A', 'B', 'C'])
  })
})

describe('limitFloat', () => {
  test('it should return float number with fixed length', () => {
    expect(limitFloat(50.9875522)).toEqual('50.988')
  })
})

describe('flattenObject', () => {
  test('it should return flattened object', () => {
    const input = {
      levelA: {
        levelB: {
          levelC: 0,
        },
      },
    }
    expect(flattenObject(input)).toEqual({ levelA_levelB_levelC: 0 })
  })
})
