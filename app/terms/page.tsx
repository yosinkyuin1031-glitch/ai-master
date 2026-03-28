import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 | 治療家AIマスター",
  description: "治療家AIマスターの利用規約",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-black text-gray-800 hover:text-blue-600 transition-colors">
            治療家AIマスター
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            ← アプリに戻る
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-black text-gray-800 mb-2">利用規約</h1>
        <p className="text-sm text-gray-400 mb-8">最終更新日：2026年3月28日</p>

        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">第1条（適用）</h2>
            <p>
              本利用規約（以下「本規約」）は、株式会社ROLE OWL（以下「当社」）が提供するSaaSサービス「治療家AIマスター」（以下「本サービス」）の利用に関する条件を定めるものです。本サービスをご利用いただくことで、本規約に同意したものとみなします。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">第2条（サービスの内容）</h2>
            <p>
              本サービスは、治療家（柔道整復師・鍼灸師・整体師・理学療法士・その他医療・健康関連従事者）を対象とし、AIを活用した症状分析補助・施術提案・経営相談機能を提供するウェブアプリケーションです。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">第3条（AI回答に関する免責事項）</h2>
            <div className="space-y-3">
              <p>
                本サービスが提供するAIの回答は、一般的な情報提供・参考情報の提示を目的としており、以下の点について利用者は十分にご理解ください。
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>AIの回答は医療診断、医学的治療の指示、または法的アドバイスを構成するものではありません。</li>
                <li>AIの回答の正確性・完全性・最新性を当社は保証しません。</li>
                <li>実際の患者への対応・診断・治療方針は、利用者自身の専門的判断および患者との直接的なコミュニケーションに基づいて行ってください。</li>
                <li>AIの回答を患者に直接提示する場合は、必ず内容を確認・加工し、利用者の責任において使用してください。</li>
                <li>深刻な症状・緊急性が疑われる場合は、速やかに医療機関への受診を勧めてください。</li>
              </ul>
              <p>
                当社は、AIの回答に基づく利用者または第三者の行動・判断によって生じたいかなる損害についても、一切の責任を負いません。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">第4条（禁止事項）</h2>
            <p className="mb-2">利用者は、本サービスにおいて以下の行為を行ってはなりません。</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>法令または公序良俗に違反する行為</li>
              <li>個人情報（患者氏名・連絡先・生年月日等）を入力する行為</li>
              <li>本サービスを第三者に再販・転用・提供する行為</li>
              <li>本サービスのリバースエンジニアリング・解析・改ざんを試みる行為</li>
              <li>当社または第三者の著作権・商標権その他の知的財産権を侵害する行為</li>
              <li>本サービスの正常な運営を妨害する行為</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">第5条（個人情報の取り扱い）</h2>
            <p>
              当社は、利用者の個人情報を<Link href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</Link>に従って適切に管理します。患者の個人情報を本サービスに入力しないよう、利用者の責任においてご注意ください。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">第6条（知的財産権）</h2>
            <p>
              本サービスに関連するシステム・デザイン・コンテンツ等の知的財産権はすべて当社に帰属します。利用者がAIとのやり取りで生成したテキストについては、利用者自身が自由に利用できます。ただし、当社はサービス改善・モデル学習等の目的でやり取りの内容を利用する場合があります。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">第7条（サービスの変更・停止）</h2>
            <p>
              当社は、事前の通知なくサービス内容の変更・一時停止・終了を行う場合があります。これにより利用者に生じた損害について、当社は責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">第8条（免責事項）</h2>
            <p>
              当社は、本サービスの利用によって生じたいかなる損害（直接損害・間接損害・特別損害・逸失利益を含む）についても、当社に故意または重大な過失がある場合を除き、一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">第9条（準拠法・管轄裁判所）</h2>
            <p>
              本規約は日本法に準拠します。本サービスに関する紛争については、当社所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">第10条（規約の変更）</h2>
            <p>
              当社は、必要に応じて本規約を変更できるものとします。変更後の規約は本サービス上に掲示した時点から効力を生じます。変更後も本サービスを継続して利用した場合、変更後の規約に同意したものとみなします。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">お問い合わせ</h2>
            <p>
              本規約に関するお問い合わせは、以下の運営者情報までご連絡ください。
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-xl text-sm space-y-1">
              <p><span className="font-medium">運営会社：</span>株式会社ROLE OWL</p>
              <p><span className="font-medium">サービス名：</span>治療家AIマスター</p>
            </div>
          </section>

        </div>
      </main>

      <footer className="border-t bg-white mt-10">
        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>© 2026 株式会社ROLE OWL. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-gray-600 transition-colors">利用規約</Link>
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">プライバシーポリシー</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
