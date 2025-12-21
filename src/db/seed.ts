import { db, FoodMaster, ExerciseMaster, UserGoal, UserSettings } from './database';

// 食材マスタ（プリセット）- USDAデータベース + 日本食品標準成分表より
export const defaultFoods: Omit<FoodMaster, 'id' | 'createdAt'>[] = [
  // ===== 肉類 =====
  // 鶏肉
  { name: '鶏むね肉（皮なし・茹で）', caloriesPer100g: 166, proteinPer100g: 32.1, fatPer100g: 3.2, carbsPer100g: 0, isCustom: false },
  { name: '鶏むね肉（皮なし・生）', caloriesPer100g: 108, proteinPer100g: 22.3, fatPer100g: 1.5, carbsPer100g: 0, isCustom: false },
  { name: '鶏もも肉（皮なし）', caloriesPer100g: 116, proteinPer100g: 18.8, fatPer100g: 3.9, carbsPer100g: 0, isCustom: false },
  { name: '鶏もも肉（皮付き）', caloriesPer100g: 200, proteinPer100g: 16.2, fatPer100g: 14.0, carbsPer100g: 0, isCustom: false },
  { name: '鶏ささみ', caloriesPer100g: 105, proteinPer100g: 23.0, fatPer100g: 0.8, carbsPer100g: 0, isCustom: false },
  { name: '鶏手羽先', caloriesPer100g: 211, proteinPer100g: 17.5, fatPer100g: 14.6, carbsPer100g: 0, isCustom: false },
  { name: '鶏レバー', caloriesPer100g: 111, proteinPer100g: 18.9, fatPer100g: 3.1, carbsPer100g: 0.6, isCustom: false },
  // 牛肉
  { name: '牛ヒレ肉（赤身・生）', caloriesPer100g: 176, proteinPer100g: 27.7, fatPer100g: 6.4, carbsPer100g: 0, isCustom: false },
  { name: '牛もも肉（赤身・生）', caloriesPer100g: 122, proteinPer100g: 23.4, fatPer100g: 2.5, carbsPer100g: 0, isCustom: false },
  { name: '牛サーロイン（赤身）', caloriesPer100g: 155, proteinPer100g: 22.8, fatPer100g: 6.4, carbsPer100g: 0, isCustom: false },
  { name: '牛Tボーンステーキ（焼き）', caloriesPer100g: 219, proteinPer100g: 27.3, fatPer100g: 11.4, carbsPer100g: 0, isCustom: false },
  { name: '牛ひき肉（赤身80%）', caloriesPer100g: 254, proteinPer100g: 17.2, fatPer100g: 20.0, carbsPer100g: 0, isCustom: false },
  // 豚肉
  { name: '豚ロース（赤身）', caloriesPer100g: 150, proteinPer100g: 22.7, fatPer100g: 5.6, carbsPer100g: 0.2, isCustom: false },
  { name: '豚ヒレ肉', caloriesPer100g: 115, proteinPer100g: 22.8, fatPer100g: 1.9, carbsPer100g: 0.2, isCustom: false },
  { name: '豚もも肉', caloriesPer100g: 183, proteinPer100g: 20.5, fatPer100g: 10.2, carbsPer100g: 0.2, isCustom: false },
  { name: '豚バラ肉', caloriesPer100g: 386, proteinPer100g: 14.2, fatPer100g: 34.6, carbsPer100g: 0.1, isCustom: false },
  { name: 'ベーコン', caloriesPer100g: 405, proteinPer100g: 12.9, fatPer100g: 39.1, carbsPer100g: 0.3, isCustom: false },
  { name: 'ハム（ロース）', caloriesPer100g: 106, proteinPer100g: 16.7, fatPer100g: 3.7, carbsPer100g: 0.3, isCustom: false },
  { name: 'ソーセージ（ウインナー）', caloriesPer100g: 321, proteinPer100g: 11.5, fatPer100g: 28.5, carbsPer100g: 3.0, isCustom: false },
  // 羊肉
  { name: 'ラム肉（もも）', caloriesPer100g: 198, proteinPer100g: 20.0, fatPer100g: 12.0, carbsPer100g: 0.1, isCustom: false },

  // ===== 魚介類 =====
  { name: 'サーモン（生）', caloriesPer100g: 208, proteinPer100g: 20.1, fatPer100g: 13.4, carbsPer100g: 0, isCustom: false },
  { name: 'サーモン（焼き）', caloriesPer100g: 233, proteinPer100g: 22.3, fatPer100g: 14.8, carbsPer100g: 0, isCustom: false },
  { name: 'マグロ赤身（生）', caloriesPer100g: 125, proteinPer100g: 26.4, fatPer100g: 1.4, carbsPer100g: 0.1, isCustom: false },
  { name: 'ツナ缶（水煮）', caloriesPer100g: 90, proteinPer100g: 19.0, fatPer100g: 0.9, carbsPer100g: 0.1, isCustom: false },
  { name: 'ツナ缶（油漬け）', caloriesPer100g: 267, proteinPer100g: 17.7, fatPer100g: 21.7, carbsPer100g: 0.1, isCustom: false },
  { name: 'タラ（生）', caloriesPer100g: 74, proteinPer100g: 16.3, fatPer100g: 0.5, carbsPer100g: 0, isCustom: false },
  { name: 'スケトウダラ（生）', caloriesPer100g: 56, proteinPer100g: 12.3, fatPer100g: 0.4, carbsPer100g: 0, isCustom: false },
  { name: 'サバ（生）', caloriesPer100g: 202, proteinPer100g: 20.7, fatPer100g: 12.1, carbsPer100g: 0.3, isCustom: false },
  { name: 'サバ缶（水煮）', caloriesPer100g: 190, proteinPer100g: 20.9, fatPer100g: 10.7, carbsPer100g: 0.2, isCustom: false },
  { name: 'ブリ（生）', caloriesPer100g: 257, proteinPer100g: 21.4, fatPer100g: 17.6, carbsPer100g: 0.3, isCustom: false },
  { name: 'イワシ（生）', caloriesPer100g: 217, proteinPer100g: 19.8, fatPer100g: 13.9, carbsPer100g: 0.7, isCustom: false },
  { name: 'アジ（生）', caloriesPer100g: 121, proteinPer100g: 20.7, fatPer100g: 3.5, carbsPer100g: 0.1, isCustom: false },
  { name: 'エビ（むき身・生）', caloriesPer100g: 91, proteinPer100g: 18.4, fatPer100g: 0.6, carbsPer100g: 0.7, isCustom: false },
  { name: 'イカ（生）', caloriesPer100g: 88, proteinPer100g: 18.1, fatPer100g: 1.2, carbsPer100g: 0.2, isCustom: false },
  { name: 'タコ（茹で）', caloriesPer100g: 99, proteinPer100g: 21.7, fatPer100g: 0.7, carbsPer100g: 0.1, isCustom: false },
  { name: 'ホタテ貝柱（生）', caloriesPer100g: 72, proteinPer100g: 13.5, fatPer100g: 0.9, carbsPer100g: 1.5, isCustom: false },
  { name: 'カキ（生）', caloriesPer100g: 60, proteinPer100g: 6.6, fatPer100g: 1.4, carbsPer100g: 4.7, isCustom: false },

  // ===== 卵・乳製品 =====
  { name: '卵（全卵・生）', caloriesPer100g: 150, proteinPer100g: 12.3, fatPer100g: 10.3, carbsPer100g: 0.9, isCustom: false },
  { name: '卵（全卵・茹で）', caloriesPer100g: 151, proteinPer100g: 12.5, fatPer100g: 10.0, carbsPer100g: 0.6, isCustom: false },
  { name: '卵白（生）', caloriesPer100g: 48, proteinPer100g: 10.1, fatPer100g: 0.2, carbsPer100g: 0.7, isCustom: false },
  { name: '卵黄（生）', caloriesPer100g: 296, proteinPer100g: 15.6, fatPer100g: 25.1, carbsPer100g: 0.6, isCustom: false },
  { name: '牛乳（普通）', caloriesPer100g: 67, proteinPer100g: 3.3, fatPer100g: 3.8, carbsPer100g: 4.8, isCustom: false },
  { name: '牛乳（低脂肪）', caloriesPer100g: 46, proteinPer100g: 3.8, fatPer100g: 1.0, carbsPer100g: 5.5, isCustom: false },
  { name: '牛乳（無脂肪）', caloriesPer100g: 33, proteinPer100g: 3.4, fatPer100g: 0.1, carbsPer100g: 4.7, isCustom: false },
  { name: 'ギリシャヨーグルト（無脂肪）', caloriesPer100g: 61, proteinPer100g: 10.3, fatPer100g: 0.4, carbsPer100g: 3.6, isCustom: false },
  { name: 'ヨーグルト（プレーン）', caloriesPer100g: 62, proteinPer100g: 3.6, fatPer100g: 3.0, carbsPer100g: 4.9, isCustom: false },
  { name: 'ヨーグルト（無脂肪）', caloriesPer100g: 42, proteinPer100g: 4.0, fatPer100g: 0.2, carbsPer100g: 5.7, isCustom: false },
  { name: 'チーズ（チェダー）', caloriesPer100g: 408, proteinPer100g: 23.3, fatPer100g: 34.0, carbsPer100g: 2.4, isCustom: false },
  { name: 'チーズ（モッツァレラ）', caloriesPer100g: 298, proteinPer100g: 23.7, fatPer100g: 20.4, carbsPer100g: 4.4, isCustom: false },
  { name: 'チーズ（パルメザン）', caloriesPer100g: 421, proteinPer100g: 29.6, fatPer100g: 28.0, carbsPer100g: 12.4, isCustom: false },
  { name: 'チーズ（プロセス）', caloriesPer100g: 366, proteinPer100g: 18.0, fatPer100g: 30.6, carbsPer100g: 5.3, isCustom: false },
  { name: 'カッテージチーズ（低脂肪）', caloriesPer100g: 84, proteinPer100g: 11.0, fatPer100g: 2.3, carbsPer100g: 4.3, isCustom: false },
  { name: 'クリームチーズ', caloriesPer100g: 342, proteinPer100g: 8.2, fatPer100g: 33.0, carbsPer100g: 4.1, isCustom: false },

  // ===== 豆類・大豆製品 =====
  { name: '木綿豆腐', caloriesPer100g: 72, proteinPer100g: 6.6, fatPer100g: 4.2, carbsPer100g: 1.6, isCustom: false },
  { name: '絹ごし豆腐', caloriesPer100g: 56, proteinPer100g: 4.9, fatPer100g: 3.0, carbsPer100g: 2.0, isCustom: false },
  { name: '納豆', caloriesPer100g: 200, proteinPer100g: 16.5, fatPer100g: 10.0, carbsPer100g: 12.1, isCustom: false },
  { name: '豆乳（無調整）', caloriesPer100g: 46, proteinPer100g: 3.6, fatPer100g: 2.0, carbsPer100g: 3.1, isCustom: false },
  { name: '枝豆（茹で）', caloriesPer100g: 135, proteinPer100g: 11.7, fatPer100g: 6.2, carbsPer100g: 8.8, isCustom: false },
  { name: '大豆（水煮）', caloriesPer100g: 180, proteinPer100g: 16.0, fatPer100g: 9.0, carbsPer100g: 9.7, isCustom: false },
  { name: 'ひよこ豆（水煮）', caloriesPer100g: 171, proteinPer100g: 9.0, fatPer100g: 2.6, carbsPer100g: 27.4, isCustom: false },
  { name: 'レンズ豆（茹で）', caloriesPer100g: 116, proteinPer100g: 9.0, fatPer100g: 0.4, carbsPer100g: 20.1, isCustom: false },
  { name: '油揚げ', caloriesPer100g: 386, proteinPer100g: 18.6, fatPer100g: 33.1, carbsPer100g: 0.4, isCustom: false },
  { name: 'フムス', caloriesPer100g: 229, proteinPer100g: 7.4, fatPer100g: 17.1, carbsPer100g: 14.9, isCustom: false },

  // ===== 穀類・炭水化物 =====
  { name: '白米（炊飯後）', caloriesPer100g: 168, proteinPer100g: 2.5, fatPer100g: 0.3, carbsPer100g: 37.1, isCustom: false },
  { name: '玄米（炊飯後）', caloriesPer100g: 165, proteinPer100g: 2.8, fatPer100g: 1.0, carbsPer100g: 35.6, isCustom: false },
  { name: 'もち麦（炊飯後）', caloriesPer100g: 152, proteinPer100g: 3.5, fatPer100g: 0.7, carbsPer100g: 32.0, isCustom: false },
  { name: 'オートミール（乾燥）', caloriesPer100g: 380, proteinPer100g: 13.7, fatPer100g: 5.7, carbsPer100g: 69.1, isCustom: false },
  { name: '食パン（白）', caloriesPer100g: 270, proteinPer100g: 9.4, fatPer100g: 3.6, carbsPer100g: 49.2, isCustom: false },
  { name: '全粒粉パン', caloriesPer100g: 254, proteinPer100g: 12.3, fatPer100g: 3.6, carbsPer100g: 43.1, isCustom: false },
  { name: 'ベーグル', caloriesPer100g: 275, proteinPer100g: 10.5, fatPer100g: 1.4, carbsPer100g: 53.0, isCustom: false },
  { name: 'パスタ（乾麺）', caloriesPer100g: 378, proteinPer100g: 13.0, fatPer100g: 1.5, carbsPer100g: 75.0, isCustom: false },
  { name: 'パスタ（茹で）', caloriesPer100g: 165, proteinPer100g: 5.8, fatPer100g: 0.9, carbsPer100g: 31.0, isCustom: false },
  { name: 'うどん（茹で）', caloriesPer100g: 105, proteinPer100g: 2.6, fatPer100g: 0.4, carbsPer100g: 21.6, isCustom: false },
  { name: 'そば（茹で）', caloriesPer100g: 132, proteinPer100g: 4.8, fatPer100g: 1.0, carbsPer100g: 26.0, isCustom: false },
  { name: '中華麺（茹で）', caloriesPer100g: 149, proteinPer100g: 4.9, fatPer100g: 0.6, carbsPer100g: 29.2, isCustom: false },
  { name: 'さつまいも（蒸し）', caloriesPer100g: 131, proteinPer100g: 1.2, fatPer100g: 0.2, carbsPer100g: 31.0, isCustom: false },
  { name: 'じゃがいも（茹で）', caloriesPer100g: 84, proteinPer100g: 1.5, fatPer100g: 0.1, carbsPer100g: 18.0, isCustom: false },
  { name: 'コーンフレーク', caloriesPer100g: 381, proteinPer100g: 7.8, fatPer100g: 1.7, carbsPer100g: 83.0, isCustom: false },
  { name: 'グラノーラ', caloriesPer100g: 471, proteinPer100g: 10.5, fatPer100g: 20.0, carbsPer100g: 64.0, isCustom: false },
  { name: '餅（切り餅1個50g）', caloriesPer100g: 235, proteinPer100g: 4.2, fatPer100g: 0.8, carbsPer100g: 50.3, isCustom: false },

  // ===== 野菜 =====
  { name: 'ブロッコリー（茹で）', caloriesPer100g: 30, proteinPer100g: 3.5, fatPer100g: 0.4, carbsPer100g: 4.3, isCustom: false },
  { name: 'ほうれん草（茹で）', caloriesPer100g: 25, proteinPer100g: 2.6, fatPer100g: 0.5, carbsPer100g: 3.0, isCustom: false },
  { name: 'ケール（生）', caloriesPer100g: 35, proteinPer100g: 2.9, fatPer100g: 1.5, carbsPer100g: 4.4, isCustom: false },
  { name: 'アスパラガス（茹で）', caloriesPer100g: 24, proteinPer100g: 2.6, fatPer100g: 0.2, carbsPer100g: 3.9, isCustom: false },
  { name: 'トマト（生）', caloriesPer100g: 19, proteinPer100g: 0.7, fatPer100g: 0.1, carbsPer100g: 4.7, isCustom: false },
  { name: 'ミニトマト（生）', caloriesPer100g: 27, proteinPer100g: 0.8, fatPer100g: 0.6, carbsPer100g: 5.5, isCustom: false },
  { name: 'トマト缶（カット）', caloriesPer100g: 18, proteinPer100g: 0.8, fatPer100g: 0.5, carbsPer100g: 3.3, isCustom: false },
  { name: 'きゅうり', caloriesPer100g: 14, proteinPer100g: 1.0, fatPer100g: 0.1, carbsPer100g: 3.0, isCustom: false },
  { name: 'レタス', caloriesPer100g: 12, proteinPer100g: 0.6, fatPer100g: 0.1, carbsPer100g: 2.8, isCustom: false },
  { name: 'キャベツ', caloriesPer100g: 23, proteinPer100g: 1.3, fatPer100g: 0.2, carbsPer100g: 5.2, isCustom: false },
  { name: '白菜', caloriesPer100g: 14, proteinPer100g: 0.8, fatPer100g: 0.1, carbsPer100g: 3.2, isCustom: false },
  { name: '玉ねぎ', caloriesPer100g: 37, proteinPer100g: 1.0, fatPer100g: 0.1, carbsPer100g: 8.8, isCustom: false },
  { name: 'にんじん', caloriesPer100g: 37, proteinPer100g: 0.6, fatPer100g: 0.1, carbsPer100g: 9.1, isCustom: false },
  { name: 'ピーマン', caloriesPer100g: 22, proteinPer100g: 0.9, fatPer100g: 0.2, carbsPer100g: 5.1, isCustom: false },
  { name: 'もやし', caloriesPer100g: 14, proteinPer100g: 1.7, fatPer100g: 0.1, carbsPer100g: 2.6, isCustom: false },
  { name: 'なす', caloriesPer100g: 22, proteinPer100g: 1.1, fatPer100g: 0.1, carbsPer100g: 5.1, isCustom: false },
  { name: 'かぼちゃ', caloriesPer100g: 91, proteinPer100g: 1.9, fatPer100g: 0.3, carbsPer100g: 20.6, isCustom: false },
  { name: 'さやいんげん（缶詰）', caloriesPer100g: 21, proteinPer100g: 1.0, fatPer100g: 0.4, carbsPer100g: 4.1, isCustom: false },
  { name: 'マッシュルーム', caloriesPer100g: 11, proteinPer100g: 2.9, fatPer100g: 0.3, carbsPer100g: 1.0, isCustom: false },
  { name: 'しめじ', caloriesPer100g: 18, proteinPer100g: 2.7, fatPer100g: 0.5, carbsPer100g: 4.8, isCustom: false },

  // ===== 果物 =====
  { name: 'バナナ', caloriesPer100g: 89, proteinPer100g: 1.1, fatPer100g: 0.2, carbsPer100g: 22.5, isCustom: false },
  { name: 'りんご', caloriesPer100g: 54, proteinPer100g: 0.2, fatPer100g: 0.1, carbsPer100g: 14.6, isCustom: false },
  { name: 'みかん', caloriesPer100g: 46, proteinPer100g: 0.7, fatPer100g: 0.1, carbsPer100g: 12.0, isCustom: false },
  { name: 'オレンジ', caloriesPer100g: 46, proteinPer100g: 1.0, fatPer100g: 0.1, carbsPer100g: 11.8, isCustom: false },
  { name: 'グレープフルーツ', caloriesPer100g: 38, proteinPer100g: 0.9, fatPer100g: 0.1, carbsPer100g: 9.6, isCustom: false },
  { name: 'キウイ（緑）', caloriesPer100g: 58, proteinPer100g: 1.1, fatPer100g: 0.4, carbsPer100g: 14.0, isCustom: false },
  { name: 'いちご', caloriesPer100g: 34, proteinPer100g: 0.9, fatPer100g: 0.1, carbsPer100g: 8.5, isCustom: false },
  { name: 'ぶどう', caloriesPer100g: 59, proteinPer100g: 0.4, fatPer100g: 0.1, carbsPer100g: 15.7, isCustom: false },
  { name: 'もも（生）', caloriesPer100g: 42, proteinPer100g: 0.9, fatPer100g: 0.3, carbsPer100g: 10.1, isCustom: false },
  { name: 'ネクタリン', caloriesPer100g: 39, proteinPer100g: 1.1, fatPer100g: 0.3, carbsPer100g: 9.2, isCustom: false },
  { name: 'ブルーベリー', caloriesPer100g: 49, proteinPer100g: 0.5, fatPer100g: 0.1, carbsPer100g: 12.5, isCustom: false },
  { name: 'アボカド', caloriesPer100g: 176, proteinPer100g: 2.5, fatPer100g: 17.5, carbsPer100g: 6.2, isCustom: false },
  { name: 'マンゴー', caloriesPer100g: 64, proteinPer100g: 0.6, fatPer100g: 0.2, carbsPer100g: 16.9, isCustom: false },
  { name: 'パイナップル', caloriesPer100g: 51, proteinPer100g: 0.5, fatPer100g: 0.1, carbsPer100g: 13.7, isCustom: false },
  { name: 'レーズン', caloriesPer100g: 301, proteinPer100g: 2.7, fatPer100g: 0.4, carbsPer100g: 79.3, isCustom: false },
  { name: 'デーツ（ドライ）', caloriesPer100g: 282, proteinPer100g: 2.5, fatPer100g: 0.4, carbsPer100g: 75.0, isCustom: false },

  // ===== ナッツ・種子類 =====
  { name: 'アーモンド（素焼き）', caloriesPer100g: 620, proteinPer100g: 20.4, fatPer100g: 57.8, carbsPer100g: 16.2, isCustom: false },
  { name: 'くるみ', caloriesPer100g: 654, proteinPer100g: 14.7, fatPer100g: 65.2, carbsPer100g: 11.7, isCustom: false },
  { name: 'カシューナッツ', caloriesPer100g: 576, proteinPer100g: 18.2, fatPer100g: 43.9, carbsPer100g: 26.9, isCustom: false },
  { name: 'ピーナッツ', caloriesPer100g: 585, proteinPer100g: 26.5, fatPer100g: 47.5, carbsPer100g: 18.8, isCustom: false },
  { name: 'ピーナッツバター', caloriesPer100g: 589, proteinPer100g: 25.0, fatPer100g: 50.4, carbsPer100g: 19.6, isCustom: false },
  { name: 'マカダミアナッツ', caloriesPer100g: 718, proteinPer100g: 7.9, fatPer100g: 75.8, carbsPer100g: 13.8, isCustom: false },
  { name: 'ひまわりの種（素焼き）', caloriesPer100g: 612, proteinPer100g: 21.0, fatPer100g: 56.1, carbsPer100g: 17.1, isCustom: false },
  { name: 'かぼちゃの種', caloriesPer100g: 559, proteinPer100g: 30.2, fatPer100g: 49.1, carbsPer100g: 10.7, isCustom: false },
  { name: 'チアシード', caloriesPer100g: 486, proteinPer100g: 16.5, fatPer100g: 30.7, carbsPer100g: 42.1, isCustom: false },
  { name: 'ごま（いり）', caloriesPer100g: 599, proteinPer100g: 20.3, fatPer100g: 54.2, carbsPer100g: 18.4, isCustom: false },

  // ===== 油脂類 =====
  { name: 'オリーブオイル', caloriesPer100g: 884, proteinPer100g: 0, fatPer100g: 100, carbsPer100g: 0, isCustom: false },
  { name: 'ココナッツオイル', caloriesPer100g: 833, proteinPer100g: 0, fatPer100g: 99.1, carbsPer100g: 0.8, isCustom: false },
  { name: 'バター（有塩）', caloriesPer100g: 745, proteinPer100g: 0.6, fatPer100g: 81.0, carbsPer100g: 0.2, isCustom: false },
  { name: 'マーガリン', caloriesPer100g: 769, proteinPer100g: 0.4, fatPer100g: 83.0, carbsPer100g: 0.5, isCustom: false },
  { name: 'マヨネーズ', caloriesPer100g: 703, proteinPer100g: 1.5, fatPer100g: 75.3, carbsPer100g: 3.6, isCustom: false },
  { name: 'ごま油', caloriesPer100g: 884, proteinPer100g: 0, fatPer100g: 100, carbsPer100g: 0, isCustom: false },

  // ===== 調味料・ソース =====
  { name: '醤油', caloriesPer100g: 60, proteinPer100g: 7.7, fatPer100g: 0, carbsPer100g: 8.1, isCustom: false },
  { name: '味噌（合わせ）', caloriesPer100g: 198, proteinPer100g: 12.5, fatPer100g: 6.0, carbsPer100g: 21.9, isCustom: false },
  { name: 'マスタード', caloriesPer100g: 61, proteinPer100g: 4.3, fatPer100g: 3.4, carbsPer100g: 5.3, isCustom: false },
  { name: 'ケチャップ', caloriesPer100g: 119, proteinPer100g: 1.8, fatPer100g: 0.5, carbsPer100g: 27.4, isCustom: false },
  { name: 'パスタソース（トマト）', caloriesPer100g: 45, proteinPer100g: 1.4, fatPer100g: 1.5, carbsPer100g: 8.1, isCustom: false },
  { name: 'はちみつ', caloriesPer100g: 329, proteinPer100g: 0.2, fatPer100g: 0, carbsPer100g: 81.9, isCustom: false },
  { name: 'メープルシロップ', caloriesPer100g: 260, proteinPer100g: 0, fatPer100g: 0.1, carbsPer100g: 67.0, isCustom: false },
  { name: '砂糖（上白糖）', caloriesPer100g: 384, proteinPer100g: 0, fatPer100g: 0, carbsPer100g: 99.2, isCustom: false },

  // ===== サプリメント・プロテイン =====
  { name: 'プロテインパウダー（ホエイ）', caloriesPer100g: 400, proteinPer100g: 80.0, fatPer100g: 6.0, carbsPer100g: 8.0, isCustom: false },
  { name: 'プロテインパウダー（カゼイン）', caloriesPer100g: 380, proteinPer100g: 82.0, fatPer100g: 2.0, carbsPer100g: 4.0, isCustom: false },
  { name: 'プロテインパウダー（ソイ）', caloriesPer100g: 370, proteinPer100g: 85.0, fatPer100g: 3.5, carbsPer100g: 2.0, isCustom: false },
  { name: 'プロテインバー（平均）', caloriesPer100g: 350, proteinPer100g: 30.0, fatPer100g: 12.0, carbsPer100g: 35.0, isCustom: false },
  { name: 'BCAA', caloriesPer100g: 0, proteinPer100g: 100, fatPer100g: 0, carbsPer100g: 0, isCustom: false },
  { name: 'クレアチン', caloriesPer100g: 0, proteinPer100g: 0, fatPer100g: 0, carbsPer100g: 0, isCustom: false },

  // ===== 飲料 =====
  { name: 'オレンジジュース（100%）', caloriesPer100g: 42, proteinPer100g: 0.7, fatPer100g: 0.2, carbsPer100g: 10.5, isCustom: false },
  { name: 'グレープフルーツジュース', caloriesPer100g: 37, proteinPer100g: 0.6, fatPer100g: 0.7, carbsPer100g: 7.6, isCustom: false },
  { name: 'スポーツドリンク', caloriesPer100g: 26, proteinPer100g: 0, fatPer100g: 0, carbsPer100g: 6.3, isCustom: false },
  { name: 'コーラ', caloriesPer100g: 43, proteinPer100g: 0, fatPer100g: 0, carbsPer100g: 10.6, isCustom: false },
  { name: 'ビール', caloriesPer100g: 40, proteinPer100g: 0.3, fatPer100g: 0, carbsPer100g: 3.1, isCustom: false },

  // ===== その他 =====
  { name: 'オリーブ（グリーン）', caloriesPer100g: 130, proteinPer100g: 1.2, fatPer100g: 12.9, carbsPer100g: 5.0, isCustom: false },
  { name: 'ピクルス', caloriesPer100g: 12, proteinPer100g: 0.5, fatPer100g: 0.4, carbsPer100g: 2.0, isCustom: false },
  { name: 'オートミールクッキー', caloriesPer100g: 430, proteinPer100g: 5.8, fatPer100g: 14.3, carbsPer100g: 69.6, isCustom: false },
  { name: 'ダークチョコレート（70%）', caloriesPer100g: 598, proteinPer100g: 7.8, fatPer100g: 42.6, carbsPer100g: 45.9, isCustom: false },
  { name: 'チャーハン（具なし）', caloriesPer100g: 174, proteinPer100g: 3.8, fatPer100g: 3.2, carbsPer100g: 32.5, isCustom: false },
];

