import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ページが見つかりません | 治療家AIマスター",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-black text-gray-200 mb-4">404</p>
        <h1 className="text-xl font-bold text-gray-800 mb-2">ページが見つかりません</h1>
        <p className="text-sm text-gray-500 mb-8">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          トップページに戻る
        </Link>
      </div>
    </div>
  );
}
