import Image from "next/image";
import styles from "./Main.module.css";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../ContextProvider";
import { UseQueryResult, useQuery } from "react-query";
import IUser from "@/interfaces/IUser";
import TopSellers from "./TopSellers";
import AllProducts from "./AllProducts";

function Main({ font }: { font: string }) {
    const { data }: UseQueryResult<IUser, unknown> = useQuery("user", () => fetch(`/api/users?email=l@gmail&password=123`, { method: "GET" }).then(res => res.json()), { refetchOnWindowFocus: false })
    return (
        <main className={font}>
            <div className={styles.container}>
                <TopSellers />
                <AllProducts user={data as IUser} />
            </div>
        </main>
    )
}

export default Main;