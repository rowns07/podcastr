
import format from 'date-fns/format';
import ptBr from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import styles from './styles.module.scss';


export function Header() {
  // const currentDate = new Date().toLocaleDateString()
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBr,
  })

  return (
    <header className={styles.headerContainer}>
      <Link href="/">
        <a>
          <img src="/logo.svg" alt="Logo Podcaster" />
        </a>
      </Link>
      <p>O melhor para voce ouvir,sempre</p>

      <span>{currentDate}</span>
    </header>
  )
}

