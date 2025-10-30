'use client'
import { useRef, useState } from 'react'
import classes from './image-picker.module.css'
import Image from 'next/image'

/**
 * 이미지 선택 컴포넌트
 *
 * 문제: 유효성 검사 실패 시 파일 input이 초기화되어 이미지가 사라짐
 * 해결: base64로 변환한 이미지를 hidden input에 저장하여 유지
 */
export default function ImagePicker({ label, name, defaultImage }) {
  // defaultImage: 서버에서 반환한 base64 이미지 (유효성 검사 실패 시)
  const [pickedImage, setPickedImage] = useState(defaultImage)
  const imageInputRef = useRef()

  function handlePickerClick() {
    imageInputRef.current.click()
  }

  function handleImageChange(event) {
    const file = event.target.files[0]

    if (!file) {
      setPickedImage(null)
      return
    }

    // FileReader로 파일을 base64 문자열로 변환
    // 목적: 1) 미리보기용, 2) hidden input에 저장하여 유지
    const fileReader = new FileReader()

    fileReader.onload = () => {
      // fileReader.result = "data:image/jpeg;base64,/9j/4AAQ..."
      setPickedImage(fileReader.result)
    }

    fileReader.readAsDataURL(file)
  }

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>

      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>No image picked yet.</p>}
          {pickedImage && (
            <Image
              src={pickedImage}
              alt="The image selected by user."
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>

        {/* 실제 파일 input - 새로 이미지를 선택할 때 사용 */}
        <input
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          ref={imageInputRef}
          onChange={handleImageChange}
        />

        {/* 
          핵심! Hidden input에 base64 저장
          
          왜 필요한가?
          - 유효성 검사 실패 시 리렌더링되면 파일 input은 초기화됨
          - 하지만 hidden input의 value는 유지됨
          - 재제출 시 서버가 이 base64 데이터를 사용
          
          흐름:
          1. 이미지 선택 → base64 변환 → hidden input에 저장
          2. 제출 실패 → 리렌더링 → hidden input의 value는 유지됨
          3. 재제출 → 서버가 image_base64를 확인하여 사용
        */}
        {pickedImage && (
          <input
            type="hidden"
            name={`${name}_base64`} // 이름: "image_base64"
            value={pickedImage} // 값: "data:image/jpeg;base64,..."
          />
        )}
        <button
          className={classes.button}
          type="button"
          onClick={handlePickerClick}
        >
          Pick an Image
        </button>
      </div>
    </div>
  )
}
