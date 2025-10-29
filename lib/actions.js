'use server'
import { redirect } from 'next/navigation'
import { saveMeal } from './meal'

// 👈 이 함수는 서버에서만 실행됨을 보장해줌

export async function shareMeal(formData) {
  const meal = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    image: formData.get('image'),
    creator: formData.get('name'),
    creator_email: formData.get('email'),
  }

  await saveMeal(meal)
  redirect('/meals')
}
