# 이미지 선택 유지 구현 설명

## 문제 상황

유효성 검사 실패 후 리렌더링 시 파일 input이 초기화되어 이미지가 사라지는 문제

```
1. 사용자가 이미지 선택
2. 제출 (타이틀 비워둠)
3. 유효성 검사 실패 → 리렌더링
4. 미리보기는 보이지만 실제 파일 input은 비어있음
5. 타이틀 입력 후 재제출
6. 에러: "이미지가 없습니다" ❌
```

## 해결 방법

**Hidden input에 base64 이미지 데이터를 저장하여 유지**

---

## 전체 플로우

### 🎬 시나리오 1: 첫 제출 (성공)

```
[클라이언트] ImagePicker
  ↓ 파일 선택
  ↓ FileReader로 base64 변환
  ↓ pickedImage state에 저장 (미리보기용)
  ↓ hidden input에도 저장 (value={pickedImage})

[폼 제출]
  ↓ formData에 2개 포함:
  ↓   - image: File 객체 (새로 선택한 파일)
  ↓   - image_base64: base64 문자열 (hidden input)

[서버] shareMeal (lib/actions.js)
  ↓ imageFile.size > 0 이므로 File 객체 사용
  ↓ 유효성 검사 통과

[서버] saveMeal (lib/meal.js)
  ↓ File 객체 → ArrayBuffer → Buffer
  ↓ public/images/에 파일 저장
  ↓ DB에 경로 저장

✅ 성공!
```

### 🔄 시나리오 2: 첫 제출 (실패) → 재제출 (성공)

```
[1단계: 첫 제출 - 실패]

[클라이언트] ImagePicker
  ↓ 파일 선택
  ↓ base64 변환
  ↓ pickedImage: "data:image/jpeg;base64,/9j..."
  ↓ hidden input: <input name="image_base64" value="data:image/jpeg;base64,/9j..." />

[폼 제출 - 타이틀 비워둠]
  ↓ formData:
  ↓   - image: File 객체
  ↓   - image_base64: base64 문자열
  ↓   - title: "" (비어있음)

[서버] shareMeal
  ↓ 유효성 검사 실패! (title이 비어있음)
  ↓ File 객체를 base64로 변환
  ↓ return {
  ↓   message: "에러 메시지",
  ↓   values: {
  ↓     title: "",
  ↓     imagePreview: "data:image/jpeg;base64,/9j..." ← 이게 핵심!
  ↓   }
  ↓ }

[클라이언트] 리렌더링
  ↓ state.values.imagePreview 받음
  ↓
  ↓ <input type="file" /> ← 비어있음 (리렌더링으로 초기화됨)
  ↓
  ↓ ImagePicker의 pickedImage ← defaultImage로 복원
  ↓ → 미리보기 보임! ✅
  ↓
  ↓ <input type="hidden" name="image_base64" value="..." /> ← 유지됨! ✅

[2단계: 재제출 - 성공]

[사용자] 타이틀 입력 후 재제출

[폼 제출]
  ↓ formData:
  ↓   - image: 빈 파일 (size = 0)
  ↓   - image_base64: base64 문자열 (hidden input에서) ← 이게 핵심!
  ↓   - title: "Juicy Burger" (입력함)

[서버] shareMeal
  ↓ imageFile.size = 0이므로 imageBase64 사용
  ↓ meal.image = "data:image/jpeg;base64,/9j..." (문자열)
  ↓ 유효성 검사 통과!

[서버] saveMeal
  ↓ typeof meal.image === 'string' → base64 처리
  ↓ 정규식으로 파싱: type과 데이터 추출
  ↓ base64 → Buffer 변환
  ↓ public/images/에 파일 저장
  ↓ DB에 경로 저장

✅ 성공!
```

---

## 핵심 코드 위치

### 1. `components/meals/image-picker.js`

**역할:** 파일을 base64로 변환하고 hidden input에 저장

```javascript
// 파일 선택 시
fileReader.readAsDataURL(file)
fileReader.onload = () => {
  setPickedImage(fileReader.result) // 미리보기 + hidden input용
}

// Hidden input에 저장
;<input type="hidden" name="image_base64" value={pickedImage} />
```

### 2. `lib/actions.js`

**역할:** 두 가지 소스 확인 (File 또는 base64)

```javascript
const imageFile = formData.get('image') // File 객체
const imageBase64 = formData.get('image_base64') // base64 문자열

// 우선순위: 새 파일 > base64
meal.image = imageFile && imageFile.size > 0 ? imageFile : imageBase64
```

### 3. `lib/meal.js`

**역할:** File 객체와 base64 문자열 모두 처리

```javascript
if (typeof meal.image === 'string') {
  // base64 처리
  const matches = meal.image.match(/data:image\/(\w+);base64,(.*)/)
  buffer = Buffer.from(base64Data, 'base64')
} else {
  // File 객체 처리
  const arrayBuffer = await meal.image.arrayBuffer()
  buffer = Buffer.from(arrayBuffer)
}
```

---

## 왜 이렇게 복잡한가?

### 문제: 파일 input은 값을 프로그래밍 방식으로 설정할 수 없음

```javascript
// ❌ 불가능
<input type="file" value="photo.jpg" />
<input type="file" defaultValue="photo.jpg" />
input.value = "C:\\path\\to\\photo.jpg"
```

**이유:** 보안상의 이유로 브라우저가 막음

### 대안:

1. **DataTransfer API 사용** (복잡함)
   - base64 → File 객체 재생성
   - DataTransfer로 input.files 설정
2. **Hidden input 사용** (실용적) ✅
   - base64를 hidden input에 저장
   - 서버에서 base64도 처리하도록 수정

→ 우리는 2번 방법을 선택!

---

## 실무에서는?

대부분의 회사는 **즉시 업로드** 방식을 사용:

```javascript
function handleImageChange(e) {
  const file = e.target.files[0]

  // 즉시 서버에 업로드
  uploadImage(file).then(url => {
    setImageUrl(url) // "/temp/abc123.jpg"
  })
}

// 폼 제출 시 URL만 전송
// → 파일 유지 문제 자체가 없음
```

**장점:**

- 새로고침해도 이미지 유지
- 파일 크기 제한 쉬움
- 이미지 미리 처리 가능 (리사이징 등)

---

## 요약

| 항목     | 내용                                 |
| -------- | ------------------------------------ |
| **문제** | 리렌더링 시 파일 input 초기화        |
| **해결** | Hidden input에 base64 저장           |
| **핵심** | 2가지 소스 확인 (File vs base64)     |
| **장점** | 미리보기 + 실제 데이터 모두 유지     |
| **단점** | 복잡함 (실무에서는 즉시 업로드 선호) |
