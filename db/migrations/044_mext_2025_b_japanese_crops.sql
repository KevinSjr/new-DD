-- Bring existing MEXT B installations in line with the per-item Japanese crops.
UPDATE mext_questions SET transcript='うえ
1 つくえの 上     パンが あります。
 A が         B で         C に        D を', asset_paths=ARRAY['/mext-assets/2025-b/japanese-i-q01.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='I' AND item_code='1';
UPDATE mext_questions SET transcript='やす                                い
2 あしたは 休みですね。    へ あそびに 行きませんか。
 A どう       B どうか      C どこ       D どこか', asset_paths=ARRAY['/mext-assets/2025-b/japanese-i-q02.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='I' AND item_code='2';
UPDATE mext_questions SET transcript='ひと                き
3 あの 人は おんがくを 聞き    、べんきょうを しています。
 A て         B たり       C とき       D ながら', asset_paths=ARRAY['/mext-assets/2025-b/japanese-i-q03.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='I' AND item_code='3';
UPDATE mext_questions SET transcript='4 しゅくだいを わすれて しまいました。    。
 A かしこまりました           B ごめんください
 C すみません              D どういたしまして', asset_paths=ARRAY['/mext-assets/2025-b/japanese-i-q04.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='I' AND item_code='4';
UPDATE mext_questions SET transcript='5 さむいから、    を つけました。
 A アパート     B ストーブ     C スポーツ    D レコード', asset_paths=ARRAY['/mext-assets/2025-b/japanese-i-q05.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='I' AND item_code='5';
UPDATE mext_questions SET transcript='たいふう  ひ  がっこう                  わたし              き
6 台風の日に学校へ    ところ、私のほかにだれも来ていなかった。
      い                 い                 い                 い
 A 行き       B 行く       C 行った     D 行って', asset_paths=ARRAY['/mext-assets/2025-b/japanese-i-q06.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='I' AND item_code='6';
UPDATE mext_questions SET transcript='にほんじん  とうぜんにほん          まも                  にほん   す         りゅうがくせい
7 日本人は当然日本のルールを守らなければならないが、日本に住んでいる留学生
           おな
      同じことです。
                                           たい
 A として      B にしても     C に対して    D につき', asset_paths=ARRAY['/mext-assets/2025-b/japanese-i-q07.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='I' AND item_code='7';
UPDATE mext_questions SET transcript='みち  こ                        おく                  もう  わけ
8 道が混んでいた    だから、遅れてしまいました。申し訳ありません。
 A こと       B ところ      C ほど       D もの



                                     1  / 9', asset_paths=ARRAY['/mext-assets/2025-b/japanese-i-q08.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='I' AND item_code='8';
UPDATE mext_questions SET transcript='やまだ      こんど  にちようび  えいが   い
9 山田さん：「今度の日曜日、映画に行きませんか。」
   たなか                   ひ  ようじ                   こんど
  田中さん：「    その日は用事があるんです。ぜひ、また今度さそってください。」
 A あいにく     B せっかく     C どうにか    D ひとまず', asset_paths=ARRAY['/mext-assets/2025-b/japanese-i-q09.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='I' AND item_code='9';
UPDATE mext_questions SET transcript='みじか  じかん  ふくざつ  けいさん
10 コンピューターを    ば、短い時間で複雑な計算をすることができる。
 A かかえれ     B ふくめれ     C もちいれ    D めいじれ', asset_paths=ARRAY['/mext-assets/2025-b/japanese-i-q10.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='I' AND item_code='10';
UPDATE mext_questions SET transcript='はったつ                  わたし      せいかつ  べんり         い
11 ＡＩが発達    するほど、私たちの生活は便利になると言われている。
 A しつつ      B しても      C すれば     D せずに', asset_paths=ARRAY['/mext-assets/2025-b/japanese-i-q11.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='I' AND item_code='11';
UPDATE mext_questions SET transcript='12 ジンさんは翻訳の仕事で生計を    。
 A 置いている   B 立てている   C つけている   D 取っている', asset_paths=ARRAY['/mext-assets/2025-b/japanese-i-q12.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='I' AND item_code='12';
