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

  const extension = meal.image.name.split('.').pop()
  const fileName = `${meal.slug}.${extension}`

  const stream = fs.createWriteStream(`public/images/${fileName}`)
  const bufferedImage = await meal.image.arrayBuffer()

  stream.write(Buffer.from(bufferedImage), error => {
    if (error) {
      throw new Error('Saving image failed!')
    }
  })

  meal.image = `/images/${fileName}`

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
