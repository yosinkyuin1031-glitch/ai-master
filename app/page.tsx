"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { ToastContainer, useToast } from "./components/ui/Toast";

type Mode = "symptom" | "treatment" | "business";
type Message = { role: "user" | "assistant"; content: string };

/** Skeleton loader shown during hydration */
function HydrationSkeleton() {
  return (
    <div className="h-screen flex flex-col bg-gray-50" aria-busy="true" aria-label="アプリを読み込み中">
      {/* Header skeleton */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
        <div>
          <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-36 bg-gray-100 rounded animate-pulse mt-1.5" />
        </div>
      </div>
      {/* Tabs skeleton */}
      <div className="bg-white border-b px-4 flex gap-1 flex-shrink-0 py-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 w-24 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
      {/* Content skeleton */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full animate-pulse" />
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
      </div>
      {/* Input skeleton */}
      <div className="bg-white border-t px-4 py-3 flex-shrink-0">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <div className="flex-1 h-16 bg-gray-100 rounded-xl animate-pulse" />
          <div className="w-20 h-16 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/** Confirmation modal (replaces window.confirm) */
function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6 animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
            aria-label="キャンセル"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600 rounded-lg font-medium transition"
            aria-label={confirmLabel ?? "確認"}
          >
            {confirmLabel ?? "確認"}
          </button>
        </div>
      </div>
    </div>
  );
}

const MODES: {
  key: Mode;
  label: string;
  icon: string;
  placeholder: string;
  systemPrompt: string;
}[] = [
  {
    key: "symptom",
    label: "症状分析",
    icon: "🔍",
    placeholder:
      "患者の症状を入力してください（例: 40代女性、右肩の痛み、夜間痛あり、腕を上げると激痛）",
    systemPrompt: `あなたは経験豊富な治療家（柔道整復師・鍼灸師・整体師）向けのAIアシスタントです。
患者の症状情報を受け取り、以下の形式で分析結果を返してください：

## 考えられる原因
箇条書きで3〜5個

## 鑑別ポイント
確認すべき検査・質問

## 注意すべきレッドフラグ
見逃してはいけない危険な兆候

## 推奨される対応
施術方針・セルフケア指導

医療の専門用語は使いつつも、分かりやすく解説してください。
最終的な診断は医師に委ねるべきことを必ず注記してください。`,
  },
  {
    key: "treatment",
    label: "施術提案",
    icon: "💡",
    placeholder:
      "施術メニューの相談（例: 慢性腰痛の患者に対する施術プログラムを3回コースで提案して）",
    systemPrompt: `あなたは治療院の施術メニュー設計の専門家AIです。
以下の観点で施術プログラムを提案してください：

## 施術内容
具体的な手技・アプローチ

## 回数・頻度
推奨スケジュール

## 各回の目標
回ごとのゴール設定

## セルフケア指導
患者への宿題

## 説明トーク例
患者に分かりやすく説明するためのスクリプト

患者への説明が自然にできるよう、専門用語を噛み砕いた表現も併記してください。`,
  },
  {
    key: "business",
    label: "経営相談",
    icon: "📊",
    placeholder:
      "経営の相談（例: 月商200万円から250万円に上げたい。現在の平均単価は8,000円、月間来院数250人）",
    systemPrompt: `あなたは治療院経営コンサルタントAIです。
整体院・鍼灸院・整骨院の経営に精通しています。

以下の観点でアドバイスしてください：

## 現状分析
数字ベースの課題抽出

## 改善施策
具体的なアクションプラン（優先順位付き）

## 売上シミュレーション
施策実行後の予測数値

## 実行スケジュール
いつ何をやるか

## リスクと対策
注意点

データに基づいた具体的な数字を使い、明日から実行できるレベルの提案をしてください。`,
  },
];

const STORAGE_KEY = "aimaster_conversations_v1";

function LoadingDots() {
  return (
    <div className="flex items-center gap-1 px-2 py-1">
      <span className="text-xs text-gray-400 mr-1">分析中</span>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function AssistantMessage({
  content,
  onCopyToast,
}: {
  content: string;
  onCopyToast: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    onCopyToast();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-start">
      <div className="max-w-[88%] group">
        <div className="bg-white border shadow-sm rounded-2xl px-4 py-3 text-sm leading-relaxed text-gray-700">
          {/* マークダウンレンダリング */}
          <div className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-headings:font-bold prose-h2:text-base prose-h2:mt-3 prose-h2:mb-1 prose-h3:text-sm prose-h3:mt-2 prose-h3:mb-1 prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-code:text-xs">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="text-sm font-bold text-blue-700 mt-3 mb-1 pb-1 border-b border-blue-100">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-semibold text-gray-700 mt-2 mb-1">
                    {children}
                  </h3>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-0.5 my-1 text-gray-700">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-0.5 my-1 text-gray-700">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-sm text-gray-700">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-gray-900">{children}</strong>
                ),
                p: ({ children }) => (
                  <p className="text-sm text-gray-700 my-1 leading-relaxed">
                    {children}
                  </p>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-50 border rounded-lg p-3 my-2 overflow-x-auto text-xs">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-300 pl-3 my-2 text-gray-600 italic">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
        {/* コピーボタン（ホバー時または常時表示） */}
        <div className="flex justify-end mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            title="回答をコピー"
            aria-label={copied ? "コピー済み" : "回答をクリップボードにコピー"}
            className={`
              flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-all
              ${
                copied
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-400 hover:text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            {copied ? "✓ コピー済み" : "⧉ 回答をコピー"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("symptom");
  const [conversations, setConversations] = useState<Record<Mode, Message[]>>({
    symptom: [],
    treatment: [],
    business: [],
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { toasts, addToast, removeToast } = useToast();

  const currentMode = MODES.find((m) => m.key === mode)!;
  const messages = conversations[mode];

  // LocalStorageから会話を復元
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setConversations(parsed);
      }
    } catch {
      // パース失敗は無視
    }
    setHydrated(true);
  }, []);

  // 会話が変わったらLocalStorageに保存
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch {
      // ストレージ容量不足等は無視
    }
  }, [conversations, hydrated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (retryMessages?: Message[]) => {
      const targetMessages = retryMessages ?? messages;
      const userMessage = input.trim();

      if (!retryMessages) {
        if (!userMessage || loading) return;
        setInput("");
      }

      const newMessages: Message[] = retryMessages ?? [
        ...targetMessages,
        { role: "user", content: userMessage },
      ];

      if (!retryMessages) {
        setConversations((prev) => ({ ...prev, [mode]: newMessages }));
      }

      setLoading(true);

      // タイムアウト付きAbortController（30秒）
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages,
            systemPrompt: currentMode.systemPrompt,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.error ?? `サーバーエラー (${res.status})`
          );
        }

        const data = await res.json();
        if (data.content) {
          setConversations((prev) => ({
            ...prev,
            [mode]: [
              ...newMessages,
              { role: "assistant", content: data.content },
            ],
          }));
        }
      } catch (err) {
        clearTimeout(timeoutId);

        if (err instanceof Error && err.name === "AbortError") {
          addToast("タイムアウトしました。もう一度お試しください。", "error");
        } else {
          const errMsg =
            err instanceof Error ? err.message : "不明なエラーが発生しました";
          addToast(`エラー: ${errMsg}`, "error");
        }

        // エラー時はユーザーメッセージまで巻き戻す（リトライできるように）
        setConversations((prev) => ({
          ...prev,
          [mode]: newMessages,
        }));
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [input, loading, messages, mode, currentMode.systemPrompt, addToast]
  );

  const handleRetry = () => {
    // 最後のユーザーメッセージまでを渡してリトライ
    const lastUserIdx = [...messages]
      .reverse()
      .findIndex((m) => m.role === "user");
    if (lastUserIdx === -1) return;
    const sliceIdx = messages.length - lastUserIdx;
    const retryMsgs = messages.slice(0, sliceIdx);
    sendMessage(retryMsgs);
  };

  const clearChat = () => {
    setShowClearConfirm(true);
  };

  const confirmClearChat = () => {
    setConversations((prev) => ({ ...prev, [mode]: [] }));
    setShowClearConfirm(false);
    addToast("会話履歴をクリアしました", "info");
  };

  const handleCopyToast = () => {
    addToast("回答をコピーしました", "success");
  };

  // Hydration前はスケルトンを表示（LocalStorage読み込み待ち）
  if (!hydrated) {
    return <HydrationSkeleton />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toast通知 */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* 会話クリア確認モーダル */}
      <ConfirmModal
        open={showClearConfirm}
        title="会話をクリア"
        message={`${currentMode.label}モードの会話履歴をすべて削除します。この操作は元に戻せません。`}
        confirmLabel="クリアする"
        onConfirm={confirmClearChat}
        onCancel={() => setShowClearConfirm(false)}
      />

      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
        <div>
          <h1 className="text-lg font-black text-gray-800">治療家AIマスター</h1>
          <p className="text-xs text-gray-400">AI-powered Clinical Assistant</p>
        </div>
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
              aria-label={`${currentMode.label}の会話をクリア`}
            >
              会話をクリア
            </button>
          )}
        </div>
      </header>

      {/* Mode Tabs */}
      <nav className="bg-white border-b px-4 flex gap-1 overflow-x-auto flex-shrink-0" role="tablist" aria-label="モード切り替え">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            role="tab"
            aria-selected={mode === m.key}
            aria-label={`${m.label}モードに切り替え`}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition ${
              mode === m.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {m.icon} {m.label}
            {conversations[m.key].length > 0 && (
              <span className="ml-1.5 text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                {Math.ceil(conversations[m.key].length / 2)}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" role="log" aria-label="チャット履歴" aria-live="polite">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-5xl mb-4">{currentMode.icon}</p>
            <h2 className="text-xl font-bold mb-2">{currentMode.label}モード</h2>
            <p className="text-sm text-gray-400 max-w-md mb-6">
              {currentMode.placeholder}
            </p>

            {mode === "symptom" && (
              <div className="grid grid-cols-2 gap-2 max-w-md">
                {[
                  "50代男性、腰痛（前屈で悪化、朝が特にきつい）",
                  "30代女性、頭痛・肩こり・めまい（デスクワーク8時間）",
                  "60代女性、膝の痛み（階段で悪化、正座不可）",
                  "40代男性、首の痛み・手のしびれ（右側のみ）",
                ].map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(example)}
                    aria-label={`例文を入力: ${example}`}
                    className="text-left text-xs p-3 bg-white border rounded-lg text-gray-600 hover:border-blue-300 hover:shadow-sm transition"
                  >
                    {example}
                  </button>
                ))}
              </div>
            )}

            {mode === "treatment" && (
              <div className="grid grid-cols-1 gap-2 max-w-md">
                {[
                  "五十肩の患者に6回コースの施術プログラムを提案して",
                  "自律神経失調症の患者への施術方針と説明トーク例",
                  "産後の骨盤矯正プログラム（全8回）の内容と価格設定",
                ].map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(example)}
                    aria-label={`例文を入力: ${example}`}
                    className="text-left text-xs p-3 bg-white border rounded-lg text-gray-600 hover:border-blue-300 hover:shadow-sm transition"
                  >
                    {example}
                  </button>
                ))}
              </div>
            )}

            {mode === "business" && (
              <div className="grid grid-cols-1 gap-2 max-w-md">
                {[
                  "月商200万→250万にするための具体的施策（1人院長、平均単価8,000円）",
                  "リピート率を60%→80%に上げるための仕組みを教えて",
                  "高額メニュー（月25,000円コース）の導入戦略",
                ].map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(example)}
                    aria-label={`例文を入力: ${example}`}
                    className="text-left text-xs p-3 bg-white border rounded-lg text-gray-600 hover:border-blue-300 hover:shadow-sm transition"
                  >
                    {example}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((msg, i) =>
          msg.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[75%] bg-blue-600 text-white rounded-2xl px-4 py-3 text-sm leading-relaxed">
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ) : (
            <AssistantMessage
              key={i}
              content={msg.content}
              onCopyToast={handleCopyToast}
            />
          )
        )}

        {/* ローディングアニメーション */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border shadow-sm rounded-2xl px-4 py-3">
              <LoadingDots />
            </div>
          </div>
        )}

        {/* リトライボタン（エラー後にユーザーメッセージが最後の場合） */}
        {!loading &&
          messages.length > 0 &&
          messages[messages.length - 1].role === "user" && (
            <div className="flex justify-start">
              <button
                onClick={handleRetry}
                aria-label="最後のメッセージを再送信"
                className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
              >
                <span>↻</span>
                <span>もう一度試す</span>
              </button>
            </div>
          )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t px-4 py-3 flex-shrink-0">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={currentMode.placeholder}
            rows={2}
            disabled={loading}
            aria-label={`${currentMode.label}の質問を入力`}
            className="flex-1 px-4 py-2 border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400 transition"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            aria-label={loading ? "送信中" : "メッセージを送信"}
            className="px-6 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition flex-shrink-0 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>送信中</span>
              </>
            ) : (
              <span>送信</span>
            )}
          </button>
        </div>
        <p className="text-center text-xs text-gray-300 mt-2">
          Enter で送信　Shift+Enter で改行　会話はブラウザに自動保存されます
        </p>
      </div>
    </div>
  );
}
