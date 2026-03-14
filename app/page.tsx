"use client";

import { useState, useRef, useEffect } from "react";

type Mode = "symptom" | "treatment" | "business";
type Message = { role: "user" | "assistant"; content: string };

const MODES: { key: Mode; label: string; icon: string; placeholder: string; systemPrompt: string }[] = [
  {
    key: "symptom",
    label: "症状分析",
    icon: "🔍",
    placeholder: "患者の症状を入力してください（例: 40代女性、右肩の痛み、夜間痛あり、腕を上げると激痛）",
    systemPrompt: `あなたは経験豊富な治療家（柔道整復師・鍼灸師・整体師）向けのAIアシスタントです。
患者の症状情報を受け取り、以下の形式で分析結果を返してください：

【考えられる原因】箇条書きで3〜5個
【鑑別ポイント】確認すべき検査・質問
【注意すべきレッドフラグ】見逃してはいけない危険な兆候
【推奨される対応】施術方針・セルフケア指導

医療の専門用語は使いつつも、分かりやすく解説してください。
最終的な診断は医師に委ねるべきことを必ず注記してください。`,
  },
  {
    key: "treatment",
    label: "施術提案",
    icon: "💡",
    placeholder: "施術メニューの相談（例: 慢性腰痛の患者に対する施術プログラムを3回コースで提案して）",
    systemPrompt: `あなたは治療院の施術メニュー設計の専門家AIです。
以下の観点で施術プログラムを提案してください：

【施術内容】具体的な手技・アプローチ
【回数・頻度】推奨スケジュール
【各回の目標】回ごとのゴール設定
【セルフケア指導】患者への宿題
【説明トーク例】患者に分かりやすく説明するためのスクリプト

患者への説明が自然にできるよう、専門用語を噛み砕いた表現も併記してください。`,
  },
  {
    key: "business",
    label: "経営相談",
    icon: "📊",
    placeholder: "経営の相談（例: 月商200万円から250万円に上げたい。現在の平均単価は8,000円、月間来院数250人）",
    systemPrompt: `あなたは治療院経営コンサルタントAIです。
整体院・鍼灸院・整骨院の経営に精通しています。

以下の観点でアドバイスしてください：
【現状分析】数字ベースの課題抽出
【改善施策】具体的なアクションプラン（優先順位付き）
【売上シミュレーション】施策実行後の予測数値
【実行スケジュール】いつ何をやるか
【リスクと対策】注意点

データに基づいた具体的な数字を使い、明日から実行できるレベルの提案をしてください。`,
  },
];

export default function Home() {
  const [mode, setMode] = useState<Mode>("symptom");
  const [conversations, setConversations] = useState<Record<Mode, Message[]>>({
    symptom: [],
    treatment: [],
    business: [],
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMode = MODES.find((m) => m.key === mode)!;
  const messages = conversations[mode];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");

    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setConversations({ ...conversations, [mode]: newMessages });
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          systemPrompt: currentMode.systemPrompt,
        }),
      });
      const data = await res.json();
      if (data.content) {
        setConversations((prev) => ({
          ...prev,
          [mode]: [...newMessages, { role: "assistant", content: data.content }],
        }));
      }
    } catch {
      setConversations((prev) => ({
        ...prev,
        [mode]: [
          ...newMessages,
          { role: "assistant", content: "エラーが発生しました。もう一度お試しください。" },
        ],
      }));
    }
    setLoading(false);
  };

  const clearChat = () => {
    setConversations({ ...conversations, [mode]: [] });
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-lg font-black text-gray-800">治療家AIマスター</h1>
          <p className="text-xs text-gray-400">AI-powered Clinical Assistant</p>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} className="text-sm text-gray-400 hover:text-red-500">
            履歴クリア
          </button>
        )}
      </header>

      {/* Mode Tabs */}
      <div className="bg-white border-b px-4 flex gap-1 overflow-x-auto flex-shrink-0">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition ${
              mode === m.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-5xl mb-4">{currentMode.icon}</p>
            <h2 className="text-xl font-bold mb-2">{currentMode.label}モード</h2>
            <p className="text-sm text-gray-400 max-w-md mb-6">{currentMode.placeholder}</p>

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
                    className="text-left text-xs p-3 bg-white border rounded-lg text-gray-600 hover:border-blue-300 transition"
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
                    className="text-left text-xs p-3 bg-white border rounded-lg text-gray-600 hover:border-blue-300 transition"
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
                    className="text-left text-xs p-3 bg-white border rounded-lg text-gray-600 hover:border-blue-300 transition"
                  >
                    {example}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border shadow-sm text-gray-700"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border shadow-sm rounded-2xl px-4 py-3 text-sm text-gray-400">
              分析中...
            </div>
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
            className="flex-1 px-4 py-2 border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="px-6 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition flex-shrink-0"
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
}
