"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-2xl text-red-500 font-bold">!</span>
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          エラーが発生しました
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          予期しないエラーが発生しました。再試行するか、ページをリロードしてください。
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
            aria-label="再試行"
          >
            再試行
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition"
            aria-label="ページをリロード"
          >
            リロード
          </button>
        </div>
      </div>
    </div>
  );
}
