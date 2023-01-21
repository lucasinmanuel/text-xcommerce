import type { Server } from "miragejs"

export function getProducts(server: Server) {
  server.get("/api/products", (schema, request) => {
    let qp = request.queryParams
    let page = qp.page ? parseInt(qp.page) : 1
    let limit = qp.limit ? parseInt(qp.limit) : 1
    let filter = qp.filter
    let end = page * limit
    let start = end - limit
    let products = schema.db.products
    let number_pages = Math.ceil(products.length / limit)
    let filtered = products.slice(start, end)
    switch (filter) {
      case "top_sellers":
        filtered = products.sort((a, b) => {
          if (a.sales > b.sales) {
            return -1;
          }
          if (a.sales < b.sales) {
            return 1;
          }
          return 0;
        }).slice(start, end)
        return {
          page: page,
          limit: limit,
          number_pages: number_pages,
          products: filtered
        }
      case "search":
        let search = qp.value
        filtered = [];
        for (let i = 0; i < products.length; i++) {
          if (products[i].name.toLowerCase().indexOf(search) > -1) {
            filtered.push(products[i])
          }
        }
        number_pages = Math.ceil(filtered.length / limit)
        return {
          page: page,
          limit: limit,
          number_pages: number_pages,
          products: filtered.slice(start, end)
        }
    }
    return {
      page: page,
      limit: limit,
      number_pages: number_pages,
      products: filtered
    }
  })
}

export function postProducts(server: Server) {
  server.post("/api/products", (schema, request): any => {
    let body = JSON.parse(request.requestBody)
    body.code = Math.random().toString(36).slice(2, 11).toUpperCase()
    body.sales = 0;
    body.price = Number(body.price);
    body.stock = Number(body.stock);
    schema.db.products.firstOrCreate(body)
  })
}
