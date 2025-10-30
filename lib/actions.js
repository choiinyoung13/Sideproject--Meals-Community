'use server'
import { redirect } from 'next/navigation'
import { saveMeal } from './meal'
import { revalidatePath } from 'next/cache'

// 👈 이 함수는 서버에서만 실행됨을 보장해줌

function isInvaliText(text) {
  return !text || text.trim() === ''
}

/**
 * Meal 저장 Server Action
 *
 * useActionState에 전달되는 액션 함수는 2가지 인자를 받아야 함:
 * - prevState: 이전 상태 (유효성 검사 실패 시 반환한 값)
 * - formData: 폼 데이터
 */
export async function shareMeal(prevState, formData) {
  /*
   * 이미지 처리 전략 (핵심!)
   *
   * 2가지 경우를 처리:
   * 1. 새로 파일 선택 → imageFile (File 객체)
   * 2. 유효성 검사 실패 후 재제출 → imageBase64 (hidden input의 base64 문자열)
   *
   * 왜 이렇게?
   * - 파일 input은 리렌더링 시 초기화되지만
   * - hidden input의 value는 유지됨
   * - 따라서 파일이 없으면 base64를 사용
   */
  const imageFile = formData.get('image') // File 객체 (새 선택)
  const imageBase64 = formData.get('image_base64') // base64 문자열 (hidden input)

  const meal = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    // 우선순위: 새로운 파일 > 저장된 base64
    image: imageFile && imageFile.size > 0 ? imageFile : imageBase64,
    creator: formData.get('name'),
    creator_email: formData.get('email'),
  }

  // 유효성 검사
  if (
    isInvaliText(meal.title) ||
    isInvaliText(meal.summary) ||
    isInvaliText(meal.instructions) ||
    isInvaliText(meal.creator) ||
    !meal.creator_email.includes('@') ||
    !meal.image ||
    // 이미지 타입에 따른 검사: File 객체면 size 확인, 문자열(base64)이면 통과
    (typeof meal.image !== 'string' && meal.image.size === 0)
  ) {
    /*
     * 유효성 검사 실패 시 처리
     *
     * 목표: 사용자가 입력한 내용(이미지 포함)을 유지
     *
     * 이미지는 2가지 형태로 올 수 있음:
     * 1. File 객체 → base64로 변환하여 반환
     * 2. 이미 base64 문자열 → 그대로 반환
     */
    let imagePreview = null
    if (meal.image) {
      if (typeof meal.image === 'string') {
        // Case 1: 이미 base64 문자열인 경우 (hidden input에서 온 데이터)
        imagePreview = meal.image
      } else if (meal.image.size > 0) {
        // Case 2: File 객체인 경우 (새로 선택한 파일)
        // File → ArrayBuffer → Buffer → base64 문자열
        const buffer = await meal.image.arrayBuffer()
        const base64 = Buffer.from(buffer).toString('base64')
        imagePreview = `data:${meal.image.type};base64,${base64}`
      }
    }

    // 클라이언트로 반환 → useActionState의 state가 됨
    return {
      message: 'Invaild iuput Please try again.',
      values: {
        title: meal.title,
        summary: meal.summary,
        instructions: meal.instructions,
        creator: meal.creator,
        creator_email: meal.creator_email,
        imagePreview, // 이게 ImagePicker의 defaultImage로 전달됨
      },
    }
  }

  // 유효성 검사 통과 → DB에 저장
  await saveMeal(meal)
  revalidatePath('/meals', 'layout') // 해당 경로의 캐시 데이터 유효성 재검사, layout 설정하면 중첩된 모든 페이지들의 캐시도 재검사
  redirect('/meals')
}
