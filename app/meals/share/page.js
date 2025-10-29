import ImagePicker from '@/components/meals/image-picker'
import classes from './page.module.css'
import { shareMeal } from '@/lib/actions'
import MealsFormSubmit from '@/components/meals/meals-form-submit'

export default function ShareMealPage() {
  /*
    폼을 제출하면 → Server Action 함수(shareMeal)가 서버에서 실행 → 데이터베이스 저장/처리 가능
    별도의 API 라우트 없이 폼과 서버 로직을 한 곳에서 관리
  */

  return (
    <>
      <header className={classes.header}>
        <h1>
          Share your <span className={classes.highlight}>favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>
      <main className={classes.main}>
        {/*  폼 제출 시 서버 함수 실행 */}
        <form className={classes.form} action={shareMeal}>
          <div className={classes.row}>
            <p>
              <label htmlFor="name">Your name</label>
              <input type="text" id="name" name="name" required />
            </p>
            <p>
              <label htmlFor="email">Your email</label>
              <input type="email" id="email" name="email" required />
            </p>
          </div>
          <p>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" required />
          </p>
          <p>
            <label htmlFor="summary">Short Summary</label>
            <input type="text" id="summary" name="summary" required />
          </p>
          <p>
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              rows="10"
              required
            ></textarea>
          </p>
          <ImagePicker label="Your Image" name="image" />
          <p className={classes.actions}>
            <MealsFormSubmit />
          </p>
        </form>
      </main>
    </>
  )
}
