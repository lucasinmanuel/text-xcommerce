import styles from "./RegistrationModal.module.css"
import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "react-query"
import { AppContext } from "../../ContextProvider"
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInput {
    name: string,
    price: number,
    stock: number,
    overview: string,
};

interface ICreateProduct {
    name: string,
    price: number,
    stock: number,
    overview: string
}

function RegistrationModal({ font }: { font: string }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IFormInput>();
    const { visibleModal, setVisibleModal, pages } = useContext(AppContext)
    const queryClient = useQueryClient()
    const createProduct = useMutation("createProduct", (product: ICreateProduct) =>
        fetch("/api/products", {
            method: "POST",
            body: JSON.stringify(product)
        }).then(() => { queryClient.refetchQueries("all") }))

    const onSubmit: SubmitHandler<IFormInput> = (data, event) => {
        event?.preventDefault()
        createProduct.mutate(data)
        setVisibleModal(false)
        reset()
    };

    return (
        <>
            {visibleModal &&
                <div id="modal" className={font}>
                    <div className={styles.modal_background}>
                        <style jsx global>{`
                        body,html{
                            overflow-y:hidden;
                        }
                    `}</style>
                        <form onSubmit={handleSubmit(onSubmit)} className={styles.modal}>
                            <input onClick={() => { setVisibleModal(false) }} className={styles.management_btn} type="button" value="Fechar" />

                            <label htmlFor="name">* Nome do produto (máx: 100 letras)</label>
                            <input id="name" type="text"  {...register("name", { required: true, maxLength: 100 })} />
                            {errors.name?.type === "required" && <span>O campo
                                &quot;nome do produto&quot; está vazio</span>}
                            {errors.name?.type === "maxLength" && <span>Máximo de 100 letras</span>}

                            <label htmlFor="price">* Preço do produto</label>
                            <input id="price" type="number" {...register("price", {
                                required: true,
                            })} />
                            {errors.price?.type === "required" && <span>O campo &quot;preço do produto&quot; está vazio</span>}

                            <label htmlFor="stock">* Estoque do produto</label>
                            <input id="stock" type="number" {...register("stock", {
                                required: true,
                            })} />
                            {errors.stock?.type === "required" && <span>O campo &quot;estoque do produto&quot; está vazio</span>}

                            <label htmlFor="overview">* Descrição do produto (mín: 50 letras)</label>
                            <textarea id="overview" {...register("overview", {
                                required: true, minLength: 50
                            })}></textarea>
                            {errors.overview?.type === "required" && <span>O campo &quot;descrição do produto&quot; está vazio</span>}
                            {errors.overview?.type === "minLength" && <span>Mínimo de 50 letras</span>}

                            <input className={styles.management_btn} type="submit" value="Cadastrar" />
                        </form>
                    </div>
                </div>
            }
        </>
    )
}

export default RegistrationModal;