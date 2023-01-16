import Image from "next/image";
import styles from "./SearchBar.module.css"
import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../../../ContextProvider";

function SearchBar() {
    const { setAlertNow, setSelectedBtn } = useContext(AppContext)
    const [searchValue, setSearchValue] = useState("")
    function productSearch(clear) {
        setSelectedBtn({
            all: true,
            favorites: false,
        })
        if (clear) {
            sessionStorage.setItem("selected_filter", "all")
            sessionStorage.setItem("search_value", "")
        } else {
            sessionStorage.setItem("selected_filter", "search")
            sessionStorage.setItem("search_value", searchValue)
        }
        setAlertNow(Math.random().toString(36))
    }
    return (
        <div className={styles.search_section}>
            <div className={styles.container}>
                <h1>Produtos</h1>
                <div className={styles.search}>
                    <div onClick={() => { productSearch() }} className={styles.search_icon}>
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