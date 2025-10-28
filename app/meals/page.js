import Link from 'next/link'
import classes from './page.module.css'
import MealsGrid from '@/components/meals/meals-grid'
import { getMeals } from '@/lib/meal'
import { Suspense } from 'react'

async function Meals() {
  // 서버 컴포넌트는 서버에서 실행되는 코드임으로 바로 DB로 접근 가능함
  // 그리고 클라이언트 컴포넌트에선 불가능했던 asnyc, await 문법도 바로 사용가능
  const meals = await getMeals() // ← 여기서 멈춤 (대기)
  // DB 응답 올 때까지 아래 코드 실행 안 됨
  // 기다리는 동안 loading.js 요소가 화면에 렌더링 됨

  return <MealsGrid meals={meals} />
}

export default async function MealsPage() {
  return (
    <>
      <header className={classes.header}>
        <h1>
          Delicioust meals, created
          <span className={classes.highlight}>by you</span>
        </h1>
        <p>
          Choose your favorite recipe and cook it yourself. It is easy and fun!
        </p>
        <p className={classes.cta}>
          <Link href="/meals/share">Share Your Favorite Recipe</Link>
        </p>
      </header>
      <main className={classes.main}>
        <Suspense
          fallback={<p className={classes.loading}>Fetching meals...</p>}
        >
          <Meals />
        </Suspense>
      </main>
    </>
  )
}