// トレーニング種目マスタ（プリセット）
export const defaultExercises: Omit<ExerciseMaster, 'id' | 'createdAt'>[] = [
  // 胸
  { name: 'ベンチプレス', bodyPart: 'chest', isCompound: true, isCustom: false },
  { name: 'インクラインベンチプレス', bodyPart: 'chest', isCompound: true, isCustom: false },
  { name: 'ダンベルフライ', bodyPart: 'chest', isCompound: false, isCustom: false },
  { name: 'ケーブルクロスオーバー', bodyPart: 'chest', isCompound: false, isCustom: false },
  { name: 'ディップス', bodyPart: 'chest', isCompound: true, isCustom: false },
  // 背中
  { name: 'デッドリフト', bodyPart: 'back', isCompound: true, isCustom: false },
  { name: '懸垂', bodyPart: 'back', isCompound: true, isCustom: false },
  { name: 'ラットプルダウン', bodyPart: 'back', isCompound: true, isCustom: false },
  { name: 'バーベルロウ', bodyPart: 'back', isCompound: true, isCustom: false },
  { name: 'シーテッドロウ', bodyPart: 'back', isCompound: true, isCustom: false },
  // 肩
  { name: 'オーバーヘッドプレス', bodyPart: 'shoulder', isCompound: true, isCustom: false },
  { name: 'サイドレイズ', bodyPart: 'shoulder', isCompound: false, isCustom: false },
  { name: 'フロントレイズ', bodyPart: 'shoulder', isCompound: false, isCustom: false },
  { name: 'リアレイズ', bodyPart: 'shoulder', isCompound: false, isCustom: false },
  { name: 'フェイスプル', bodyPart: 'shoulder', isCompound: false, isCustom: false },
  // 腕
  { name: 'バーベルカール', bodyPart: 'arm', isCompound: false, isCustom: false },
  { name: 'ハンマーカール', bodyPart: 'arm', isCompound: false, isCustom: false },
  { name: 'トライセプスプッシュダウン', bodyPart: 'arm', isCompound: false, isCustom: false },
  { name: 'スカルクラッシャー', bodyPart: 'arm', isCompound: false, isCustom: false },
  // 脚
  { name: 'スクワット', bodyPart: 'leg', isCompound: true, isCustom: false },
  { name: 'レッグプレス', bodyPart: 'leg', isCompound: true, isCustom: false },
  { name: 'ルーマニアンデッドリフト', bodyPart: 'leg', isCompound: true, isCustom: false },
  { name: 'レッグカール', bodyPart: 'leg', isCompound: false, isCustom: false },
  { name: 'レッグエクステンション', bodyPart: 'leg', isCompound: false, isCustom: false },
  { name: 'カーフレイズ', bodyPart: 'leg', isCompound: false, isCustom: false },
  // 体幹
  { name: 'プランク', bodyPart: 'core', isCompound: false, isCustom: false },
  { name: 'クランチ', bodyPart: 'core', isCompound: false, isCustom: false },
  { name: 'レッグレイズ', bodyPart: 'core', isCompound: false, isCustom: false },
];

