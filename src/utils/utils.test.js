import {describe, expect, test} from '@jest/globals'
import { calculateDistance } from './utils';

describe('calculateDistance function', () => {
  test('it should calculate distance correctly', () => {
    const input = [50.450001, 30.523333, 50.46313, 30.50719, true];
    expect(calculateDistance(...input)).toEqual(1853.9923957730382);
  })
})