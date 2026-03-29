'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase/client'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) { setError('6文字以上で入力してください'); return }
    if (password !== confirmPassword) { setError('パスワードが一致しません'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setError(error.message)
    else setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-white mb-2">パスワードを変更しました</h2>
          <Link href="/" className="mt-4 inline-block px-6 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
            AIマスターを使い始める
          </Link>
        </div>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-gray-600 border-t-white rounded-full mx-auto"></div>
          <p className="text-sm text-gray-400 mt-3">認証情報を確認中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-white">新しいパスワードを設定</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">新しいパスワード</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                required minLength={6} placeholder="6文字以上"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">パスワード（確認）</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                required placeholder="もう一度入力"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold text-sm disabled:opacity-50 hover:bg-gray-800 transition">
              {loading ? '変更中...' : 'パスワードを変更'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
