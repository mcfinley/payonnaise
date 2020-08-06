let orders = []
let visited = {}
let _id = 0

const findIndex = (c, p) => {
  let result = null

  c.forEach((item, index) => {
    if (p(item, index, c) && result === null) {
      result = index
    }
  })

  return result
}

const walk = (order, path = []) => {
  if (!visited[order.id]) {
    visited[order.id] = true

    orders.filter(({ to }) => to.asset === order.from.asset).forEach((o) => walk(o, path.concat(order)))
  } else {
    const indexToStartFrom = findIndex(path, ({ id }) => id === order.id)
    const ordersThatCanBeExecuted = path.slice(indexToStartFrom)

    // if (ordersThatCanBeExecuted.length > 1) {
      ordersThatCanBeExecuted.forEach((order) => {
        order.price = order.from.amount / order.to.amount
      })

      const overallPriceMultiplier = ordersThatCanBeExecuted.reduce((acc, { price }) => acc * price, 1)

      if (overallPriceMultiplier >= 1) {
        console.log('')
        console.log('Orders can be executed:')
        ordersThatCanBeExecuted.forEach((order) => {
          console.log(`  ${order.from.amount} of ${order.from.asset} -> ${order.to.amount} of ${order.to.asset}`)
        })
        ordersThatCanBeExecuted.forEach(({ id }) => {
          orders = orders.filter((order) => order.id !== id)
        })
      }
    // }
  }
}

const push = (order) => {
  orders.push(order)
  visited = {}
  walk(order)
}

process.stdin.on('data', (data) => {
  const str = data.toString()
  const [from,to] = str.split('/').map((v) => v.trim().split(' '))

  const id = _id++

  push({ id: id, from: { asset: from[1], amount: Number(from[0]) }, to: { asset: to[1], amount: Number(to[0]) }})

  console.log('')
  console.log('Your order is accepted, id = ', id)
  // console.log(from ,to)
})

// push({ id: 1, from: { asset: 'A', amount: 1 }, to: { asset: 'B', amount: 2 }})
// push({ id: 2, from: { asset: 'B', amount: 2 }, to: { asset: 'A', amount: 1 }})
// push({ id: 3, from: { asset: 'C', amount: 1 }, to: { asset: 'A', amount: 1 }})
// push({ id: 4, from: { asset: 'B', amount: 1 }, to: { asset: 'C', amount: 1 }})