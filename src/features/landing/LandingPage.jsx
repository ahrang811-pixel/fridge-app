const CONTACT_EMAIL = 'ahrang811@gmail.com'

function PreviewFrame({ children, label }) {
  return (
    <div className="w-full max-w-[260px] shrink-0">
      <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
        {children}
      </div>
      <p className="mt-2 text-center text-[11px] text-gray-400">{label}</p>
    </div>
  )
}

function Row({ children, tone = 'bg-gray-50' }) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg ${tone} px-2 py-1.5 text-xs text-gray-600`}
    >
      {children}
    </div>
  )
}

function InventoryPreview() {
  const items = [
    { emoji: '🥚', name: '계란', qty: '6개', dday: 'D-2', tone: 'bg-red-50 text-red-500' },
    { emoji: '🥬', name: '대파', qty: '1단', dday: 'D-5', tone: 'bg-amber-50 text-amber-600' },
    { emoji: '🧈', name: '버터', qty: '200g', dday: 'D-12', tone: 'bg-emerald-50 text-emerald-600' },
    { emoji: '🥛', name: '우유', qty: '1L', dday: 'D-1', tone: 'bg-red-50 text-red-500' },
  ]
  return (
    <div className="flex flex-col gap-1.5">
      <p className="px-1 text-[11px] font-semibold text-gray-400">📦 재고 관리</p>
      {items.map((item) => (
        <Row key={item.name}>
          <span>
            {item.emoji} {item.name} · {item.qty}
          </span>
          <span className={`rounded px-1.5 py-0.5 font-medium ${item.tone}`}>
            {item.dday}
          </span>
        </Row>
      ))}
    </div>
  )
}

function ReceiptPreview() {
  const items = ['두부 1모', '계란 1판', '대파 1단', '우유 1L']
  return (
    <div className="flex flex-col gap-1.5">
      <p className="px-1 text-[11px] font-semibold text-gray-400">
        🧾 영수증 촬영 → 자동 인식
      </p>
      {items.map((item) => (
        <Row key={item}>
          <span className="flex items-center gap-1.5">
            <input
              type="checkbox"
              checked
              readOnly
              className="accent-emerald-600"
            />
            {item}
          </span>
        </Row>
      ))}
    </div>
  )
}

function AiRecipePreview() {
  return (
    <div className="flex flex-col gap-2">
      <p className="px-1 text-[11px] font-semibold text-gray-400">
        🤖 AI 레시피 추천
      </p>
      <p className="px-1 text-[11px] text-gray-400">
        냉장고 속 재료: 계란 · 대파 · 두부 · 된장
      </p>
      <div className="rounded-lg bg-emerald-50 p-2.5">
        <p className="text-xs font-semibold text-emerald-700">
          🍲 두부 된장찌개
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-emerald-700/70">
          지금 있는 재료로 바로 만들 수 있는 레시피를 추천해드려요.
        </p>
      </div>
    </div>
  )
}

function YoutubePreview() {
  return (
    <div className="flex flex-col gap-2">
      <p className="px-1 text-[11px] font-semibold text-gray-400">
        ▶️ 유튜브 링크로 추가
      </p>
      <p className="truncate px-1 text-[11px] text-gray-400">
        youtube.com/watch?v=… 붙여넣기
      </p>
      <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2">
        <div className="h-10 w-14 shrink-0 rounded bg-gray-200" />
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-gray-700">
            김치볶음밥 황금레시피
          </p>
          <p className="text-[11px] text-gray-400">
            재료 7개 · 조리순서 5단계 자동 추출
          </p>
        </div>
      </div>
    </div>
  )
}

function CalendarPreview() {
  const days = ['월', '화', '수', '목', '금', '토', '일']
  const meals = ['🍳', '', '🍱', '🍲', '', '🍝', '🍕']
  return (
    <div className="flex flex-col gap-1.5">
      <p className="px-1 text-[11px] font-semibold text-gray-400">📅 식단 캘린더</p>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => (
          <div
            key={d}
            className="flex flex-col items-center gap-1 rounded-lg bg-gray-50 py-2"
          >
            <span className="text-[10px] text-gray-400">{d}</span>
            <span className="text-sm">{meals[i] || '·'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ExpensePreview() {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="px-1 text-[11px] font-semibold text-gray-400">💰 식비 관리</p>
      <Row>
        <span>7/27 (일) 장보기</span>
        <span className="font-medium text-gray-700">32,400원</span>
      </Row>
      <Row>
        <span>7/28 (월) 배달</span>
        <span className="font-medium text-gray-700">18,900원</span>
      </Row>
      <Row tone="bg-emerald-50">
        <span className="font-semibold text-emerald-700">7월 누적 식비</span>
        <span className="font-semibold text-emerald-700">412,300원</span>
      </Row>
    </div>
  )
}

function SpacePreview() {
  return (
    <div className="flex flex-col gap-2">
      <p className="px-1 text-[11px] font-semibold text-gray-400">
        🏠 스페이스로 같이 쓰기
      </p>
      <div className="flex items-center gap-1.5 px-1">
        {['엄마', '아빠', '나'].map((who) => (
          <span
            key={who}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-medium text-emerald-700"
          >
            {who}
          </span>
        ))}
      </div>
      <Row tone="bg-gray-50">
        <span>초대 코드</span>
        <span className="rounded bg-white px-1.5 py-0.5 font-mono font-medium text-gray-700">
          7F3K9Q
        </span>
      </Row>
    </div>
  )
}

function ShoppingPreview() {
  const items = ['샴푸 리필', '계란', '식빵', '고추장']
  return (
    <div className="flex flex-col gap-1.5">
      <p className="px-1 text-[11px] font-semibold text-gray-400">🛒 장보기 목록</p>
      {items.map((item, i) => (
        <Row key={item}>
          <span className={i < 2 ? 'text-gray-300 line-through' : ''}>
            {item}
          </span>
        </Row>
      ))}
    </div>
  )
}

function Feature({ icon, title, description, reverse, preview }) {
  const paragraphs = Array.isArray(description) ? description : [description]
  return (
    <div
      className={`flex flex-col items-center gap-6 sm:gap-10 ${
        reverse ? 'sm:flex-row-reverse' : 'sm:flex-row'
      }`}
    >
      <div className="flex-1">
        <p className="text-2xl">{icon}</p>
        <h3 className="mt-2 text-lg font-bold text-gray-900">{title}</h3>
        <div className="mt-3 flex flex-col gap-3">
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="break-keep text-sm leading-relaxed text-gray-600"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      <PreviewFrame label="화면 미리보기">{preview}</PreviewFrame>
    </div>
  )
}

function Faq({ q, a }) {
  return (
    <div className="border-t border-gray-100 py-4 first:border-t-0 first:pt-0">
      <p className="text-sm font-semibold text-gray-900">Q. {q}</p>
      <p className="mt-1.5 break-keep text-sm leading-relaxed text-gray-600">
        A. {a}
      </p>
    </div>
  )
}

export function LandingPage({ isLoggedIn, onEnter }) {
  const ctaLabel = isLoggedIn ? '내 냉장고로 가기' : '무료로 시작하기'

  return (
    <div className="app-bg min-h-svh">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-8">
        <span className="text-base font-bold text-gray-900">🧊 공유 냉장고</span>
        <button
          type="button"
          onClick={onEnter}
          className="rounded-md bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700 sm:text-sm"
        >
          {ctaLabel}
        </button>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-20 px-4 pb-20 sm:px-8">
        {/* Hero */}
        <section className="flex flex-col items-center gap-5 pt-6 text-center sm:pt-10">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            가족·룸메이트와 함께 쓰는 무료 냉장고 관리 앱
          </span>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            냉장고 속 재료, 이제 온 가족이
            <br />
            함께 관리하세요
          </h1>
          <div className="flex max-w-xl flex-col gap-3 text-sm leading-relaxed text-gray-600 sm:text-base">
            <p className="break-keep">
              &lsquo;공유 냉장고&rsquo;는 가족이나 룸메이트와 함께 냉장고
              재고를 관리하는 앱이에요. 유통기한을 놓치지 않도록 알려주고,
              영수증 한 장으로 재료를 빠르게 등록할 수 있어요.
            </p>
            <p className="break-keep">
              AI가 추천하는 레시피로 오늘 뭘 먹을지 고민도 덜어드려요.
              설치 없이 브라우저에서 바로 쓸 수 있고, 홈 화면에 추가하면
              앱처럼 사용할 수 있습니다.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onEnter}
              className="rounded-md bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700"
            >
              {ctaLabel}
            </button>
            <a
              href="#features"
              className="rounded-md border border-gray-200 bg-white px-6 py-3 text-center text-sm font-medium text-gray-600 hover:border-gray-300"
            >
              주요 기능 살펴보기
            </a>
          </div>
        </section>

        {/* Pain points */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
          <h2 className="text-center text-xl font-bold text-gray-900">
            이런 경험, 한 번쯤 있으시죠?
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              [
                '🕵️',
                '냉장고 안쪽 유통기한',
                '냉장고 구석에서 유통기한이 한참 지난 재료를 발견한 적 있으신가요? 아까운 마음으로 버리게 되죠.',
              ],
              [
                '🛒',
                '중복 구매',
                '가족이 각자 장을 봐서 같은 재료가 쌓인 적 있으신가요? 있는 줄 모르고 또 사 오기도 하죠.',
              ],
              [
                '🤔',
                '오늘 뭐 먹지 고민',
                '냉장고 문 앞에서 오늘 뭘 해 먹을지 한참 고민한 적 있으신가요? 그 시간이 아깝게 느껴지죠.',
              ],
            ].map(([emoji, title, desc]) => (
              <div key={title} className="rounded-xl bg-gray-50 p-4">
                <p className="text-xl">{emoji}</p>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {title}
                </p>
                <p className="mt-1.5 break-keep text-xs leading-relaxed text-gray-600">
                  {desc}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 break-keep text-center text-sm text-gray-500">
            공유 냉장고는 이런 소소하지만 반복되는 불편을 줄이기 위해
            만들어졌습니다.
          </p>
        </section>

        {/* Features */}
        <section id="features" className="flex flex-col gap-16 scroll-mt-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">주요 기능</h2>
            <p className="mt-2 break-keep text-sm text-gray-500">
              재료를 등록하는 순간부터 밥상에 올리기까지, 냉장고 관리의
              전 과정을 함께합니다.
            </p>
          </div>

          <Feature
            icon="📦"
            title="식재료 재고 관리"
            description={[
              '이름, 수량, 카테고리, 구매일, 유통기한을 등록하면 유통기한이 임박한 순서로 정리해서 보여줘요. D-day 배지로 한눈에 확인할 수 있어요.',
              '그래서 재료를 깜빡하고 썩히는 일이 줄어듭니다. 카테고리는 직접 추가하고 수정할 수 있어서 우리 집 냉장고 구조에 맞게 정리할 수 있어요.',
            ]}
            preview={<InventoryPreview />}
          />

          <Feature
            reverse
            icon="🧾"
            title="영수증 스캔으로 한 번에 등록"
            description={[
              '장을 보고 온 영수증을 사진으로 찍기만 하면 돼요. 광학 문자 인식(OCR)이 구매한 품목을 자동으로 읽어냅니다.',
              '인식된 목록은 확인하고 필요하면 수정할 수 있어요. 한 번에 재고로 추가하면 되니, 재료를 하나하나 손으로 입력하는 수고를 크게 덜 수 있어요.',
            ]}
            preview={<ReceiptPreview />}
          />

          <Feature
            icon="🤖"
            title="AI 레시피 추천"
            description={[
              '지금 냉장고에 있는 재료 목록을 바탕으로 AI가 바로 만들 수 있는 레시피를 추천해줍니다.',
              '부족한 재료를 억지로 사지 않아도 돼요. 있는 재료를 최대한 활용해서 음식물 쓰레기와 장보기 비용을 함께 줄일 수 있습니다.',
            ]}
            preview={<AiRecipePreview />}
          />

          <Feature
            reverse
            icon="▶️"
            title="유튜브 레시피 연동"
            description={[
              '즐겨 보는 요리 유튜브 영상 링크를 붙여넣어 보세요. 영상 제목과 설명란, 댓글에 담긴 재료와 조리 순서를 AI가 분석합니다.',
              '분석한 내용은 레시피 카드로 자동 정리돼요. 영상을 몇 번씩 돌려보며 재료를 받아 적을 필요 없이, 정리된 레시피를 냉장고 재료와 바로 연결할 수 있습니다.',
            ]}
            preview={<YoutubePreview />}
          />

          <Feature
            icon="📅"
            title="식단 캘린더"
            description={[
              '아침·점심·저녁 끼니를 달력에 계획하고 기록할 수 있어요.',
              '주간 보기와 월간 보기를 오가며 이번 주에 뭘 먹었는지, 다음 주엔 뭘 먹을지 가족과 함께 미리 정할 수 있습니다.',
            ]}
            preview={<CalendarPreview />}
          />

          <Feature
            reverse
            icon="🛒"
            title="장보기 목록"
            description={[
              '사야 할 품목을 목록으로 만들어두고, 장을 보면서 체크해나갈 수 있어요.',
              '가족 구성원이 같은 스페이스에 있다면 목록도 함께 공유돼요. 누가 뭘 사야 할지 다시 확인할 필요가 없습니다.',
            ]}
            preview={<ShoppingPreview />}
          />

          <Feature
            icon="💰"
            title="식비 관리"
            description={[
              '날짜별로 식비를 캘린더에 기록해보세요. 이번 달 식비가 얼마나 나갔는지 한눈에 볼 수 있습니다.',
              '식비 기록은 서버로 전송되지 않고 이용 중인 기기에만 저장돼요. 다른 사람에게 공유하고 싶지 않은 지출도 편하게 남길 수 있습니다.',
            ]}
            preview={<ExpensePreview />}
          />

          <Feature
            reverse
            icon="🏠"
            title="스페이스로 가족·룸메이트와 함께"
            description={[
              '스페이스를 만들고 초대 코드를 공유해보세요. 가족이나 룸메이트가 같은 냉장고 데이터를 함께 볼 수 있습니다.',
              '구성원 목록 확인, 관리자 위임, 내보내기, 나가기까지 스페이스 안에서 필요한 관리를 모두 할 수 있어요.',
            ]}
            preview={<SpacePreview />}
          />
        </section>

        {/* How it works */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
          <h2 className="text-center text-xl font-bold text-gray-900">
            이렇게 시작해요
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              [
                '1',
                '스페이스 만들기 또는 참여하기',
                '혼자 쓸 스페이스를 새로 만들거나, 가족이 공유한 초대 코드로 기존 스페이스에 참여하세요.',
              ],
              [
                '2',
                '재료 등록하기',
                '직접 입력하거나 영수증을 촬영해서 지금 냉장고에 있는 재료를 빠르게 등록하세요.',
              ],
              [
                '3',
                '레시피·식단 계획하기',
                'AI 추천 레시피나 유튜브 레시피를 참고해서 이번 주 식단을 캘린더에 채워보세요.',
              ],
            ].map(([num, title, desc]) => (
              <div key={num} className="flex flex-col items-center text-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                  {num}
                </span>
                <p className="mt-3 text-sm font-semibold text-gray-900">
                  {title}
                </p>
                <p className="mt-1.5 break-keep text-xs leading-relaxed text-gray-600">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-center text-xl font-bold text-gray-900">
            자주 묻는 질문
          </h2>
          <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <Faq
              q="이용료가 있나요?"
              a="아니요, 공유 냉장고는 무료로 이용할 수 있습니다."
            />
            <Faq
              q="가족이 아니어도 같이 쓸 수 있나요?"
              a="네. 룸메이트, 자취방 친구처럼 함께 냉장고를 쓰는 사람이라면 누구나 참여할 수 있어요. 초대 코드로 같은 스페이스에 들어와서 재료와 식단을 함께 관리하면 됩니다."
            />
            <Faq
              q="입력한 데이터는 안전하게 보관되나요?"
              a="네. 계정 정보와 입력하신 데이터는 Supabase 인프라에 안전하게 저장돼요. 자세한 수집·이용 항목은 개인정보처리방침 페이지에서 확인할 수 있습니다."
            />
            <Faq
              q="휴대폰에서도 쓸 수 있나요?"
              a="네. 별도 설치 없이 모바일 브라우저에서 바로 이용할 수 있어요. 홈 화면에 추가하면 일반 앱처럼 아이콘을 눌러 실행할 수 있습니다."
            />
          </div>
        </section>

        {/* Final CTA */}
        <section className="flex flex-col items-center gap-4 rounded-2xl bg-emerald-600 px-6 py-12 text-center">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            오늘부터 냉장고 관리, 같이 해보세요
          </h2>
          <p className="max-w-md text-sm text-emerald-50">
            가입은 이메일만 있으면 1분도 걸리지 않아요.
          </p>
          <button
            type="button"
            onClick={onEnter}
            className="rounded-md bg-white px-6 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            {ctaLabel}
          </button>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-5xl flex-col items-center gap-2 px-4 pb-10 text-center">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <a href="/privacy" className="hover:text-gray-600">
            개인정보처리방침
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="hover:text-gray-600"
          >
            문의: {CONTACT_EMAIL}
          </a>
        </div>
        <p className="text-xs text-gray-300">© 2026 공유 냉장고</p>
      </footer>
    </div>
  )
}
