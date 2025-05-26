# 🚀 JihoFrame 배포 가이드

## 📋 배포 전 체크리스트

### ✅ 완료된 항목들
- [x] 코드 최적화 및 버그 수정
- [x] README.md 전체 수정 (TodoList 예제 포함)
- [x] TypeScript 정의 파일 (.d.ts)
- [x] 빌드 설정 (ES, UMD 모듈)
- [x] LICENSE 파일 (MIT)
- [x] .gitignore 설정
- [x] package.json 최적화

### 🔧 배포 전 필요한 작업

1. **GitHub 저장소 URL 업데이트**
   ```bash
   # package.json에서 다음 URL들을 실제 저장소로 변경
   "repository": {
     "type": "git",
     "url": "https://github.com/YOUR_USERNAME/jiho-frame.git"
   },
   "bugs": {
     "url": "https://github.com/YOUR_USERNAME/jiho-frame/issues"
   },
   "homepage": "https://github.com/YOUR_USERNAME/jiho-frame#readme"
   ```

2. **이메일 주소 업데이트**
   ```bash
   # package.json과 git config에서 실제 이메일로 변경
   git config user.email "your-real-email@example.com"
   ```

## 🐙 GitHub 배포

### 1. GitHub 저장소 생성
1. GitHub에서 새 저장소 생성: `jiho-frame`
2. Public으로 설정
3. README, .gitignore, LICENSE는 이미 있으므로 체크하지 않음

### 2. 원격 저장소 연결
```bash
# 원격 저장소 추가
git remote add origin https://github.com/YOUR_USERNAME/jiho-frame.git

# 브랜치 이름을 main으로 설정 (이미 설정되어 있음)
git branch -M main

# 첫 번째 푸시
git push -u origin main
```

### 3. GitHub 릴리즈 생성
1. GitHub 저장소 → Releases → Create a new release
2. Tag version: `v2.0.0`
3. Release title: `🚀 JihoFrame v2.0.0 - Major Update`
4. 릴리즈 노트:
```markdown
## 🎉 JihoFrame v2.0.0 - Major Update

### ✨ 새로운 기능
- 🚀 성능 최적화 (스마트 DOM 업데이트)
- 🔒 메모리 누수 방지 시스템
- 🛠️ 강화된 에러 처리
- 🎯 API 일관성 개선 (.value 프로퍼티)
- 🧠 새로운 유틸리티 함수들
  - `computedState()` - 계산된 상태
  - `combineStates()` - 상태 결합
  - `watchState()` - 상태 감시

### 📚 예제 및 문서
- 📝 완전한 TodoList 앱 예제
- 🎮 카운터 앱 예제
- 📖 전면 개편된 문서
- 🔧 API 레퍼런스
- 📈 마이그레이션 가이드

### 📦 빌드 개선
- TypeScript 정의 포함
- ES 및 UMD 모듈 지원
- 4KB gzipped 번들 크기

### 🔄 Breaking Changes
- `.value` 프로퍼티로 API 통일
- 간소화된 이벤트 처리
- 향상된 컴포넌트 시스템

기존 v1.x 코드와 호환성을 유지하면서도 새로운 기능들을 선택적으로 사용할 수 있습니다.
```

## 📦 NPM 배포

### 1. NPM 계정 준비
```bash
# NPM 로그인 (계정이 없다면 npmjs.com에서 가입)
npm login

# 로그인 확인
npm whoami
```

### 2. 배포 전 테스트
```bash
# 빌드 테스트
npm run build

# 패키지 내용 확인
npm pack --dry-run

# 로컬 테스트 (선택사항)
npm pack
# 생성된 .tgz 파일로 다른 프로젝트에서 테스트 가능
```

### 3. NPM 배포
```bash
# 배포 (prepublishOnly 스크립트가 자동으로 빌드 실행)
npm publish

# 배포 확인
npm view jiho-frame
```

### 4. 배포 후 확인
- NPM 웹사이트에서 패키지 확인: https://www.npmjs.com/package/jiho-frame
- 설치 테스트: `npm install jiho-frame`

## 🔄 향후 업데이트 배포

### 버전 업데이트
```bash
# 패치 버전 (2.0.0 → 2.0.1)
npm version patch

# 마이너 버전 (2.0.0 → 2.1.0)
npm version minor

# 메이저 버전 (2.0.0 → 3.0.0)
npm version major

# Git 태그와 함께 푸시
git push origin main --tags

# NPM 재배포
npm publish
```

## 🎯 배포 완료 후 할 일

1. **README 업데이트**
   - 실제 GitHub URL로 배지 업데이트
   - 설치 명령어 확인

2. **커뮤니티 공유**
   - 개발 커뮤니티에 공유
   - 블로그 포스트 작성
   - 소셜 미디어 홍보

3. **피드백 수집**
   - GitHub Issues 모니터링
   - 사용자 피드백 수집
   - 버그 리포트 대응

## 🚨 주의사항

- **NPM 패키지명 중복**: `jiho-frame`이 이미 사용 중이라면 다른 이름 사용
- **버전 관리**: 한 번 배포된 버전은 삭제할 수 없음 (24시간 내 unpublish 가능)
- **라이센스**: MIT 라이센스 확인
- **보안**: 민감한 정보가 포함되지 않았는지 확인

## 📞 문제 해결

### NPM 배포 실패 시
```bash
# 캐시 정리
npm cache clean --force

# 로그인 재시도
npm logout
npm login

# 권한 확인
npm access list packages
```

### Git 푸시 실패 시
```bash
# 원격 저장소 확인
git remote -v

# 강제 푸시 (주의: 협업 시 사용 금지)
git push -f origin main
```

---

**배포 성공을 기원합니다! 🎉** 