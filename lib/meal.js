import sql from 'better-sqlite3'
import slugify from 'slugify'
import xss from 'xss'
import fs from 'node:fs'

const db = sql('meals.db')

export async function getMeals() {
  await new Promise(resolve => setTimeout(resolve, 2000))
  return db.prepare('SELECT * FROM meals').all()
}

export function getMeal(slug) {
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug)
}

export async function saveMeal(meal) {
  // slugify => 사용자의 입력을 웹 브라우저 주소창에 사용할 수 있는 형태로 자동 변환해주는 역할
  // ex) "Juicy Cheese Burger"	"juicy-cheese-burger", "Tom's Pizza!"	"toms-pizza"
  meal.slug = slugify(meal.title, { lower: true })

  // xss는 사용자가 입력한 HTML 코드에서 악의적인 스크립트를 제거하여
  // XSS(Cross-Site Scripting) 공격을 방지하는 라이브러리
  meal.instructions = xss(meal.instructions)

  /*
   * 이미지 처리: File 객체 또는 base64 문자열
   *
   * 이미지가 2가지 형태로 올 수 있음:
   * 1. File 객체 (새로 선택한 파일)
   * 2. base64 문자열 (유효성 검사 실패 후 재제출, hidden input에서 온 데이터)
   *
   * 두 경우 모두 최종적으로 파일 시스템에 저장해야 함
   */
  let extension, fileName, buffer

  if (typeof meal.image === 'string') {
    // Case 1: base64 문자열인 경우
    // 예: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."

    // 정규식으로 파싱: type과 base64 데이터 추출
    const matches = meal.image.match(/data:image\/(\w+);base64,(.*)/)
    extension = matches[1] // "jpeg", "png" 등
    const base64Data = matches[2] // 실제 base64 인코딩된 데이터

    fileName = `${meal.slug}.${extension}`
    // base64 문자열 → Buffer (바이너리)
    buffer = Buffer.from(base64Data, 'base64')
  } else {
    // Case 2: File 객체인 경우
    extension = meal.image.name.split('.').pop() // "photo.jpg" → "jpg"
    fileName = `${meal.slug}.${extension}`
    // File → ArrayBuffer → Buffer
    const arrayBuffer = await meal.image.arrayBuffer()
    buffer = Buffer.from(arrayBuffer)
  }

  // 파일 시스템에 저장
  // public/images/juicy-cheese-burger.jpg 형태로 저장
  const stream = fs.createWriteStream(`public/images/${fileName}`)
  stream.write(buffer, error => {
    if (error) {
      throw new Error('Saving image failed!')
    }
  })

  // DB에 저장할 이미지 경로로 변경
  meal.image = `/images/${fileName}` // "/images/juicy-cheese-burger.jpg"

  db.prepare(
    `
    INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
    )
  `
  ).run(meal)
}
