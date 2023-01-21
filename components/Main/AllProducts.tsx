import Image from "next/image";
import styles from "./AllProducts.module.css";
import { CardX } from "./Cards";
import { useContext } from "react";
import { AppContext } from "../../ContextProvider";
import { UseQueryResult, useQuery, useQueryClient } from "react-query";
import IProduct from "@/interfaces/IProduct";
import IUser from "@/interfaces/IUser";

export default function AllProducts({ user }: { user: IUser }) {
    const { pages, setPages, title, searchValue } = useContext(AppContext)

    const allProducts: UseQueryResult<IProduct, unknown> = useQuery(["all", pages.general.all],
        () => fetch(`/api/products?filter=all&page=${pages.general.all}&limit=5`, { method: "GET" })
            .then(res => res.json()), { refetchOnWindowFocus: false, keepPreviousData: true })

    const favoritesProducts: UseQueryResult<IProduct, unknown> = useQuery(["favorites", pages.general.favorites],
        () => fetch(`/api/users/shoppingcart?id=${user?.id}&page=${pages.general.favorites}&limit=5`, { method: "GET" })
            .then(res => res.json()), { refetchOnWindowFocus: false, enabled: !!user })

    const searchProducts: UseQueryResult<IProduct, unknown> = useQuery(["search", searchValue, pages.general.search], () =>
        fetch(`/api/products?filter=search&value=${searchValue}&page=${pages.general.search}&limit=5`, { method: "GET" })
            .then(res => res.json()), { refetchOnWindowFocus: false, keepPreviousData: true })

    function nextPage(filter: string, direction: string) {

        let lastPage = 2;
        let indexPage = 1;
        let nextPage;
        let previousPage;
        switch (filter) {
            default:
                lastPage = allProducts?.data?.number_pages as number;
                indexPage = pages.general.all
                nextPage = {
                    all: pages.general.all + 1,
                    favorites: pages.general.favorites,
                    search: pages.general.search,
                    filter: filter
                }
                previousPage = {
                    all: pages.general.all - 1,
                    favorites: pages.general.favorites,
                    search: pages.general.search,
                    filter: filter
                }
                break;
            case "favorites":
                lastPage = favoritesProducts?.data?.number_pages as number;
                indexPage = pages.general.favorites
                nextPage = {
                    all: pages.general.all,
                    favorites: pages.general.favorites + 1,
                    search: pages.general.search,
                    filter: filter
                }
                previousPage = {
                    all: pages.general.all,
                    favorites: pages.general.favorites - 1,
                    search: pages.general.search,
                    filter: filter
                }
                break;
            case "search":
                lastPage = searchProducts?.data?.number_pages as number;
                indexPage = pages.general.search
                nextPage = {
                    all: pages.general.all,
                    favorites: pages.general.favorites,
                    search: pages.general.search + 1,
                    filter: filter
                }
                previousPage = {
                    all: pages.general.all,
                    favorites: pages.general.favorites,
                    search: pages.general.search - 1,
                    filter: filter
                }
                break;
        }

        if (direction === "next" && indexPage + 1 <= lastPage) {
            setPages({
                general: nextPage,
                top_sellers: pages.top_sellers
            })
        } else if (direction === "previous" && indexPage - 1 !== 0) {
            setPages({
                general: previousPage,
                top_sellers: pages.top_sellers
            })
        }
    }

    function checkFavorites(product: any) {
        let shoppingCart = user?.shoppingCart
        let favorited = false
        if (shoppingCart) {
            for (let i = 0; i < shoppingCart.length; i++) {
                if (product.code === shoppingCart[i]?.code) {
                    favorited = true
                }
            }
        }
        return favorited;
    }
    return (
        <section className={styles.general_products}>
            <div className={styles.next_page}>
                <h2>{title}</h2>
                <div className={styles.arrow_wrapper}>
                    <button onClick={() => { nextPage(pages.general.filter, "previous") }} className={styles.arrow} type="button">
                        <Image fill alt="Seta para esquerda" src="/arrow-left.png" sizes="100%" />
                    </button>
                    <button onClick={() => { nextPage(pages.general.filter, "next") }} className={styles.arrow} type="button">
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
                            allProducts.isLoading || favoritesProducts.isLoading ? (
                                <tr><td>Carregando...</td></tr>
                            ) : allProducts.isError || favoritesProducts.isError ? (
                                <tr><td>Um erro ocorreu</td></tr>
                            ) : pages.general.filter === "all" ? (
                                allProducts.data?.products?.map((product) => {
                                    return <CardX key={product.id}
                                        name={product?.name} code={product?.code}
                                        price={product?.price} sales={product?.sales}
                                        stock={product?.stock} favorited={checkFavorites(product)}
                                    />

                                })
                            ) : pages.general.filter === "favorites" ? (
                                favoritesProducts.data?.products?.map((product) => {
                                    return <CardX key={product?.id}
                                        name={product?.name} code={product?.code}
                                        price={product?.price} sales={product?.sales}
                                        stock={product?.stock} favorited={checkFavorites(product)
                                        }
                                    />
                                })
                            ) : pages.general.filter === "search" && (
                                searchProducts?.data?.products?.map((product) => {
                                    return <CardX key={product.id}
                                        name={product?.name} code={product?.code}
                                        price={product?.price} sales={product?.sales}
                                        stock={product?.stock} favorited={checkFavorites(product)}
                                    />
                                })
                            )

                        }
                    </tbody>
                </table>
            </div>
            {
                pages.general.filter === "all" ? (
                    <p className={styles.footer}>
                        Página {allProducts?.data?.page} de {allProducts?.data?.number_pages}
                    </p>
                ) : pages.general.filter === "favorites" ? (
                    <p className={styles.footer}>
                        Página {favoritesProducts?.data?.page} de {favoritesProducts?.data?.number_pages}
                    </p>
                ) : pages.general.filter === "search" && (
                    <p className={styles.footer}>
                        Página {searchProducts?.data?.page} de {searchProducts?.data?.number_pages}
                    </p>
                )
            }

        </section>
    )
}