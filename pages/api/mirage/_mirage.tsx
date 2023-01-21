import { createServer, Model } from 'miragejs'
import { getProducts, postProducts } from './routes/_product'
import { getUsers, postShoppingCart, deleteShoppingCart, getShoppingCart } from './routes/_user'
import listProducts from './Db/_listProducts'
import listUsers from './Db/_listUsers'
import { afterEach } from 'node:test'

export default function createMirageServer({ environment = "test" }) {
  const server = createServer({
    environment,
    models: {
      user: Model,
      product: Model
    },
    seeds(server) {
      for (let i = 0; i < listUsers().length; i++) {
        server.schema.db.users.insert(listUsers()[i])
      }
      for (let i = 0; i < listProducts().length; i++) {
        server.schema.db.products.insert(listProducts()[i])
      }
    },
    routes() {
      getProducts(this)
      postProducts(this)
      getUsers(this)
      getShoppingCart(this)
      postShoppingCart(this)
      deleteShoppingCart(this)
    },
  })
}