-- Insert additional default categories
-- These are system-wide categories that all users can access
-- is_default = true indicates these are built-in categories
-- Note: Some defaults already exist from initial migration, so we use ON CONFLICT

INSERT INTO categories (name, icon, color, category_type, is_default, user_id, family_id) VALUES
  -- Income & Savings
  ('Income', '💰', '#10b981', 'user', true, NULL, NULL),
  ('Savings', '🏦', '#3b82f6', 'user', true, NULL, NULL),
  ('Emergency Fund', '🚨', '#ef4444', 'user', true, NULL, NULL),
  ('Investments', '📈', '#8b5cf6', 'user', true, NULL, NULL),
  
  -- Housing (some may exist)
  ('Housing/Rent', '🏠', '#f59e0b', 'user', true, NULL, NULL),
  ('Internet/Phone', '📱', '#06b6d4', 'user', true, NULL, NULL),
  
  -- Transportation (some may exist)
  ('Fuel/Gas', '⛽', '#f97316', 'user', true, NULL, NULL),
  
  -- Food (some may exist)
  ('Groceries', '🛒', '#84cc16', 'user', true, NULL, NULL),
  ('Dining Out', '🍽️', '#ec4899', 'user', true, NULL, NULL),
  
  -- Personal
  ('Personal Care', '💅', '#a855f7', 'user', true, NULL, NULL),
  ('Clothing', '👔', '#6366f1', 'user', true, NULL, NULL),
  ('Subscriptions', '📺', '#8b5cf6', 'user', true, NULL, NULL),
  
  -- Debt & Insurance
  ('Debt Payments', '💳', '#dc2626', 'user', true, NULL, NULL),
  ('Insurance', '🛡️', '#059669', 'user', true, NULL, NULL),
  
  -- Other
  ('Giving/Charity', '❤️', '#f472b6', 'user', true, NULL, NULL),
  ('Miscellaneous', '📦', '#6b7280', 'user', true, NULL, NULL)
ON CONFLICT (name, user_id, family_id) DO NOTHING;
