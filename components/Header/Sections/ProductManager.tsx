import styles from "./ProductManager.module.css"
import { useContext, useState } from "react"
import { AppContext } from "../../../ContextProvider"
import { useQuery, UseQueryResult, useQueryClient } from "react-query"
import { useRouter } from "next/router"

function ProductManager() {
    const { setTitle, setVisibleModal, selectedBtn, setSelectedBtn, pages, setPages } = useContext(AppContext)

    function filterBtn(filter: string) {
        switch (filter) {
            case "favorites":
                setSelectedBtn({ all: false, favorites: true })
                setPages({
                    general: {
                        all: pages.general.all,
                        favorites: pages.general.favorites,
                        search: pages.general.search,
                        filter: filter
                    }, top_sellers: pages.top_sellers
                })
                setTitle("Todos os produtos favoritos")
                break;
            case "all":
                setSelectedBtn({ all: true, favorites: false })
                setPages({
                    general: {
                        all: pages.general.all,
                        favorites: pages.general.favorites,
                        search: pages.general.search,
                        filter: filter
                    }, top_sellers: pages.top_sellers
                })
                setTitle("Todos os produtos")
                break;
        }
    }
    return (
        <div className={styles.product_manager}>
            <div className={styles.container}>
                <div className={styles.filter_wrapper}>
                    <div>
                        <button onClick={() => { filterBtn("all") }}
                            className={!selectedBtn?.all ? styles.management_btn_disabled : styles.management_btn}>Todas</button>
                        <button onClick={() => { filterBtn("favorites") }}
                            className={!selectedBtn?.favorites ? styles.management_btn_disabled : styles.management_btn}>Favoritos</button>
                    </div>
                    <button onClick={() => { window.scrollTo(0, 0), setVisibleModal(true) }} type="button" className={styles.management_btn}>Criar novo</button>
                </div>
            </div>
        </div>
    )
}

export default ProductManager;