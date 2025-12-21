// 数値フォーマット
export function formatNumber(num: number, decimals: number = 1): string {
  return num.toFixed(decimals);
}

// 体重表示
export function formatWeight(weight: number): string {
  return `${weight.toFixed(1)} kg`;
}

// カロリー表示
export function formatCalories(calories: number): string {
  return `${Math.round(calories)} kcal`;
}

// PFC表示
export function formatMacro(value: number, unit: string = 'g'): string {
  return `${value.toFixed(1)}${unit}`;
}

// ボリューム表示
export function formatVolume(volume: number): string {
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}k kg`;
  }
  return `${volume.toFixed(0)} kg`;
}

// 時間表示（秒→分:秒）
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// 時間表示（分）
export function formatMinutes(minutes: number): string {
  return `${minutes}分`;
}

// パーセント表示
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

// 体脂肪率表示
export function formatBodyFat(percent: number): string {
  return `${percent.toFixed(1)}%`;
}

// 変動値表示（+/-付き）
export function formatChange(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}`;
}

// 部位名を日本語に変換
export const bodyPartLabels: Record<string, string> = {
  chest: '胸',
  back: '背中',
  shoulder: '肩',
  arm: '腕',
  leg: '脚',
  core: '体幹',
  other: 'その他',
};

export function formatBodyPart(bodyPart: string): string {
  return bodyPartLabels[bodyPart] || bodyPart;
}

// 食事タイプを日本語に変換
export const mealTypeLabels: Record<string, string> = {
  breakfast: '朝食',
  lunch: '昼食',
  dinner: '夕食',
  snack: '間食',
};

export const mealTypeEmojis: Record<string, string> = {
  breakfast: '☀️',
  lunch: '🌤️',
  dinner: '🌙',
  snack: '🍪',
};

export function formatMealType(mealType: string): string {
  return mealTypeLabels[mealType] || mealType;
}

// 目標タイプを日本語に変換
export const goalTypeLabels: Record<string, string> = {
  diet: '減量',
  bulk: '増量',
  maintain: '維持',
};

export function formatGoalType(goalType: string): string {
  return goalTypeLabels[goalType] || goalType;
}
