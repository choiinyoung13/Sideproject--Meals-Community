import Image from 'next/image'
import classes from './page.module.css'
import { getMeal } from '@/lib/meal'
import { notFound } from 'next/navigation'

// 동적으로 메타데이터 설정하는 방법
export async function generateMetadata({ params }) {
  const { mealSlug } = await params
  const meal = getMeal(mealSlug)

  if (!meal) {
    notFound()
  }

  return {
    title: meal.title,
    description: meal.summary,
  }
}

export default async function MealDetailsPage({ params }) {
  const { mealSlug } = await params
  const meal = getMeal(mealSlug)

  if (!meal) {
    // 제일 가까운 not-found.js를 렌더링
    notFound()
  }

  meal.instructions = meal.instructions.replace(/\n/g, '<br />')

  /* 
    dangerouslySetInnerHTML은 문자열 형태의 HTML 코드(예: <br />)를
    텍스트가 아닌 실제 HTML 태그로 렌더링하기 위해 사용하는 React 속성
  */

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image src={meal.image} alt={meal.title} fill />
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>
      <main>
        <p
          className={classes.instructions}
          dangerouslySetInnerHTML={{
            __html: meal.instructions,
          }}
        ></p>
      </main>
    </>
  )
}
