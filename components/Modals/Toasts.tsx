import { Dispatch, SetStateAction } from "react"
import styles from "./Toasts.module.css"

export default function Toasts({ close, message }: {
    close: Dispatch<SetStateAction<boolean>>, message: string
}) {
    return (
        <div className={styles.toasts}>
            <div className={styles.title}>
                <b>Aviso!</b>
                <span onClick={() => { close(false) }}>X</span>
            </div>
            <p>{message}</p>
        </div>
    )
}