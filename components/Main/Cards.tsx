import styles from "./Cards.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../../ContextProvider";
import { useQueryClient, useMutation } from "react-query";
import IUser from "@/interfaces/IUser";
import IProduct from "@/interfaces/IProduct";

interface ICardY {
    price: number, code: string, name: string, sales: number
}

export function CardY({ price, code, name, sales }: ICardY) {
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

interface ICardX {
    price: number, code: string, name: string, sales: number, stock: number, favorited: boolean
}

export function CardX({ price, code, name, sales, stock, favorited }: ICardX) {
    const { pages } = useContext(AppContext)

    const queryClient = useQueryClient()

    const [imgSrc, setImgSrc] = useState("/icons/heart-vector.png")
    const addShoppingCart = useMutation("addShoppingCart", (newUser: IUser) =>
        fetch("/api/users/shoppingcart", {
            method: "POST",
            body: JSON.stringify(newUser)
        }).then(() => { queryClient.refetchQueries(["favorites"], { active: true }) }))

    const removeShoppingCart = useMutation("removeShoppingCart", ({
        userId, shoppingCartId }: { userId: number | string, shoppingCartId: number | string }) =>
        fetch(`/api/users/${userId}/shoppingcart/${shoppingCartId}`, {
            method: "DELETE",
        }).then(() => {
            queryClient.refetchQueries(["favorites"], { active: true }), queryClient.refetchQueries("user")
        }))


    useEffect(() => {
        if (favorited) {
            setImgSrc("/icons/filled-heart-vector.png")
        } else {
            setImgSrc("/icons/heart-vector.png")
        }
    }, [favorited])

    function addFavotited(favorited: boolean, code: string) {
        let filtered;
        if (pages.general.filter === "all") {
            const allProducts: IProduct | undefined = queryClient.getQueryData(["all", pages.general.all])
            filtered = allProducts?.products.filter((product: { code: string }) => {
                return product.code === code
            })
        } else if (pages.general.filter === "favorites") {
            const favoritesProducts: IProduct | undefined = queryClient.getQueryData(["favorites", pages.general.favorites])
            filtered = favoritesProducts?.products.filter((product: { code: string }) => {
                return product.code === code
            })
        } else if (pages.general.filter === "search") {
            const searchProducts: IProduct | undefined = queryClient.getQueryData(["search", pages.general.search])
            filtered = searchProducts?.products.filter((product: { code: string }) => {
                return product.code === code
            })
        }

        if (filtered) {
            const user: IUser = queryClient.getQueryData("user") as IUser
            if (favorited) {
                setImgSrc("/icons/heart-vector.png")
                removeShoppingCart.mutate({ userId: user.id, shoppingCartId: filtered[0].id })
            } else {
                setImgSrc("/icons/filled-heart-vector.png")
                user.shoppingCart.push(filtered[0])
                addShoppingCart.mutate(user)
            }
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
                {addShoppingCart.isLoading || removeShoppingCart.isLoading ? (
                    <div>...</div>
                ) : addShoppingCart.isError || removeShoppingCart.isError ? (
                    <div>Erro</div>
                ) : (
                    <div onClick={() => {
                        addFavotited(imgSrc.includes("filled") ? true : false, code)
                    }} className={styles.heart_icon}>
                        <Image fill sizes="100%" alt="Ícone de coração" src={imgSrc} />
                    </div>
                )}
            </td>
        </tr>
    )
}
