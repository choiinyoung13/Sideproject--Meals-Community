'use client'

import { useFormStatus } from 'react-dom'

export default function MealsFormSubmit() {
  // useFormStatus는 form 안에있는 컴포넌트 에서만 사용가능
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Share Meal'}
    </button>
  )
}