UPDATE mext_questions SET transcript='13 駅前の自転車を撤去しても、またすぐに止められてしまう。これでは

  ごっこだ。
 A いたち      B きつね      C たぬき     D むじな', asset_paths=ARRAY['/mext-assets/2025-b/japanese-i-q13.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='I' AND item_code='13';
UPDATE mext_questions SET transcript='14 うちの犬は、雨の中を走り回ったせいで泥    になってしまった。
 A すぎ       B ずくめ      C づめ       D まみれ', asset_paths=ARRAY['/mext-assets/2025-b/japanese-i-q14.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='I' AND item_code='14';
UPDATE mext_questions SET transcript='15 そのレストランは、静かな住宅    の中にある。
 A 所         B 地         C 帯        D 場', asset_paths=ARRAY['/mext-assets/2025-b/japanese-i-q15.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='I' AND item_code='15';
UPDATE mext_questions SET transcript='16 親友の頼み    、断るわけにはいかない。
 A とあれば     B はおろか     C にひきかえ   D にもまして', asset_paths=ARRAY['/mext-assets/2025-b/japanese-i-q16.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='I' AND item_code='16';
UPDATE mext_questions SET transcript='17 友だちに借りたゲームを壊してしまい、弁償しない    と思っている。
 A ではすまない              B までもない
 C にはあたらない            D ものでもない', asset_paths=ARRAY['/mext-assets/2025-b/japanese-i-q17.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='I' AND item_code='17';
UPDATE mext_questions SET transcript='1 さいきん、おくさんは おげんきですか。
 A あに       B あね       C おっと     D つま', asset_paths=ARRAY['/mext-assets/2025-b/japanese-ii-q01.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='II' AND item_code='1';
UPDATE mext_questions SET transcript='いま  せんせい
2 今、先生は るすです。
 A いそがしくありません         B げんきではありません
     じかん
 C 時間が ありません         D へやに いません', asset_paths=ARRAY['/mext-assets/2025-b/japanese-ii-q02.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='II' AND item_code='2';
UPDATE mext_questions SET transcript='やまだ
3 山田さん：「ここで たばこを すっても いいですか。」
   たなか
  田中さん：「かまいませんよ。」
 A いいですよ   B しりませんよ  C すいませんよ  D だめですよ', asset_paths=ARRAY['/mext-assets/2025-b/japanese-ii-q03.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='II' AND item_code='3';
UPDATE mext_questions SET transcript='ひと
4 この人は わたしの おじです。
     はは    ちち          はは                ちち    はは          ちち
 A 母の 父     B 母の あに   C 父の 母    D 父の あね', asset_paths=ARRAY['/mext-assets/2025-b/japanese-ii-q04.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='II' AND item_code='4';
UPDATE mext_questions SET transcript='たなか            やす                  い
5 田中さんは なつ休みに フランスへ 行くそうだ。
      い                                   い
 A 行かなければならない         B 行くことができる
      い    おも                             い     き
 C 行くと思う              D 行くと聞いた', asset_paths=ARRAY['/mext-assets/2025-b/japanese-ii-q05.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='II' AND item_code='5';
UPDATE mext_questions SET transcript='むずか    もんだい      じぶん            かいけつほうほう  かんが
6 どんなに難しい問題でも、自分たちにできる解決方法を考えようではないか。
     いっしょ  かんが                           かんが
 A 一緒に考えよう            B 考えようとしないのはだめだ
     かんが                                         かんが
 C 考えるべきではないか       D きちんと考えてほしい





                                     3  / 9', asset_paths=ARRAY['/mext-assets/2025-b/japanese-ii-q06.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='II' AND item_code='6';
UPDATE mext_questions SET transcript='あいて   ち い  ねんれい                 あいて  そんちょう         だいじ
7 相手の地位や年齢にかかわらず、いつも相手を尊重することが大事だ。
       おう                かんけい
 A に応じて     B に関係なく   C について    D によって', asset_paths=ARRAY['/mext-assets/2025-b/japanese-ii-q07.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='II' AND item_code='7';
