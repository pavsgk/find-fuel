import { dbParser, filterByField } from '../parsers'

describe('dbParser', () => {
  test('it should parse array of objects and show unique values', () => {
    const input = [
      {
        fieldA: 'string 1',
        fieldB: 'string 2',
      },
      {
        fieldA: 'string 2',
        fieldB: 'string 3',
      },
      {
        fieldA: 'string 1',
        fieldB: 'string 3',
      },
    ]
    const result = {
      fieldA: ['string 1', 'string 2'],
      fieldB: ['string 2', 'string 3'],
    }
    expect(dbParser(input)).toStrictEqual(result)
  })
})

describe('filterByField', () => {
  test('it should filter object arrays by values in fields', () => {
    const input = [
      {
        name: 'OKKO',
        address: 'Nyzhnii val',
      },
      {
        name: 'BRSM',
        address: 'Horodotska',
      },
      {
        name: 'BP',
        address: 'Trokhsviatytelska',
      },
    ]
    const result = [
      {
        name: 'OKKO',
        address: 'Nyzhnii val',
      },
      {
        name: 'BRSM',
        address: 'Horodotska',
      },
    ]
    expect(filterByField(input, 'name', ['OKKO', 'BRSM'])).toStrictEqual(result)
  })
})
