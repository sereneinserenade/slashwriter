import Link from 'next/link'
import styles from 'src/styles/404.module.css'

function Error404() {
    return (
        <div className={styles.container}>
            <img src="/assets/404.svg" alt="404" />
            <h2>Page introuvable</h2>
            <Link href="/">
                <a>{"Retourner à l'accueil"}</a>
            </Link>
        </div>
    )
}

Error404.Title = "404"

export default Error404