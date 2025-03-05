import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
      <h1 className="text-3xl font-bold mb-4">ページが見つかりません</h1>
      <p className="text-gray-600 mb-8">お探しのページは存在しないか、移動した可能性があります。</p>
      <Link href="/" className="btn-primary">
        ホームに戻る
      </Link>
    </div>
  )
}