UPDATE mext_questions SET transcript='かれ  ひょうじょう                              し
8 彼の表情からすると、まだこのニュースは知らないようだ。
     かれ  ひょうじょう  あらわ                     かれ  ひょうじょう    かんが
 A 彼の表情が表しているのに    B 彼の表情から考えると
     かれ  ひょうじょう      わ                  かれ  ひょうじょう
 C 彼の表情からは分からないが   D 彼の表情のとおりに', asset_paths=ARRAY['/mext-assets/2025-b/japanese-ii-q08.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='II' AND item_code='8';
UPDATE mext_questions SET transcript='よ  なか        りょこうちゅう  き        こうどう
9 ぶっそうな世の中だから、旅行中は気をつけて行動してくださいね。
     きけん                                ひと  おお          ぶっか  たか
 A 危険な      B さわがしい   C 人が多い    D 物価が高い', asset_paths=ARRAY['/mext-assets/2025-b/japanese-ii-q09.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='II' AND item_code='9';
UPDATE mext_questions SET transcript='がっこう            あたら    ほうほう  と   い     きょういく
10 この学校では、いつも新しい方法を取り入れて教育をしています。
     さいよう              さくせい              はっけん             ゆにゅう
 A 採用して     B 作成して     C 発見して    D 輸入して', asset_paths=ARRAY['/mext-assets/2025-b/japanese-ii-q10.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='II' AND item_code='10';
UPDATE mext_questions SET transcript='さいふ           お
11 しまった。財布をどこかで落としたみたいだ。
      き  どく            ざんねん              しっぱい
 A 気の毒だ     B 残念だ      C 失敗した    D びっくりした', asset_paths=ARRAY['/mext-assets/2025-b/japanese-ii-q11.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='II' AND item_code='11';
UPDATE mext_questions SET transcript='12 健康であるがゆえに、勉強にも集中して取り組める。
 A あったところで             B あることとて
 C あるものを              D あればこそ', asset_paths=ARRAY['/mext-assets/2025-b/japanese-ii-q12.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='II' AND item_code='12';
UPDATE mext_questions SET transcript='13 長年の願いが実現して、日本に留学することができた。
 A かさんで     B かなって     C かばって    D からんで', asset_paths=ARRAY['/mext-assets/2025-b/japanese-ii-q13.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='II' AND item_code='13';
UPDATE mext_questions SET transcript='14 政府は、災害時の行動に関するガイドラインを発表した。
 A 指針       B 指摘       C 指名       D 指令', asset_paths=ARRAY['/mext-assets/2025-b/japanese-ii-q14.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='II' AND item_code='14';
UPDATE mext_questions SET transcript='15 今日は大事を取って、学校を休むことにした。
 A うそをついて              B 思い切って
 C 無理をしないで            D 重要な用件で', asset_paths=ARRAY['/mext-assets/2025-b/japanese-ii-q15.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='II' AND item_code='15';
UPDATE mext_questions SET transcript='16 彼は重い病気にかかり、退学しなければならなかった。
 A 退学してやまなかった         B 退学しないではおかなかった
 C 退学を禁じえなかった        D 退学を余儀なくされた




                                     4  / 9', asset_paths=ARRAY['/mext-assets/2025-b/japanese-ii-q16.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='II' AND item_code='16';
UPDATE mext_questions SET transcript='17 昨日、大切なメールが来ていたのに気づかなかった。
 A 見おとしていた             B 見かけていた
 C 見はからっていた           D 見わたしていた', asset_paths=ARRAY['/mext-assets/2025-b/japanese-ii-q17.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='II' AND item_code='17';
UPDATE mext_questions SET transcript='1 朝の通勤時間は、電車がこん雑している。
 A 今年の売上は去年に比べて10％もました。
 B 彼女はいつもきれいなスカーフをまいている。
 C さとうと塩を間違えてまぜてしまった。
 D 父はお金のために考えをまげるような人ではない。', asset_paths=ARRAY['/mext-assets/2025-b/japanese-iii-q01.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='III' AND item_code='1';
