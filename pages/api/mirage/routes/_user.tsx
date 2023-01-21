import type { Server } from "miragejs"

export function getUsers(server: Server) {
  server.get("/api/users", (schema, request) => {
    let qp = request.queryParams
    let email = qp.email
    let password = qp.password
    let filtered = schema.db.users.filter((user) => {
      return user.email === email && user.password === password;
    })
    return filtered[0]
  })
}

export function getShoppingCart(server: Server) {
  server.get("/api/users/shoppingcart", (schema, request) => {
    let qp = request.queryParams
    let id = parseInt(qp.id)
    let user = schema.db.users.find(id)
    let page = qp.page ? parseInt(qp.page) : 1
    let limit = qp.limit ? parseInt(qp.limit) : 1
    let end = page * limit
    let start = end - limit
    let number_pages = Math.ceil(user.shoppingCart.length / limit)
    let filtered = user.shoppingCart.slice(start, end)
    return {
      page: page,
      limit: limit,
      number_pages: number_pages,
      products: filtered
    }
  })
}

export function postShoppingCart(server: Server) {
  server.post("/api/users/shoppingcart", (schema, request): any => {
    let body = JSON.parse(request.requestBody)
    schema.db.users.update(body.id, body)
  })
}

export function deleteShoppingCart(server: Server) {
  server.delete("/api/users/:userId/shoppingcart/:shoppingCartId", (schema, request): any => {
    let shoppingCarId = request.params.shoppingCartId
    let userId = request.params.userId
    let user = schema.db.users.find(userId)
    user.shoppingCart.forEach((product: { id: string }, index: number) => {
      if (product.id == shoppingCarId) {
        user.shoppingCart.splice(index, 1)
        schema.db.users.update(user.id, user)
      }
    })
  })
}