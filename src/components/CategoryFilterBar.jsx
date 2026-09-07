import { ScrollChipBar } from './ScrollChipBar'

const ALL = '__all__'

// 카테고리별로 나뉘어 있던 목록을 한 화면에 쭉 펼치는 대신, 상단에 가로
// 스크롤되는 칩으로 올려서 원하는 카테고리 하나만 눌러 볼 수 있게 한다.
// 식재료 카테고리와 마트 카테고리 모두 같은 모양으로 쓴다.
export function CategoryFilterBar({ categories, value, onChange }) {
  const options = [{ id: ALL, label: '전체' }, ...categories.map((c) => ({ id: c, label: c }))]

  return <ScrollChipBar options={options} value={value} onChange={onChange} />
}

export const ALL_CATEGORY_ID = ALL
