import styles from "./Header.module.css"
import Image from "next/image";
import SearchBar from "./Sections/SearchBar";
import ProductManager from "./Sections/ProductManager";

function Header({ font }: { font: string }) {
    return (
        <header className={font}>
            <div className={styles.profile_header}>
                <div className={styles.container}>
                    <a className={styles.logo}>XCO<span>+</span></a>
                    <nav className={styles.profile}>
                        <div className={styles.picture}>
                            <Image alt="Foto de perfil" src="/profile-picture.jpg" fill sizes="100%" />
                        </div>
                        <div className={styles.chevron}>
                            <Image alt="Seta para baixo" src="/chevron-down.svg" fill sizes="100%" />
                        </div>
                    </nav>
                </div>
            </div>
            <SearchBar />
            <ProductManager />
        </header>
    )
}

export default Header;