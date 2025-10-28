import Link from 'next/link'
import logImg from '@/assets/logo.png'
import classes from './main-header.module.css'
import Image from 'next/image'
import MainHeaderBackground from './main-header-background'
import NavLink from './nav-link'

export default function MainHeader() {
  // <Image>는 이미지를 자동으로 최적화(Webp로 변환)하고 기본적으로 지연 로딩(보이려고 할 때 불러옴)하는데,
  //  priority를 붙이면 로고처럼 중요한 이미지를 즉시 로드합니다.

  return (
    <>
      <MainHeaderBackground />
      <header className={classes.header}>
        <Link className={classes.logo} href="/">
          <Image src={logImg} alt="A plate with food on it" priority />
          NextLevel Food
        </Link>

        <nav className={classes.nav}>
          <ul>
            <li>
              <NavLink href="/meals">Browse Meals</NavLink>
            </li>
            <li>
              <NavLink href="/community">Foodies Community</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
}
