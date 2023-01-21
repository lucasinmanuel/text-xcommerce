import { useContext } from "react";
import styles from "./TopSellers.module.css"
import { AppContext } from "../../ContextProvider";
import IProduct from "@/interfaces/IProduct";
import { UseQueryResult, useQuery } from "react-query"
import { CardY } from "./Cards";
import Image from "next/image";

export default function TopSellers() {

    const { pages, setPages } = useContext(AppContext)

    const topSellersProducts: UseQueryResult<IProduct, unknown> = useQuery(["top_sellers", pages.top_sellers], () => fetch(`/api/products?filter=top_sellers&page=${pages.top_sellers}&limit=6`, { method: "GET" })
        .then(res => res.json()), { refetchOnWindowFocus: false, keepPreviousData: true })

    function nextPage(direction: string) {
        let topsellers_number_pages: number = topSellersProducts?.data?.number_pages as number;
        if (direction === "next" && pages.top_sellers + 1 <= topsellers_number_pages) {
            setPages({
                general: {
                    all: pages.general.all,
                    favorites: pages.general.favorites,
                    search: pages.general.search,
                    filter: pages.general.filter
                },
                top_sellers: pages.top_sellers + 1
            })
        } else if (direction === "previous" && pages.top_sellers - 1 !== 0) {
            setPages({
                general: {
                    all: pages.general.all,
                    favorites: pages.general.favorites,
                    search: pages.general.search,
                    filter: pages.general.filter
                },
                top_sellers: pages.top_sellers - 1
            })
        }
    }
    return (
        <section className={styles.top_sellers}>
            <div className={styles.next_page}>
                <h2>Mais vendidos</h2>
                <div className={styles.arrow_wrapper}>
                    <button onClick={() => { nextPage("previous") }} className={styles.arrow} type="button">
                        <Image fill alt="Seta para esquerda" src="/arrow-left.png" sizes="100%" />
                    </button>
                    <button onClick={() => { nextPage("next") }} className={styles.arrow} type="button">
                        <Image fill alt="Seta para direita" src="/arrow-right.png" sizes="100%" />
                    </button>
                </div>
            </div>
            <div className={styles.cards_wrapper}>
                {topSellersProducts.isLoading ? (
                    <div>Carregando...</div>
                ) : topSellersProducts.isError ? (
                    <div>Um erro ocorreu</div>
                ) : (
                    topSellersProducts.data?.products?.map((product: { id: number | string, name: string, code: string, price: number, sales: number }) => {
                        return <CardY key={product.id}
                            name={product.name} code={product.code}
                            price={product.price} sales={product.sales}
                        />
                    })
                )}
            </div>
            <p className={styles.footer}>
                Página {topSellersProducts?.data?.page} de {topSellersProducts?.data?.number_pages}
            </p>
        </section>
    )
}