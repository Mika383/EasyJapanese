export interface AlphabetChar {
  hiragana: string;
  katakana: string;
  romaji: string;
  type: 'basic' | 'dakuten' | 'handakuten' | 'youon';
  examples?: { word: string; romaji: string; meaning: string }[];
}

export const BASIC_CHARS: AlphabetChar[] = [
  { 
    hiragana: "あ", katakana: "ア", romaji: "a", type: 'basic',
    examples: [{ word: "あさ", romaji: "asa", meaning: "Buổi sáng" }, { word: "あき", romaji: "aki", meaning: "Mùa thu" }]
  },
  { 
    hiragana: "い", katakana: "イ", romaji: "i", type: 'basic',
    examples: [{ word: "いぬ", romaji: "inu", meaning: "Con chó" }, { word: "いち", romaji: "ichi", meaning: "Số một" }]
  },
  { 
    hiragana: "う", katakana: "ウ", romaji: "u", type: 'basic',
    examples: [{ word: "うみ", romaji: "umi", meaning: "Biển" }, { word: "うた", romaji: "uta", meaning: "Bài hát" }]
  },
  { 
    hiragana: "え", katakana: "エ", romaji: "e", type: 'basic',
    examples: [{ word: "えき", romaji: "eki", meaning: "Nhà ga" }, { word: "えん", romaji: "en", meaning: "Yên Nhật" }]
  },
  { 
    hiragana: "お", katakana: "オ", romaji: "o", type: 'basic',
    examples: [{ word: "おんがく", romaji: "ongaku", meaning: "Âm nhạc" }, { word: "おちゃ", romaji: "ocha", meaning: "Trà" }]
  },
  { 
    hiragana: "か", katakana: "カ", romaji: "ka", type: 'basic',
    examples: [{ word: "かさ", romaji: "kasa", meaning: "Cái ô" }, { word: "かめ", romaji: "kame", meaning: "Con rùa" }]
  },
  { 
    hiragana: "き", katakana: "キ", romaji: "ki", type: 'basic',
    examples: [{ word: "きく", romaji: "kiku", meaning: "Hoa cúc" }, { word: "きって", romaji: "kitte", meaning: "Con tem" }]
  },
  { 
    hiragana: "く", katakana: "ク", romaji: "ku", type: 'basic',
    examples: [{ word: "くるま", romaji: "kuruma", meaning: "Xe hơi" }, { word: "くつ", romaji: "kutsu", meaning: "Giày" }]
  },
  { 
    hiragana: "け", katakana: "ケ", romaji: "ke", type: 'basic',
    examples: [{ word: "けいだい", romaji: "keidai", meaning: "Điện thoại" }, { word: "けしゴム", romaji: "keshigomu", meaning: "Cục tẩy" }]
  },
  { 
    hiragana: "こ", katakana: "コ", romaji: "ko", type: 'basic',
    examples: [{ word: "こども", romaji: "kodomo", meaning: "Trẻ em" }, { word: "こころ", romaji: "kokoro", meaning: "Trái tim" }]
  },
  { hiragana: "さ", katakana: "サ", romaji: "sa", type: 'basic', examples: [{ word: "さかな", romaji: "sakana", meaning: "Con cá" }] },
  { hiragana: "し", katakana: "シ", romaji: "shi", type: 'basic', examples: [{ word: "しお", romaji: "shio", meaning: "Muối" }] },
  { hiragana: "す", katakana: "ス", romaji: "su", type: 'basic', examples: [{ word: "すし", romaji: "sushi", meaning: "Sushi" }] },
  { hiragana: "せ", katakana: "セ", romaji: "se", type: 'basic', examples: [{ word: "せんせい", romaji: "sensei", meaning: "Giáo viên" }] },
  { hiragana: "そ", katakana: "ソ", romaji: "so", type: 'basic', examples: [{ word: "そら", romaji: "sora", meaning: "Bầu trời" }] },
  { hiragana: "た", katakana: "タ", romaji: "ta", type: 'basic', examples: [{ word: "たまご", romaji: "tamago", meaning: "Quả trứng" }] },
  { hiragana: "ち", katakana: "チ", romaji: "chi", type: 'basic', examples: [{ word: "ちず", romaji: "chizu", meaning: "Bản đồ" }] },
  { hiragana: "つ", katakana: "ツ", romaji: "tsu", type: 'basic', examples: [{ word: "つくえ", romaji: "tsukue", meaning: "Cái bàn" }] },
  { hiragana: "て", katakana: "テ", romaji: "te", type: 'basic', examples: [{ word: "てがみ", romaji: "tegami", meaning: "Bức thư" }] },
  { hiragana: "と", katakana: "ト", romaji: "to", type: 'basic', examples: [{ word: "ともだち", romaji: "tomodachi", meaning: "Bạn bè" }] },
  { hiragana: "な", katakana: "ナ", romaji: "na", type: 'basic', examples: [{ word: "なつ", romaji: "natsu", meaning: "Mùa hè" }] },
  { hiragana: "に", katakana: "ニ", romaji: "ni", type: 'basic', examples: [{ word: "にほん", romaji: "nihon", meaning: "Nhật Bản" }] },
  { hiragana: "ぬ", katakana: "ヌ", romaji: "nu", type: 'basic', examples: [{ word: "ぬの", romaji: "nuno", meaning: "Vải" }] },
  { hiragana: "ね", katakana: "ネ", romaji: "ne", type: 'basic', examples: [{ word: "ねこ", romaji: "neko", meaning: "Con mèo" }] },
  { hiragana: "の", katakana: "ノ", romaji: "no", type: 'basic', examples: [{ word: "のり", romaji: "nori", meaning: "Rong biển" }] },
  { hiragana: "は", katakana: "ハ", romaji: "ha", type: 'basic', examples: [{ word: "はな", romaji: "hana", meaning: "Hoa" }] },
  { hiragana: "ひ", katakana: "ヒ", romaji: "hi", type: 'basic', examples: [{ word: "ひかり", romaji: "hikari", meaning: "Ánh sáng" }] },
  { hiragana: "ふ", katakana: "フ", romaji: "fu", type: 'basic', examples: [{ word: "ふね", romaji: "fune", meaning: "Cái thuyền" }] },
  { hiragana: "へ", katakana: "ヘ", romaji: "he", type: 'basic', examples: [{ word: "へや", romaji: "heya", meaning: "Căn phòng" }] },
  { hiragana: "ほ", katakana: "ホ", romaji: "ho", type: 'basic', examples: [{ word: "ほん", romaji: "hon", meaning: "Sách" }] },
  { hiragana: "ま", katakana: "マ", romaji: "ma", type: 'basic', examples: [{ word: "まつ", romaji: "matsu", meaning: "Cây thông" }] },
  { hiragana: "み", katakana: "ミ", romaji: "mi", type: 'basic', examples: [{ word: "みず", romaji: "mizu", meaning: "Nước" }] },
  { hiragana: "む", katakana: "ム", romaji: "mu", type: 'basic', examples: [{ word: "むし", romaji: "mushi", meaning: "Côn trùng" }] },
  { hiragana: "め", katakana: "メ", romaji: "me", type: 'basic', examples: [{ word: "めがね", romaji: "megane", meaning: "Kính mắt" }] },
  { hiragana: "も", katakana: "モ", romaji: "mo", type: 'basic', examples: [{ word: "もり", romaji: "mori", meaning: "Rừng" }] },
  { hiragana: "や", katakana: "ヤ", romaji: "ya", type: 'basic', examples: [{ word: "やま", romaji: "yama", meaning: "Núi" }] },
  { hiragana: "", katakana: "", romaji: "", type: 'basic' }, 
  { hiragana: "ゆ", katakana: "ユ", romaji: "yu", type: 'basic', examples: [{ word: "ゆき", romaji: "yuki", meaning: "Tuyết" }] },
  { hiragana: "", katakana: "", romaji: "", type: 'basic' },
  { hiragana: "よ", katakana: "ヨ", romaji: "yo", type: 'basic', examples: [{ word: "よる", romaji: "yoru", meaning: "Ban đêm" }] },
  { hiragana: "ら", katakana: "ラ", romaji: "ra", type: 'basic', examples: [{ word: "らいげつ", romaji: "raigetsu", meaning: "Tháng sau" }] },
  { hiragana: "り", katakana: "リ", romaji: "ri", type: 'basic', examples: [{ word: "りんご", romaji: "ringo", meaning: "Quả táo" }] },
  { hiragana: "る", katakana: "ル", romaji: "ru", type: 'basic', examples: [{ word: "るす", romaji: "rusu", meaning: "Vắng nhà" }] },
  { hiragana: "れ", katakana: "レ", romaji: "re", type: 'basic', examples: [{ word: "れいぞうこ", romaji: "reizouko", meaning: "Tủ lạnh" }] },
  { hiragana: "ろ", katakana: "ロ", romaji: "ro", type: 'basic', examples: [{ word: "ろく", romaji: "roku", meaning: "Số sáu" }] },
  { hiragana: "わ", katakana: "ワ", romaji: "wa", type: 'basic', examples: [{ word: "わたし", romaji: "watashi", meaning: "Tôi" }] },
  { hiragana: "", katakana: "", romaji: "", type: 'basic' },
  { hiragana: "を", katakana: "ヲ", romaji: "wo", type: 'basic', examples: [{ word: "ほんをよむ", romaji: "hon o yomu", meaning: "Đọc sách" }] },
  { hiragana: "", katakana: "", romaji: "", type: 'basic' },
  { hiragana: "ん", katakana: "ン", romaji: "n", type: 'basic', examples: [{ word: "みかん", romaji: "mikan", meaning: "Quả quýt" }] },
];