UPDATE mext_questions SET transcript='2 この植物は温帯地域に分ぷしている。
 A この夫ふの間には子どもが二人いる。
 B 母は歴史についての知識が豊ふだ。
 C 山田さんは大きな虫を見た恐ふで、全く動けなくなった。
 D 私は夏でも毛ふをかけて寝る。', asset_paths=ARRAY['/mext-assets/2025-b/japanese-iii-q02.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='III' AND item_code='2';
UPDATE mext_questions SET transcript='3 この地域には古くからの独特な習慣やきまりがある。
 A 彼女の意見はたくさんの賛成を得て、可けつされた。
 B この商品はいくつかのけっ点がある。
 C 事故で大けがをして、輸けつを受けた。
 D 努力してもけっ果を出すことができなかった。', asset_paths=ARRAY['/mext-assets/2025-b/japanese-iii-q03.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='III' AND item_code='3';
UPDATE mext_questions SET transcript='4 試験で大きなミスをおかした。
 A 今までの行動を深くはん省している。
 B この店には、たくさんの防はんカメラがある。
 C このワンピースは大きい店だけではん売されている。
 D 田中さんの新しい計画は多くの人々から批はんを受けた。', asset_paths=ARRAY['/mext-assets/2025-b/japanese-iii-q04.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='III' AND item_code='4';
UPDATE mext_questions SET transcript='5 誰もがその光景に、一瞬自分の目をうたがった。
 A 兄はこの街をよくするためにぎ員になった。
 B この映画の主役の演ぎはとても自然で感動した。
 C 定ぎは図を描くときに便利だ。
 D 山田さんの言っていることにはぎ問を感じている。', asset_paths=ARRAY['/mext-assets/2025-b/japanese-iii-q05.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='III' AND item_code='5';
UPDATE mext_questions SET transcript='6 山田さんの言葉遣いは多くの人の気にさわった。
 A 姉は合しょうのソロパートを担当することになった。
 B 社会保しょうは国民の生活を支えるためにある。
 C 他人のことには干しょうしないことにしている。
 D チームの優勝は長年にわたる努力の結しょうだ。', asset_paths=ARRAY['/mext-assets/2025-b/japanese-iii-q06.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='III' AND item_code='6';
UPDATE mext_questions SET transcript='7 大きな試験が終わり、緊張がゆるんだ。
 A 大きな花火が打ち上げられ、観客はかん声を上げた。
 B 異なる文化にかん容を示すことは簡単ではない。
 C 政府は、経済を回復させるために規制のかん和を進めている。
 D 浜辺にゴミが捨てられないように、かん視を強化した。', asset_paths=ARRAY['/mext-assets/2025-b/japanese-iii-q07.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='III' AND item_code='7';
UPDATE mext_questions SET transcript='8 この意見は一がいに間違っているとも言い切れない。
 A 多くの科学者がこの問題を解くために生がいを捧げた。
 B 技術の発展とともに時間のがい念も変化してきた。
 C 社員たちは会社のひどいやり方に憤がいして、ストライキを起こした。
 D 理由のない遅刻は会社の規則違反にがい当する。', asset_paths=ARRAY['/mext-assets/2025-b/japanese-iii-q08.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='III' AND item_code='8';
UPDATE mext_questions SET transcript='9 警察は事件の証こを見つけることができなかった。
 A 彼が発明したものはすべて特きょを取っている。
 B 田中さんは会社の難しい要求にきょ絶の態度を示した。
 C 泊まっているホテルから街までかなりのきょ離がある。
 D 賛成してもらうためには、明確な根きょが必要だ。', asset_paths=ARRAY['/mext-assets/2025-b/japanese-iii-q09.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='III' AND item_code='9';
UPDATE mext_questions SET transcript='10 祖母は何歳になっても、新しいことにいどみ続けている。
 A あの公園の中央にはちょう像が設置されている。
 B 高校生のときに大学の授業をちょう講したが、ほとんど理解できなかった。
 C 世界記録にちょう戦したが、あえなく失敗してしまった。
 D この旗は国の独立と自由の象ちょうとなっている。', asset_paths=ARRAY['/mext-assets/2025-b/japanese-iii-q10.jpg']::text[] WHERE edition=2025 AND track='B' AND subject='japanese' AND section='III' AND item_code='10';
