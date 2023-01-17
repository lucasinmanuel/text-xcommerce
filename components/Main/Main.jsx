import Image from "next/image";
import styles from "./Main.module.css";
import { useEffect, useState } from "react";
import { CardX, CardY } from "./Cards";
import { useContext } from "react";
import { AppContext } from "../../ContextProvider";

function Main({ font }) {
    const {
        alertNow, setAlertNow,
        user, setUser,
        allProducts, setAllProducts,
        topSellersProducts, setTopSellersProducts
    } = useContext(AppContext)

    const [title, setTitle] = useState("Todos os produtos")

    useEffect(() => {
        sessionStorage.setItem("selected_filter", "all")
        login("lucasemanuel2077@gmail.com", "123", true)
        sessionStorage.setItem("search", JSON.stringify({ page: 1, limit: 5 }))
        sessionStorage.setItem("favorites", JSON.stringify({ page: 1, limit: 5 }))
        sessionStorage.setItem("all", JSON.stringify({ page: 1, limit: 5 }))
        getProducts(1, 6, "top_sellers");
    }, [])

    useEffect(() => {
        let selected_filter = sessionStorage.getItem("selected_filter")
        let infoPage = JSON.parse(sessionStorage.getItem(selected_filter))
        let page = Number(infoPage.page);
        let limit = Number(infoPage.limit);
        getProducts(page, limit, selected_filter)

        let removedShoppingCart = Boolean(sessionStorage.getItem("removed_shoppingcart"))
        if (removedShoppingCart) {
            sessionStorage.setItem("removed_shoppingcart", "false")
            login("lucasemanuel2077@gmail.com", "123", false)
        }
    }, [alertNow])

    function login(email, password, alertNow) {
        fetch(`/api/users?email=${email}&password=${password}`, { method: "GET" })
            .then(response => response.json())
            .then((json) => {
                setUser(json.data)
                if (alertNow) {
                    setAlertNow(Math.random().toString(36))
                }
            })
    }

    function getProducts(page, limit, filter) {
        let url;
        switch (filter) {
            case "favorites":
                url = `/api/users/shoppingcart?id=${user.id}`
                break;
            case "search":
                let searchValue = sessionStorage.getItem("search_value")
                url = `/api/products?filter=${filter}&value=${searchValue}`;
                break;
            default:
                url = `/api/products?filter=${filter}`;
                break;
        }
        fetch(`${url}&page=${page}&limit=${limit}`, { method: "GET" })
            .then((res) => res.json())
            .then((json) => {
                switch (filter) {
                    case "favorites":
                        json.data.forEach((product) => { product.favorited = true })
                        setAllProducts(json)
                        setTitle("Todos os produtos favoritos")
                        break;
                    case "all":
                        json.data.forEach((product) => {
                            product.favorited = false;
                            for (let i = 0; i < user?.shoppingCart?.length; i++) {
                                if (product.code === user.shoppingCart[i].code) {
                                    product.favorited = true;
                                }
                            }
                        })
                        setAllProducts(json)
                        setTitle("Todos os produtos")
                        break;
                    case "top_sellers":
                        setTopSellersProducts(json)
                        break;
                    case "search":
                        json.data.forEach((product) => {
                            product.favorited = false;
                            for (let i = 0; i < user?.shoppingCart?.length; i++) {
                                if (product.code === user.shoppingCart[i].code) {
                                    product.favorited = true;
                                }
                            }
                        })
                        setAllProducts(json)
                        setTitle("Todos os produtos: " + sessionStorage.getItem("search_value"))
                        break;
                }
                sessionStorage.setItem(filter, JSON.stringify({
                    page: page, limit: limit, number_pages: json.number_pages
                }))
            })
    }

    function nextPage(filter, direction) {
        let infoPage = JSON.parse(sessionStorage.getItem(filter))
        let page = Number(infoPage.page);
        let limit = Number(infoPage.limit);
        let number_pages = Number(infoPage.number_pages);
        if (direction === "next" && page + 1 <= number_pages) {
            getProducts(page + 1, limit, filter)
        } else if (direction === "previous" && page - 1 !== 0) {
            getProducts(page - 1, limit, filter)
        }
    }

    return (
        <main className={font}>
            <div className={styles.container}>
                <section className={styles.top_sellers}>
                    <div className={styles.next_page}>
                        <h2>Mais vendidos</h2>
                        <div className={styles.arrow_wrapper}>
                            <button onClick={() => { nextPage("top_sellers", "previous") }} className={styles.arrow} type="button">
                                <Image fill alt="Seta para esquerda" src="/arrow-left.png" sizes="100%" />
                            </button>
                            <button onClick={() => { nextPage("top_sellers", "next") }} className={styles.arrow} type="button">
                                <Image fill alt="Seta para direita" src="/arrow-right.png" sizes="100%" />
                            </button>
                        </div>
                    </div>
                    <div className={styles.cards_wrapper}>
                        {
                            topSellersProducts?.data?.map((product) => {
                                return <CardY key={product.id}
                                    name={product.name} code={product.code}
                                    price={product.price} sales={product.sales}
                                    stock={product.stock}
                                />
                            })
                        }
                    </div>
                    <p className={styles.footer}>
                        Página {topSellersProducts?.page} de {topSellersProducts?.number_pages}
                    </p>
                </section>
                <section className={styles.all_products}>
                    <div className={styles.next_page}>
                        <h2>{title}</h2>
                        <div className={styles.arrow_wrapper}>
                            <button onClick={() => { nextPage(sessionStorage.getItem("selected_filter"), "previous") }} className={styles.arrow} type="button">
                                <Image fill alt="Seta para esquerda" src="/arrow-left.png" sizes="100%" />
                            </button>
                            <button onClick={() => { nextPage(sessionStorage.getItem("selected_filter"), "next") }} className={styles.arrow} type="button">
                                <Image fill alt="Seta para direita" src="/arrow-right.png" sizes="100%" />
                            </button>
                        </div>
                    </div>
                    <div className={styles.responsive_table}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Identificação</th>
                                    <th>Preço</th>
                                    <th>Vendas</th>
                                    <th>Estoque</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allProducts?.data?.map((product) => {
                                        return <CardX key={product.id}
                                            name={product.name} code={product.code}
                                            price={product.price} sales={product.sales}
                                            stock={product.stock} favorited={product?.favorited}
                                        />
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <p className={styles.footer}>
                        Página {allProducts?.page} de {allProducts?.number_pages}
                    </p>
                </section>
            </div>
        </main>
    )
}

export default Main;