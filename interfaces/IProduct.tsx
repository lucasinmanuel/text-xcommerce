export default interface IProduct {
    page: number,
    limit: number,
    number_pages: number,
    products: [{
        id: number,
        name: string,
        code: string,
        sales: number,
        price: number,
        stock: number,
        overview: string,
    }]
}
