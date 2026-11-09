ALTER TABLE user_profiles
  ADD COLUMN avatar_character smallint CHECK (avatar_character BETWEEN 1 AND 8),
  ADD COLUMN avatar_skin smallint CHECK (avatar_skin BETWEEN 1 AND 6),
  ADD COLUMN avatar_outfit text CHECK (avatar_outfit IN ('hoodie', 'shirt', 'jacket')),
  ADD COLUMN avatar_accessory text CHECK (avatar_accessory IN ('none', 'glasses', 'cap')),
  ADD COLUMN avatar_style text CHECK (avatar_style IN ('sky', 'mint', 'lilac')),
  ADD COLUMN avatar_customized_at timestamptz;
