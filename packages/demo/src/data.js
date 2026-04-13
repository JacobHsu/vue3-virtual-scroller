import { faker } from '@faker-js/faker'

let uid = 0

function generateItem() {
  const name = faker.name.fullName()
  return {
    name,
    avatar: `https://i.pravatar.cc/50?u=${encodeURIComponent(name)}`,
  }
}

export function getData(count, letters) {
  const raw = {}

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

  for (const l of alphabet) {
    raw[l] = []
  }

  for (let i = 0; i < count; i++) {
    const item = generateItem()
    const letter = item.name.charAt(0).toLowerCase()
    raw[letter].push(item)
  }

  const list = []
  let index = 1

  for (const l of alphabet) {
    raw[l] = raw[l].sort((a, b) => a.name < b.name ? -1 : 1)
    if (letters) {
      list.push({
        id: uid++,
        index: index++,
        type: 'letter',
        value: l,
        height: 200,
      })
    }
    for (const item of raw[l]) {
      list.push({
        id: uid++,
        index: index++,
        type: 'person',
        value: item,
        height: 50,
      })
    }
  }

  return list
}

export function addItem(list) {
  list.push({
    id: uid++,
    index: list.length + 1,
    type: 'person',
    value: generateItem(),
    height: 50,
  })
}

export function generateMessage() {
  const name = faker.name.fullName()
  return {
    avatar: `https://i.pravatar.cc/50?u=${encodeURIComponent(name)}`,
    message: faker.lorem.text(),
  }
}
