-- 治療家AIマスター: 会話保存テーブル
CREATE TABLE IF NOT EXISTS ai_master_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('symptom', 'treatment', 'business')),
  messages JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ユーザーごとにモードは1つだけ（upsert用）
CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_master_conv_user_mode
  ON ai_master_conversations (user_id, mode);

-- RLS有効化
ALTER TABLE ai_master_conversations ENABLE ROW LEVEL SECURITY;

-- 自分のデータだけ参照可能
CREATE POLICY "Users can view own conversations"
  ON ai_master_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON ai_master_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON ai_master_conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON ai_master_conversations FOR DELETE
  USING (auth.uid() = user_id);
