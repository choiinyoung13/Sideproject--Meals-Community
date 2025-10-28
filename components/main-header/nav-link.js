'use client'

/*
    'use client' 선언은 최대한 하위 컴포넌트에서 선언해
    다른 컴포넌트들은 서버 컴포넌트의 장점을 살리는게 좋다.
*/

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import classes from './nav-link.module.css'

export default function NavLink({ href, children }) {
  const path = usePathname()

  return (
    <Link
      href={href}
      className={
        path.startsWith(href)
          ? `${classes.link} ${classes.active}`
          : classes.link
      }
    >
      {children}
    </Link>
  )
}
