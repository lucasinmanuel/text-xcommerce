import Image from "next/image";
import styles from "./SearchBar.module.css"
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query"
import { useContext } from "react";
import { AppContext } from "../../../ContextProvider";

function SearchBar() {
    const { setTitle, pages, setPages, setSelectedBtn, searchValue, setSearchValue } = useContext(AppContext)

    const queryClient = useQueryClient()

    function productSearch(clearResult: boolean) {
        setSelectedBtn({ all: false, favorites: false })
        if (!clearResult) {
            setPages({
                general: {
                    all: pages.general.all,
                    favorites: pages.general.favorites,
                    search: 1,
                    filter: "search"
                },
                top_sellers: pages.top_sellers
            })
            queryClient.fetchQuery(["search", pages.general.search])
            setTitle("Todos os produtos: " + searchValue)
        } else {
            setPages({
                general: {
                    all: pages.general.all,
                    favorites: pages.general.favorites,
                    search: pages.general.search,
                    filter: "all"
                },
                top_sellers: pages.top_sellers
            })
            setTitle("Todos os produtos")
        }
    }
    return (
        <div className={styles.search_section}>
            <div className={styles.container}>
                <h1>Produtos</h1>
                <div className={styles.search}>
                    <div onClick={() => { productSearch(false) }} className={styles.search_icon}>
                        <Image alt="Ícone de pesquisa" src="/icons/search-icon.png" fill sizes="100%" />
                    </div>
                    <input onKeyDown={(event) => {
                        if (event.key === "Backspace" && searchValue.length <= 1) {
                            productSearch(true)
                        }
                        if (event.key === "Enter") { productSearch(false) }
                    }} onChange={(search) => { setSearchValue(search.target.value) }} size={50} type="text" placeholder="Buscar por produtos" />
                </div>
            </div>
        </div>
    )
}

export default SearchBar;