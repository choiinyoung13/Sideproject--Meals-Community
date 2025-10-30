'use client'

import { shareMeal } from '@/lib/actions'
import ImagePicker from './image-picker'
import MealsFormSubmit from './meals-form-submit'
import { useActionState } from 'react'
import classes from './meal-share-form.module.css'

/*
    폼을 제출하면 → Server Action 함수(shareMeal)가 서버에서 실행 → 데이터베이스 저장/처리 가능
    별도의 API 라우트 없이 폼과 서버 로직을 한 곳에서 관리
  */

export default function MealShareForm() {
  // useActionState는 Server Action의 실행 결과를 클라이언트에서 받아서 처리해야 할 때 사용합니다. 특히 폼 제출과 함께 사용하면 강력
  // - state: 서버 액션이 반환한 값 (유효성 검사 실패 시 입력값 + 에러 메시지)
  // - formAction: 폼 제출 시 호출할 서버 액션
  const [state, formAction] = useActionState(shareMeal, { message: null })

  return (
    <form className={classes.form} action={formAction}>
      {/* 
        모든 input의 defaultValue는 state.values에서 가져옴
        → 유효성 검사 실패 시 사용자가 입력한 값이 유지됨
      */}
      <div className={classes.row}>
        <p>
          <label htmlFor="name">Your name</label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={state.values?.creator}
          />
        </p>
        <p>
          <label htmlFor="email">Your email</label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={state.values?.creator_email}
          />
        </p>
      </div>
      <p>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={state.values?.title}
        />
      </p>
      <p>
        <label htmlFor="summary">Short Summary</label>
        <input
          type="text"
          id="summary"
          name="summary"
          defaultValue={state.values?.summary}
        />
      </p>
      <p>
        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          name="instructions"
          rows="10"
          defaultValue={state.values?.instructions}
        ></textarea>
      </p>
      {/* 
        ImagePicker에 defaultImage 전달
        - 유효성 검사 실패 시 서버가 반환한 base64 이미지
        - ImagePicker가 이를 받아서 미리보기를 복원
        - 동시에 hidden input에도 저장되어 재제출 시 사용됨
      */}
      <ImagePicker
        label="Your Image"
        name="image"
        defaultImage={state.values?.imagePreview}
      />
      {state.message && <p>{state.message}</p>}
      <p className={classes.actions}>
        <MealsFormSubmit />
      </p>
    </form>
  )
}
