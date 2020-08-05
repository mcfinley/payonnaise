let orders = []
let visited = {}

const walk = (order, path = []) => {
  if (!visited[order.id]) {
    visited[order.id] = true

    orders.filter(({ to }) => to.asset === order.from.asset).forEach((o) => walk(o, path.concat(order)))
  } else {
    console.log('Orders can be executed', path)
  }
}

const push = (order) => {
  orders.push(order)
  visited = {}
  walk(order)
}

push({ id: 1, from: { asset: 'A', amount: 1 }, to: { asset: 'B', amount: 1 }})
push({ id: 2, from: { asset: 'B', amount: 1 }, to: { asset: 'A', amount: 1 }})
push({ id: 3, from: { asset: 'C', amount: 1 }, to: { asset: 'A', amount: 1 }})
push({ id: 4, from: { asset: 'B', amount: 1 }, to: { asset: 'C', amount: 1 }})