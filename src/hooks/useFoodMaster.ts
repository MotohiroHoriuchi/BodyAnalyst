import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo, useCallback } from 'react';
import { db, FoodMaster } from '../db/database';

// 食品カテゴリの定義
export type FoodCategory =
  | 'meat'
  | 'seafood'
  | 'egg_dairy'
  | 'legumes'
  | 'grains'
  | 'vegetables'
  | 'fruits'
  | 'nuts'
  | 'oils'
  | 'seasonings'
  | 'supplements'
  | 'beverages'
  | 'other';

export const foodCategoryLabels: Record<FoodCategory, string> = {
  meat: '肉類',
  seafood: '魚介類',
  egg_dairy: '卵・乳製品',
  legumes: '豆類・大豆製品',
  grains: '穀類・炭水化物',
  vegetables: '野菜',
  fruits: '果物',
  nuts: 'ナッツ・種子類',
  oils: '油脂類',
  seasonings: '調味料・ソース',
  supplements: 'サプリメント',
  beverages: '飲料',
  other: 'その他',
};

// 食品名からカテゴリを推定
function inferCategory(name: string): FoodCategory {
  // 肉類
  if (/鶏|牛|豚|ラム|ベーコン|ハム|ソーセージ|レバー/.test(name)) return 'meat';
  // 魚介類
  if (/サーモン|マグロ|ツナ|タラ|サバ|ブリ|イワシ|アジ|エビ|イカ|タコ|ホタテ|カキ|魚/.test(name)) return 'seafood';
  // 卵・乳製品
  if (/卵|牛乳|ヨーグルト|チーズ|カッテージ|クリーム/.test(name)) return 'egg_dairy';
  // 豆類
  if (/豆腐|納豆|豆乳|枝豆|大豆|ひよこ豆|レンズ豆|油揚げ|フムス/.test(name)) return 'legumes';
  // 穀類
  if (/米|玄米|麦|オートミール|パン|パスタ|うどん|そば|麺|さつまいも|じゃがいも|コーンフレーク|グラノーラ|餅/.test(name)) return 'grains';
  // 野菜
  if (/ブロッコリー|ほうれん草|ケール|アスパラ|トマト|きゅうり|レタス|キャベツ|白菜|玉ねぎ|にんじん|ピーマン|もやし|なす|かぼちゃ|いんげん|マッシュルーム|しめじ/.test(name)) return 'vegetables';
  // 果物
  if (/バナナ|りんご|みかん|オレンジ|グレープフルーツ|キウイ|いちご|ぶどう|もも|ネクタリン|ブルーベリー|アボカド|マンゴー|パイナップル|レーズン|デーツ/.test(name)) return 'fruits';
  // ナッツ
  if (/アーモンド|くるみ|カシューナッツ|ピーナッツ|マカダミア|ひまわり|かぼちゃの種|チアシード|ごま/.test(name)) return 'nuts';
  // 油脂類
  if (/オイル|バター|マーガリン|マヨネーズ|油/.test(name)) return 'oils';
  // 調味料
  if (/醤油|味噌|マスタード|ケチャップ|ソース|はちみつ|メープル|砂糖/.test(name)) return 'seasonings';
  // サプリメント
  if (/プロテイン|BCAA|クレアチン/.test(name)) return 'supplements';
  // 飲料
  if (/ジュース|ドリンク|コーラ|ビール/.test(name)) return 'beverages';

  return 'other';
}

export function useFoodMaster() {
  const foods = useLiveQuery(() =>
    db.foodMaster.orderBy('name').toArray()
  );

  // カテゴリ別に分類された食品
  const foodsByCategory = useMemo(() => {
    if (!foods) return null;

    const grouped: Record<FoodCategory, FoodMaster[]> = {
      meat: [],
      seafood: [],
      egg_dairy: [],
      legumes: [],
      grains: [],
      vegetables: [],
      fruits: [],
      nuts: [],
      oils: [],
      seasonings: [],
      supplements: [],
      beverages: [],
      other: [],
    };

    foods.forEach(food => {
      const category = inferCategory(food.name);
      grouped[category].push(food);
    });

    return grouped;
  }, [foods]);

  const searchFoods = useCallback(async (query: string) => {
    if (!query.trim()) {
      return await db.foodMaster.orderBy('name').limit(30).toArray();
    }
    return await db.foodMaster
      .filter(food => food.name.toLowerCase().includes(query.toLowerCase()))
      .limit(30)
      .toArray();
  }, []);

  const addFood = useCallback(async (food: Omit<FoodMaster, 'id' | 'createdAt' | 'isCustom'>) => {
    return await db.foodMaster.add({
      ...food,
      isCustom: true,
      createdAt: new Date(),
    });
  }, []);

  const updateFood = useCallback(async (id: number, updates: Partial<FoodMaster>) => {
    await db.foodMaster.update(id, updates);
  }, []);

  const deleteFood = useCallback(async (id: number) => {
    await db.foodMaster.delete(id);
  }, []);

  const getFoodById = useCallback(async (id: number) => {
    return await db.foodMaster.get(id);
  }, []);

  return {
    foods,
    foodsByCategory,
    searchFoods,
    addFood,
    updateFood,
    deleteFood,
    getFoodById,
    isLoading: foods === undefined,
  };
}
