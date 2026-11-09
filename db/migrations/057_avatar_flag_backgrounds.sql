ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_avatar_style_check;

UPDATE user_profiles SET avatar_style='brasil'
WHERE avatar_character IS NOT NULL AND (avatar_style IS NULL OR avatar_style IN ('sky','mint','lilac'));

ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_avatar_style_check CHECK (avatar_style IN (
  'brasil','alemanha','australia','belgica','canada','china','coreia-do-sul','dinamarca',
  'espanha','estados-unidos','finlandia','franca','paises-baixos','irlanda','italia',
  'japao','malasia','noruega','portugal','reino-unido','singapura','suica','suecia',
  'taiwan','hong-kong','nova-zelandia'
));