export const DAKUTEN_CHARS: AlphabetChar[] = [
  { hiragana: "が", katakana: "ガ", romaji: "ga", type: 'dakuten', examples: [{ word: "がっこう", romaji: "gakkou", meaning: "Trường học" }] },
  { hiragana: "ぎ", katakana: "ギ", romaji: "gi", type: 'dakuten', examples: [{ word: "ぎんこう", romaji: "ginkou", meaning: "Ngân hàng" }] },
  { hiragana: "ぐ", katakana: "グ", romaji: "gu", type: 'dakuten', examples: [{ word: "ぐんじん", romaji: "gunjin", meaning: "Quân nhân" }] },
  { hiragana: "げ", katakana: "ゲ", romaji: "ge", type: 'dakuten', examples: [{ word: "げんき", romaji: "genki", meaning: "Khỏe mạnh" }] },
  { hiragana: "ご", katakana: "ゴ", romaji: "go", type: 'dakuten', examples: [{ word: "ごはん", romaji: "gohan", meaning: "Cơm" }] },
  { hiragana: "ざ", katakana: "ザ", romaji: "za", type: 'dakuten', examples: [{ word: "ざっし", romaji: "zasshi", meaning: "Tạp chí" }] },
  { hiragana: "じ", katakana: "ジ", romaji: "ji", type: 'dakuten', examples: [{ word: "じかん", romaji: "jikan", meaning: "Thời gian" }] },
  { hiragana: "ず", katakana: "ズ", romaji: "zu", type: 'dakuten', examples: [{ word: "ずぼん", romaji: "zubon", meaning: "Cái quần" }] },
  { hiragana: "ぜ", katakana: "ゼ", romaji: "ze", type: 'dakuten', examples: [{ word: "ぜんぶ", romaji: "zenbu", meaning: "Toàn bộ" }] },
  { hiragana: "ぞ", katakana: "ゾ", romaji: "zo", type: 'dakuten', examples: [{ word: "ぞう", romaji: "zou", meaning: "Con voi" }] },
  { hiragana: "だ", katakana: "ダ", romaji: "da", type: 'dakuten', examples: [{ word: "だいがく", romaji: "daigaku", meaning: "Đại học" }] },
  { hiragana: "ぢ", katakana: "ヂ", romaji: "ji", type: 'dakuten' },
  { hiragana: "づ", katakana: "ヅ", romaji: "zu", type: 'dakuten' },
  { hiragana: "で", katakana: "デ", romaji: "de", type: 'dakuten', examples: [{ word: "でんしゃ", romaji: "densha", meaning: "Tàu điện" }] },
  { hiragana: "ど", katakana: "ド", romaji: "do", type: 'dakuten', examples: [{ word: "どこ", romaji: "doko", meaning: "Ở đâu" }] },
  { hiragana: "ば", katakana: "バ", romaji: "ba", type: 'dakuten', examples: [{ word: "ばんごう", romaji: "bangou", meaning: "Số hiệu" }] },
  { hiragana: "び", katakana: "ビ", romaji: "bi", type: 'dakuten', examples: [{ word: "びょういん", romaji: "byouin", meaning: "Bệnh viện" }] },
  { hiragana: "ぶ", katakana: "ブ", romaji: "bu", type: 'dakuten', examples: [{ word: "ぶた", romaji: "buta", meaning: "Con lợn" }] },
  { hiragana: "べ", katakana: "ベ", romaji: "be", type: 'dakuten', examples: [{ word: "べんきょう", romaji: "benkyou", meaning: "Học tập" }] },
  { hiragana: "ぼ", katakana: "ボ", romaji: "bo", type: 'dakuten', examples: [{ word: "ぼうし", romaji: "boushi", meaning: "Cái mũ" }] },
  { hiragana: "ぱ", katakana: "パ", romaji: "pa", type: 'handakuten', examples: [{ word: "ぱん", romaji: "pan", meaning: "Bánh mì" }] },
  { hiragana: "ぴ", katakana: "ピ", romaji: "pi", type: 'handakuten' },
  { hiragana: "ぷ", katakana: "プ", romaji: "pu", type: 'handakuten' },
  { hiragana: "ぺ", katakana: "ペ", romaji: "pe", type: 'handakuten', examples: [{ word: "ぺん", romaji: "pen", meaning: "Cái bút" }] },
  { hiragana: "ぽ", katakana: "ポ", romaji: "po", type: 'handakuten', examples: [{ word: "ぽけっと", romaji: "poketto", meaning: "Túi áo" }] },
];

export const YOUON_CHARS: AlphabetChar[] = [
  { hiragana: "きゃ", katakana: "キャ", romaji: "kya", type: 'youon', examples: [{ word: "きゃく", romaji: "kyaku", meaning: "Khách hàng" }] },
  { hiragana: "きゅ", katakana: "キュ", romaji: "kyu", type: 'youon', examples: [{ word: "きゅうり", romaji: "kyuuri", meaning: "Dưa chuột" }] },
  { hiragana: "きょ", katakana: "キョ", romaji: "kyo", type: 'youon', examples: [{ word: "きょう", romaji: "kyou", meaning: "Hôm nay" }] },
  { hiragana: "しゃ", katakana: "シャ", romaji: "sha", type: 'youon', examples: [{ word: "しゃしん", romaji: "shashin", meaning: "Ảnh" }] },
  { hiragana: "しゅ", katakana: "シュ", romaji: "shu", type: 'youon', examples: [{ word: "しゅくだい", romaji: "shukudai", meaning: "Bài tập về nhà" }] },
  { hiragana: "しょ", katakana: "ショ", romaji: "sho", type: 'youon', examples: [{ word: "しょくどう", romaji: "shokudou", meaning: "Nhà ăn" }] },
];
