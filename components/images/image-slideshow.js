'use client'

/* 
✨'use client'는 "클라이언트에서만"이 아니라 "클라이언트에서도 동작해야 함"을 의미

'use client'를 선언하면

  사용자가 페이지 접속
    → 서버가 초기 HTML 생성해서 전송
    → 클라이언트가 JavaScript 실행하며 인터랙티브하게(useState, useEffect, setInterval...) 동작

*/

import { useEffect, useState } from 'react'
import Image from 'next/image'

import burgerImg from '@/assets/burger.jpg'
import curryImg from '@/assets/curry.jpg'
import dumplingsImg from '@/assets/dumplings.jpg'
import macncheeseImg from '@/assets/macncheese.jpg'
import pizzaImg from '@/assets/pizza.jpg'
import schnitzelImg from '@/assets/schnitzel.jpg'
import tomatoSaladImg from '@/assets/tomato-salad.jpg'
import classes from './image-slideshow.module.css'

const images = [
  { image: burgerImg, alt: 'A delicious, juicy burger' },
  { image: curryImg, alt: 'A delicious, spicy curry' },
  { image: dumplingsImg, alt: 'Steamed dumplings' },
  { image: macncheeseImg, alt: 'Mac and cheese' },
  { image: pizzaImg, alt: 'A delicious pizza' },
  { image: schnitzelImg, alt: 'A delicious schnitzel' },
  { image: tomatoSaladImg, alt: 'A delicious tomato salad' },
]

/*
 React Sever Components(RSC)의 장점
  -> 다운로해야 하는 클라이언트 측의 JS 코드가 줄어 웹사이트 성능을 향상 시킬 수 있음
  -> 검색엔진(SEO) 최적화에도 좋음 
*/

export default function ImageSlideshow() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex =>
        prevIndex < images.length - 1 ? prevIndex + 1 : 0
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={classes.slideshow}>
      {images.map((image, index) => (
        <Image
          key={index}
          src={image.image}
          className={index === currentImageIndex ? classes.active : ''}
          alt={image.alt}
        />
      ))}
    </div>
  )
}
