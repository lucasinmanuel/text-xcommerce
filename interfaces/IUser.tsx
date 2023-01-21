export default interface IUser {
    id: number,
    shoppingCart: [
        {
            id: number,
            name: string,
            code: string,
            sales: number,
            price: number,
            stock: number,
            overview: string,
        }
    ],
    name: string,
    nickname: string,
    email: string,
    password: string,
}