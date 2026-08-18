// 레시피에 영상이 붙어 있으면 { videoType, videoRef } 형태로, 없으면 null을 반환한다.
export function getRecipeVideo(recipe) {
  if (recipe.youtube_video_id) return { videoType: 'youtube', videoRef: recipe.youtube_video_id }
  if (recipe.instagram_url) return { videoType: 'instagram', videoRef: recipe.instagram_url }
  return null
}

// 후보 카드에 보여줄 썸네일 URL. 유튜브는 영상 ID만 있으면 항상 만들 수 있고,
// 인스타그램은 가져오기(import) 시점에 저장해둔 thumbnail_url이 있을 때만 보여준다
// (없으면 호출부에서 인스타그램 아이콘으로 대체한다).
export function getRecipeThumbnail(recipe, video) {
  if (!video) return null
  if (video.videoType === 'youtube') {
    return `https://img.youtube.com/vi/${video.videoRef}/hqdefault.jpg`
  }
  return recipe.thumbnail_url || null
}

function normalize(name) {
  return name.replace(/\s+/g, '').toLowerCase()
}

// 메뉴 이름과 맞는, 영상이 연결된 레시피들을 모두 찾는다.
// 정확히 같은 이름이 하나라도 있으면 그 그룹만, 없으면 한쪽 이름이 다른 쪽을
// 포함하는 항목들을 반환한다.
function matchRecipesWithVideo(recipes, menuName) {
  const target = normalize(menuName || '')
  if (!target) return []

  const withVideo = recipes
    .map((r) => ({ name: r.name, video: getRecipeVideo(r) }))
    .filter((r) => r.video)

  const exact = withVideo.filter((r) => normalize(r.name) === target)
  if (exact.length > 0) return exact

  return withVideo.filter((r) => {
    const n = normalize(r.name)
    return n.includes(target) || target.includes(n)
  })
}

// 동명(또는 유사한 이름)의 레시피가 정확히 하나뿐일 때만 그 영상을 자동으로
// 반환한다. 후보가 여러 개면 어느 것이 맞는지 알 수 없으므로 null을 반환하고,
// 호출부에서 hasAmbiguousRecipeMatch로 선택 모달을 띄우게 한다.
export function findMatchingRecipeVideo(recipes, menuName) {
  const matches = matchRecipesWithVideo(recipes, menuName)
  return matches.length === 1 ? matches[0].video : null
}

// 영상이 연결된 동명(또는 유사한 이름) 레시피가 2개 이상이라 자동으로 하나를
// 고를 수 없는 상태인지 확인한다.
export function hasAmbiguousRecipeMatch(recipes, menuName) {
  return matchRecipesWithVideo(recipes, menuName).length >= 2
}
