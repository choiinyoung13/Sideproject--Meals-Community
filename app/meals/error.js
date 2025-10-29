// 에러 처리는 실시간 반응이 필요 → 클라이언트에서 JavaScript 실행 필요 → 'use client' 필수
'use client'

export default function Error() {
  return (
    <main className="error">
      <h1>An error occured!</h1>
      <p>Failed to fetcg meal data. Please try again later.</p>
    </main>
  )
}
