import styles from "./ProductManager.module.css"
import { useContext, useState, useEffect } from "react"
import { AppContext } from "../../../ContextProvider"

function ProductManager() {
    const { setAlertNow, selectedBtn } = useContext(AppContext)

    const [visible, setVisible] = useState(false)

    function filterBtn(filter) {
        sessionStorage.setItem("selected_filter", filter)
        switch (filter) {
            case "favorites":
                if (!selectedBtn.favorites) {
                    for (const btn in selectedBtn) {
                        selectedBtn[btn] = false
                    }
                    selectedBtn.favorites = true
                    setAlertNow(Math.random().toString(36))
                }
                break;
            case "all":
                if (!selectedBtn?.all) {
                    for (const btn in selectedBtn) {
                        selectedBtn[btn] = false
                    }
                    selectedBtn.all = true
                    setAlertNow(Math.random().toString(36))
                }
                break;
        }
    }
    function createProduct(submit) {
        submit.preventDefault()
        let data = {}
        for (let i = 0; i < submit.target.length; i++) {
            switch (submit.target[i].name) {
                case "name":
                    data["name"] = submit.target[i].value
                    break;
                case "price":
                    data["price"] = submit.target[i].value
                    break;
                case "stock":
                    data["stock"] = submit.target[i].value
                    break;
                case "overview":
                    data["overview"] = submit.target[i].value
                    break;
            }
        }
        fetch("/api/products", {
            method: "POST",
            body: JSON.stringify(data)
        }).then(() => { setVisible(false), setAlertNow(Math.random().toString(36)) })

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
                    <button onClick={() => { setVisible(true) }} type="button" className={styles.management_btn}>Criar novo</button>
                </div>
                {visible &&
                    <form onSubmit={(submit) => { createProduct(submit) }} method="POST" className={styles.modal}>
                        <input onClick={() => { setVisible(false) }} className={styles.management_btn} type="button" value="Fechar" />
                        <input required type="text" name="name" placeholder="Nome do produto" />
                        <input required type="number" name="price" placeholder="Preço do produto" />
                        <input required type="number" name="stock" placeholder="Estoque do produto" />
                        <textarea required type="text" name="overview" placeholder="Visão geral do produto"></textarea>
                        <input className={styles.management_btn} type="submit" value="Cadastrar" />
                    </form>
                }
            </div>
        </div>
    )
}

export default ProductManager;