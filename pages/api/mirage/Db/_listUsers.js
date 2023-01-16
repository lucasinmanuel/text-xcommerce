export default function listUsers(){
    return (
        [
            {
                id: 1,
                shoppingCart: [
                    {
                        id: '1',
                        name: "Tech Pixel, Full Hd, não há câmera melhor no mercado!",
                        code: "HSY273284",
                        sales: 10,
                        price: 1000,
                        stock: 2,
                        overview: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus culpa nihil enim beatae quis. A ullam veritatis, quo esse minima quos fugit blanditiis asperiores quae, consequatur voluptate inventore, odio maiores."
                    }
                ],
                name: "Lucas Emanuel Santana Dos Santos",
                nickname: "lucasinmanuel",
                email: "lucasemanuel2077@gmail.com",
                password: "123",
            },
            {
                id: 2,
                shoppingCart: [],
                name: "nome",
                nickname: "apelido",
                email: "email",
                password: "123",
            },
        ]
    )
}