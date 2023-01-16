import { createServer,Model } from 'miragejs'
import { getProducts,postProducts } from './routes/_product'
import { getUsers,getShoppingCart,postShoppingCart,deleteShoppingCart } from './routes/_user'
import listProducts from './Db/_listProducts'
import listUsers from './Db/_listUsers'

export default function createMirageServer(){
    const server = createServer({
      models: {
        user: Model,
        product: Model
      },
      seeds(server){
        for(let i = 0;i < listUsers().length;i++){
          server.schema.db.users.firstOrCreate(listUsers()[i])
        }
        for(let i = 0;i < listProducts().length;i++){
          server.schema.db.products.firstOrCreate(listProducts()[i])
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