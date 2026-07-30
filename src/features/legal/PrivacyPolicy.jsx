const CONTACT_EMAIL = 'ahrang811@gmail.com'
const EFFECTIVE_DATE = '2026년 7월 27일'

function Section({ title, children }) {
  return (
    <section className="flex flex-col gap-2 border-t border-gray-100 pt-6 first:border-t-0 first:pt-0">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      <div className="flex flex-col gap-2 text-sm leading-relaxed text-gray-600">
        {children}
      </div>
    </section>
  )
}

export function PrivacyPolicy() {
  return (
    <div className="app-bg min-h-svh px-4 py-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <div className="flex flex-col gap-2">
          <a
            href="/"
            className="w-fit text-xs font-medium text-emerald-600 hover:text-emerald-700"
          >
            ← 공유 냉장고로 돌아가기
          </a>
          <h1 className="text-xl font-bold text-gray-900">개인정보처리방침</h1>
          <p className="text-xs text-gray-400">시행일자: {EFFECTIVE_DATE}</p>
        </div>

        <div className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm leading-relaxed text-gray-600">
            &lsquo;공유 냉장고&rsquo;(이하 &lsquo;서비스&rsquo;)는 개인이 운영하는
            냉장고·식단 관리 앱입니다. 이 문서는 서비스를 이용하면서 수집되는
            정보와 그 이용 방법을 안내합니다.
          </p>

          <Section title="1. 수집하는 개인정보 항목">
            <p>서비스는 다음과 같은 정보를 수집합니다.</p>
            <ul className="list-disc pl-5">
              <li>
                <strong>계정 정보</strong>: 이메일 주소, 비밀번호. 회원가입과
                로그인을 위해 Supabase Auth를 통해 수집·저장됩니다. 비밀번호는
                Supabase Auth에 의해 암호화되어 저장되며, 서비스 운영자를
                포함해 누구도 원문을 확인할 수 없습니다.
              </li>
              <li>
                <strong>이용자가 직접 입력하는 데이터</strong>: 식재료 이름·수량·카테고리·구매일·유통기한,
                장보기 목록, 식단(끼니) 계획, 레시피(요리 이름·재료·조리법·유튜브
                영상 링크) 등 이용자가 서비스 내에서 직접 작성하는 정보. 이
                정보는 같은 &lsquo;스페이스&rsquo;(가족·룸메이트 등 공유
                그룹)에 속한 다른 구성원에게도 공유됩니다.
              </li>
              <li>
                <strong>식비 기록</strong>: 캘린더에 입력하는 날짜별 식비
                금액은 서버로 전송되지 않고, 이용 중인 기기의 브라우저(로컬
                저장소)에만 저장됩니다. 다른 기기나 다른 구성원과 공유되지
                않으며, 브라우저 데이터를 삭제하면 함께 삭제됩니다.
              </li>
              <li>
                <strong>영수증 사진</strong>: &lsquo;영수증으로 추가&rsquo;
                기능 사용 시 촬영하거나 선택한 사진. 텍스트 인식을 위해 처리
                직후 사용되며 서비스 자체 서버에 별도 보관하지 않습니다 (자세한
                내용은 3항 참고).
              </li>
            </ul>
          </Section>

          <Section title="2. 개인정보의 수집 및 이용 목적">
            <ul className="list-disc pl-5">
              <li>회원 식별, 로그인 유지, 계정 관리</li>
              <li>냉장고·장보기·식단·레시피 관리 기능 제공 및 같은 스페이스 구성원 간 데이터 공유</li>
              <li>영수증 사진에서 식재료 목록 추출, 냉장고 재료 기반 레시피 추천, 유튜브 영상에서 레시피 정보 추출 등 AI 보조 기능 제공</li>
              <li>서비스 문의 응대</li>
            </ul>
          </Section>

          <Section title="3. 외부 서비스로의 정보 전송 (제3자 제공·처리위탁)">
            <p>
              일부 기능은 외부 API를 호출해서 동작하며, 이 과정에서 아래와
              같은 정보가 해당 서비스로 전송됩니다. 전송된 정보가 각 서비스에서
              어떻게 처리·보관되는지는 각 회사의 개인정보처리방침을
              따릅니다.
            </p>
            <ul className="list-disc pl-5">
              <li>
                <strong>Naver Clova OCR</strong> (&lsquo;영수증으로
                추가&rsquo; 기능): 촬영/선택한 영수증 사진이 텍스트 인식을
                위해 네이버 Clova OCR API로 전송됩니다.
              </li>
              <li>
                <strong>Google YouTube Data API</strong> (&lsquo;유튜브
                링크로 추가&rsquo; 기능): 입력한 유튜브 영상 링크가 영상
                제목·설명란·댓글을 가져오기 위해 Google에 전송됩니다.
              </li>
              <li>
                <strong>Google Gemini API</strong>: (1) &lsquo;냉장고 재료로
                레시피 추천&rsquo; 기능 사용 시 현재 등록된 식재료 이름
                목록이, (2) &lsquo;유튜브 링크로 추가&rsquo; 기능 사용 시
                영상 제목·설명란·댓글 텍스트가 레시피 정보 분석을 위해, (3)
                재고 관리 화면의 식재료 카드·상세정보 표시를 위해 식재료
                이름이 일러스트 이미지 생성 및 보관정보(최대 보관기한, 구입
                꿀팁) 생성 목적으로 Google Gemini API로 전송됩니다.
              </li>
              <li>
                <strong>Supabase</strong>: 계정 정보와 이용자가 입력한
                냉장고·레시피·식단 데이터는 인프라 제공업체인 Supabase의
                서버에 저장됩니다 (개인정보처리위탁). 또한 (3)에서 생성된
                식재료 일러스트와 보관정보는 특정 이용자나 스페이스에
                속하지 않는 식재료 이름 기준 공용 캐시로 Supabase에 저장되어,
                같은 이름의 식재료를 다른 이용자가 등록해도 재사용됩니다.
              </li>
            </ul>
            <p>
              위 외부 서비스로의 전송은 모두 서비스 자체 서버(서버리스
              함수)를 거쳐 이루어지며, API 키 등 인증 정보는 이용자의
              브라우저에 노출되지 않습니다.
            </p>
          </Section>

          <Section title="4. 광고 및 제휴 링크 안내">
            <p>
              이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의
              수수료를 제공받습니다.
            </p>
            <p>
              서비스는 식재료·장보기 목록의 &lsquo;최저가 보러가기&rsquo;
              버튼을 통해 쿠팡 파트너스 제휴 링크를 제공합니다. 버튼을 누르면
              해당 식재료 이름으로 검색한 쿠팡 검색 결과 페이지가 새 탭으로
              열리며, 이를 통해 발생한 구매에 대해 서비스 운영자가 일정액의
              수수료를 제공받을 수 있습니다. 제휴 링크를 통한 구매가 발생해도
              이용자가 추가로 부담하는 비용은 없습니다.
            </p>
          </Section>

          <Section title="5. 개인정보의 보유 및 파기">
            <p>
              회원 탈퇴 시 계정 정보와 이용자가 입력한 데이터는 지체 없이
              삭제됩니다. 다만 같은 스페이스의 다른 구성원이 등록한 데이터는
              탈퇴와 무관하게 유지될 수 있습니다. 관계 법령에 따라 보관이
              필요한 경우 해당 기간 동안 별도 보관 후 파기합니다.
            </p>
          </Section>

          <Section title="6. 이용자의 권리">
            <p>
              이용자는 언제든지 자신의 계정 정보와 등록한 데이터를
              열람·수정·삭제할 수 있으며, 앱 내에서 직접 처리하기 어려운
              사항은 아래 연락처로 요청할 수 있습니다.
            </p>
          </Section>

          <Section title="7. 문의처">
            <p>
              개인정보 처리에 관한 문의는 아래로 연락해주세요.
              <br />
              이메일:{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-emerald-600 hover:text-emerald-700"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </Section>

          <Section title="8. 방침의 변경">
            <p>
              이 개인정보처리방침은 서비스 내용 변경이나 관계 법령 개정에
              따라 수정될 수 있으며, 변경 시 이 페이지를 통해 고지합니다.
            </p>
          </Section>
        </div>
      </div>
    </div>
  )
}
