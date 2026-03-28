import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | 治療家AIマスター",
  description: "治療家AIマスターのプライバシーポリシー",
};

export default function PrivacyPage() {
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
        <h1 className="text-2xl font-black text-gray-800 mb-2">プライバシーポリシー</h1>
        <p className="text-sm text-gray-400 mb-8">最終更新日：2026年3月28日</p>

        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">1. 事業者情報</h2>
            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <p><span className="font-medium">運営会社：</span>株式会社ROLE OWL</p>
              <p><span className="font-medium">サービス名：</span>治療家AIマスター</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">2. 収集する情報</h2>
            <p className="mb-3">本サービスでは、以下の情報を収集する場合があります。</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>本サービスへの入力内容（AIとの会話テキスト）</li>
              <li>アクセスログ（IPアドレス・ブラウザ種別・OS・アクセス日時）</li>
              <li>Cookie・ローカルストレージに保存されるデータ（会話履歴等）</li>
            </ul>
            <p className="mt-3 text-gray-500">
              ※ 本サービスはアカウント登録不要のため、氏名・メールアドレス等の個人識別情報は原則として収集しません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">3. 情報の利用目的</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>本サービスの提供・維持・改善</li>
              <li>AIモデルの精度向上（匿名化処理後）</li>
              <li>不正利用の防止・セキュリティ確保</li>
              <li>利用状況の分析・統計データの作成</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">4. 第三者への提供</h2>
            <p className="mb-3">当社は、以下の場合を除き、収集した情報を第三者に提供しません。</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>法令に基づく場合</li>
              <li>人の生命・身体・財産を保護するために必要な場合</li>
              <li>本サービスの運営に必要な業務委託先（守秘義務契約締結済み）への提供</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">5. AIサービス（Anthropic）との関係</h2>
            <p className="mb-3">
              本サービスは、Anthropic社が提供するAI（Claude）を利用しています。入力された会話テキストはAnthropicのAPIサーバーに送信されます。Anthropicにおける個人情報の取り扱いについては、<a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Anthropicのプライバシーポリシー</a>をご確認ください。
            </p>
            <p className="text-amber-700 bg-amber-50 rounded-xl p-3 border border-amber-200">
              患者の個人情報（氏名・連絡先・生年月日等）は絶対に入力しないでください。患者を特定できない形での症状・状況の記載にとどめてください。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">6. Cookie・ローカルストレージ</h2>
            <p className="mb-2">
              本サービスは、会話履歴の保存にブラウザのローカルストレージを使用しています。これは利用者のブラウザ内にのみ保存され、当社サーバーには送信されません。ブラウザの設定またはアプリ内の「会話をクリア」機能で削除できます。
            </p>
            <p>
              また、アクセス解析のためにCookieを使用する場合があります。ブラウザの設定でCookieを無効にすることができますが、一部の機能が正常に動作しない場合があります。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">7. セキュリティ</h2>
            <p>
              当社は、収集した情報の漏洩・滅失・毀損を防止するため、適切なセキュリティ対策を講じます。ただし、インターネット上の通信において完全な安全性を保証することはできません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">8. 未成年者の利用</h2>
            <p>
              本サービスは治療家・医療健康関連従事者を対象としています。18歳未満の方の利用は想定しておりません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">9. プライバシーポリシーの変更</h2>
            <p>
              当社は、法令変更やサービス内容の変更に応じて、本ポリシーを改定することがあります。改定後は本ページに掲載し、最終更新日を更新します。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">10. お問い合わせ</h2>
            <p>
              本ポリシーに関するご質問・ご意見は、本サービスの運営者までお問い合わせください。
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-xl space-y-1">
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