// デフォルトの目標設定
export const defaultGoal: Omit<UserGoal, 'id' | 'createdAt' | 'updatedAt'> = {
  goalType: 'maintain',
  targetWeight: 70,
  targetCalories: 2000,
  targetProtein: 120,
  targetFat: 55,
  targetCarbs: 250,
  startDate: new Date().toISOString().split('T')[0],
};

// デフォルトのユーザー設定
export const defaultSettings: Omit<UserSettings, 'id' | 'createdAt' | 'updatedAt'> = {
  oneRmFormula: 'epley',
};

// 食品データのバージョン（新しい食品を追加したらインクリメント）
const FOOD_DATA_VERSION = 5;

// データベース初期化
export async function seedDatabase(): Promise<void> {
  const now = new Date();

  // 食材マスタの初期化またはアップデート
  const foodCount = await db.foodMaster.count();
  const storedVersion = parseInt(localStorage.getItem('foodDataVersion') || '0', 10);

  console.log(`食材マスタ: 現在 ${foodCount} 件, バージョン ${storedVersion} -> ${FOOD_DATA_VERSION}`);

  if (foodCount === 0 || storedVersion < FOOD_DATA_VERSION) {
    // カスタム食品を保持
    const allFoods = await db.foodMaster.toArray();
    const customFoods = allFoods.filter(food => food.isCustom === true);
    console.log(`カスタム食品: ${customFoods.length} 件を保持`);

    // 全食品を削除
    await db.foodMaster.clear();
    console.log('食材マスタをクリアしました');

    // カスタム食品を復元
    if (customFoods.length > 0) {
      await db.foodMaster.bulkAdd(customFoods);
      console.log(`カスタム食品を ${customFoods.length} 件復元しました`);
    }

    // 新しいプリセット食品を追加
    const foodsWithDate = defaultFoods.map(food => ({
      ...food,
      createdAt: now,
    }));
    await db.foodMaster.bulkAdd(foodsWithDate);
    localStorage.setItem('foodDataVersion', FOOD_DATA_VERSION.toString());
    console.log(`食材マスタを初期化しました: ${defaultFoods.length} 件（バージョン ${FOOD_DATA_VERSION}）`);
  } else {
    console.log('食材マスタは最新です');
  }

  // 種目マスタが空の場合のみ初期データを投入
  const exerciseCount = await db.exerciseMaster.count();
  if (exerciseCount === 0) {
    const exercisesWithDate = defaultExercises.map(exercise => ({
      ...exercise,
      createdAt: now,
    }));
    await db.exerciseMaster.bulkAdd(exercisesWithDate);
    console.log('種目マスタを初期化しました');
  }

  // 目標設定が空の場合のみ初期データを投入
  const goalCount = await db.userGoals.count();
  if (goalCount === 0) {
    await db.userGoals.add({
      ...defaultGoal,
      createdAt: now,
      updatedAt: now,
    });
    console.log('目標設定を初期化しました');
  }

  // ユーザー設定が空の場合のみ初期データを投入
  const settingsCount = await db.userSettings.count();
  if (settingsCount === 0) {
    await db.userSettings.add({
      ...defaultSettings,
      createdAt: now,
      updatedAt: now,
    });
    console.log('ユーザー設定を初期化しました');
  }
}
