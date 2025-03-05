"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

type Slide = {
  title: string
  content: string[]
  imageUrl?: string
}

type Presentation = {
  id: string
  slides: Slide[]
  downloadUrl: string
}

export default function PreviewPage() {
  const params = useParams()
  const id = params.id as string
  
  const [presentation, setPresentation] = useState<Presentation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        // 実際の実装では、APIからプレゼンテーションデータを取得
        // const response = await axios.get(`/api/presentations/${id}`)
        // setPresentation(response.data)
        
        // デモ用のダミーデータ
        const dummyPresentation: Presentation = {
          id,
          slides: [
            {
              title: "プレゼンテーションタイトル",
              content: ["このプレゼンテーションは自動生成されました", "以下のスライドで詳細をご覧ください"]
            },
            {
              title: "トピック 1",
              content: ["自動生成プレゼンテーションのメリット", "短時間でプロ品質なスライドを作成できます", "一貫したデザインテーマが適用されます", "コンテンツに集中できるため、生産性が向上します"]
            },
            {
              title: "トピック 2",
              content: ["主な特徴", "テキストの自動構造化", "スマートなレイアウト配置", "関連画像の自動挙選", "継続的な改善と更新"]
            },
            {
              title: "データ分析",
              content: ["当社の調査によると、自動生成プレゼンテーションを利用したユーザーは以下の結果が得られました", "プレゼン作成時間が平均「75%削減」", "プレゼンの質に関する満足度が「68%向上」", "コンテンツ集中度が「85%向上」"]
            },
            {
              title: "まとめ",
              content: ["自動生成プレゼンテーションのメリット", "時間と労力の節約", "一貫したデザイン品質", "コンテンツへの集中", "すぐに始められる簡単さ"]
            }
          ],
          downloadUrl: `/api/presentations/${id}/download`
        }
        
        setPresentation(dummyPresentation)
      } catch (err) {
        console.error('Error fetching presentation:', err)
        setError('プレゼンテーションデータの取得中にエラーが発生しました。')
      } finally {
        setLoading(false)
      }
    }

    fetchPresentation()
  }, [id])

  const handlePreviousSlide = () => {
    setCurrentSlide(prev => Math.max(0, prev - 1))
  }

  const handleNextSlide = () => {
    if (presentation) {
      setCurrentSlide(prev => Math.min(presentation.slides.length - 1, prev + 1))
    }
  }

  const handleDownload = () => {
    if (presentation) {
      window.location.href = presentation.downloadUrl
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600">プレゼンテーションを読み込み中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded inline-block mb-4">
          {error}
        </div>
        <div>
          <Link href="/create" className="btn-primary">
            新しいプレゼンテーションを作成
          </Link>
        </div>
      </div>
    )
  }

  if (!presentation) {
    return null
  }

  const currentSlideData = presentation.slides[currentSlide]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">プレゼンテーションプレビュー</h1>
        <div className="flex gap-3">
          <button onClick={handleDownload} className="btn-primary flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            ダウンロード
          </button>
          <Link href="/create" className="btn-secondary flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            再編集
          </Link>
        </div>
      </div>

      <div className="bg-gray-100 p-2 rounded-t-lg flex justify-between items-center text-sm">
        <div className="flex items-center">
          <button 
            onClick={handlePreviousSlide}
            disabled={currentSlide === 0}
            className={`p-2 rounded ${currentSlide === 0 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-200'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="mx-2">
            スライド {currentSlide + 1} / {presentation.slides.length}
          </span>

          <button 
            onClick={handleNextSlide}
            disabled={currentSlide === presentation.slides.length - 1}
            className={`p-2 rounded ${currentSlide === presentation.slides.length - 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-200'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex gap-2">
          <button className="p-2 rounded text-gray-700 hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="border border-gray-300 rounded-b-lg bg-white aspect-[16/9] flex items-center justify-center p-8 shadow-md" style={{ minHeight: '480px' }}>
        <div className="w-full max-w-3xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">{currentSlideData.title}</h2>
          
          <ul className="space-y-4">
            {currentSlideData.content.map((item, index) => (
              <li key={index} className="flex items-start">
                <div className="text-primary-600 mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xl text-gray-700">{item}</span>
              </li>
            ))}
          </ul>

          {currentSlideData.imageUrl && (
            <div className="mt-6 flex justify-center">
              <img 
                src={currentSlideData.imageUrl} 
                alt={`Slide ${currentSlide + 1} image`} 
                className="max-h-60 rounded shadow-sm" 
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-8 gap-2">
        {presentation.slides.map((slide, index) => (
          <div 
            key={index}
            className={`cursor-pointer border rounded p-2 text-center text-xs ${currentSlide === index ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}`}
            onClick={() => setCurrentSlide(index)}
          >
            <div className="text-gray-500 mb-1">#{index + 1}</div>
            <div className="truncate font-medium">{slide.title}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-bold text-lg mb-2">次のステップ</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <div className="text-primary-600 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <span>
              <strong>PowerPointとしてダウンロード</strong> - さらに編集や調整を行うことができます
            </span>
          </li>
          <li className="flex items-start">
            <div className="text-primary-600 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <span>
              <strong>共有</strong> - チームメンバーやクライアントとリンクで簡単に共有できます
            </span>
          </li>
          <li className="flex items-start">
            <div className="text-primary-600 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <span>
              <strong>再生成</strong> - 別のテーマやスタイルでプレゼンテーションを試してみましょう
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
