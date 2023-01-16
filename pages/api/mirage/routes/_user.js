import listUsers from "../Db/_listUsers"

export function getUsers(server){
    server.get("/api/users", (schema,request) => {
      let qp = request.queryParams
      let email = qp.email
      let password = qp.password
      let filtered = schema.db.users.filter((user)=>{
        return user.email === email && user.password === password;
      })
      if(filtered.length !== 0){
        return {login:true,data: filtered[0]}
      }else{
        return {login:false}
      }
    })
}

export function getShoppingCart(server){
  server.get("/api/users/shoppingcart", (schema,request) => {
    let qp = request.queryParams
    let id = parseInt(qp.id)
    let user = schema.db.users.find(id)
    let page = qp.page ? parseInt(qp.page) : 1
    let limit = qp.limit ? parseInt(qp.limit) : 1
    let end =  page * limit
    let start = end - limit
    let number_pages = Math.ceil(user.shoppingCart.length / limit)
    let filtered = user.shoppingCart.slice(start,end)
    return {
      page: page,
      limit: limit,
      number_pages: number_pages,
      data: filtered
    }
  })
}

export function postShoppingCart(server){
  server.post("/api/users/shoppingcart", (schema,request) => {
    let body = JSON.parse(request.requestBody)
    schema.db.users.update(body.id,body)
  })
}

export function deleteShoppingCart(server){
  server.delete("/api/users/:userid/shoppingcart/:id", (schema,request) => {
    let id = request.params.id
    let userId = request.params.userid
    let user = schema.db.users.find(userId)
    user.shoppingCart.forEach((product,index)=>{
      if(product.id == id){
        user.shoppingCart.splice(index,1)
      }
    })
  })
}