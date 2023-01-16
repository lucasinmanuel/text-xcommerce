import styles from "./Cards.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../../ContextProvider";

export function CardY({ price, code, name, sales }) {
    return (
        <div className={styles.single_cardY}>
            <div className={styles.image_product} id={code}>
                <Image fill sizes="100%" alt="Imagem de placeholder para o produto" src="/placeholder-product.png" />
            </div>
            <div className={styles.info_product}>
                <p>
                    <span>{price.toLocaleString("pt-br", { style: 'currency', currency: 'BRL' })}</span>
                    <span>{sales} vendas</span>
                </p>
                <p>{name?.length > 28 ? name?.substring(0, 28) + " (...)" : name}</p>
            </div>
        </div>
    )
}

export function CardX({ price, code, name, sales, stock, favorited }) {
    const { allProducts, user, setAlertNow } = useContext(AppContext)
    const [imgSrc, setImgSrc] = useState("/icons/heart-vector.png")

    useEffect(() => {
        if (favorited) {
            setImgSrc("/icons/filled-heart-vector.png")
        } else {
            setImgSrc("/icons/heart-vector.png")
        }
    }, [favorited])

    function addShoppingCart(code) {
        if (imgSrc.includes("filled")) {
            setImgSrc("/icons/heart-vector.png")
            let filtered = allProducts?.data?.filter((product) => {
                return product.code === code
            })
            fetch(`/api/users/${user.id}/shoppingcart/${filtered[0].id}`, {
                method: "DELETE",
            })
            sessionStorage.setItem("removed_shoppingcart", "true")
            setAlertNow(Math.random().toString(36))
        } else {
            setImgSrc("/icons/filled-heart-vector.png")
            let filtered = allProducts?.data?.filter((product) => {
                return product.code === code
            })
            user.shoppingCart.push(filtered[0])
            fetch("/api/users/shoppingcart", {
                method: "POST",
                body: JSON.stringify(user)
            })
        }
    }
    return (
        <tr>
            <td className={styles.single_cardX} id={code}>
                <div>
                    <div className={styles.image_product}>
                        <Image fill sizes="100%" alt="Imagem de placeholder para o produto" src="/placeholder-product.png" />
                    </div>
                    <div className={styles.info_product}>
                        <p>{name?.length > 40 ? name?.substring(0, 40) + " (...)" : name}</p>
                        <span>#{code}</span>
                    </div>
                </div>
            </td>
            <td className={styles.single_cardX}>
                <span>{price?.toLocaleString("pt-br", { style: 'currency', currency: 'BRL' })}</span>
            </td>
            <td className={styles.single_cardX}>
                <span>
                    <b>Total de {(price * sales)?.toLocaleString("pt-br", { currency: 'BRL' })}</b>
                    <br />
                    {sales} vendas
                </span>
            </td>
            <td className={styles.single_cardX}>
                <span>{stock} und</span>
            </td>
            <td className={styles.single_cardX}>
                <div onClick={() => { addShoppingCart(code) }} className={styles.heart_icon}>
                    <Image fill sizes="100%" alt="Ícone de coração" src={imgSrc} />
                </div>
            </td>
        </tr>
    )
}
