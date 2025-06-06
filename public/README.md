# Public Assets

이 디렉토리는 정적 자산들을 포함합니다.

## 📁 디렉토리 구조

```
public/
├── README.md          # 이 파일
├── favicon.ico        # 파비콘 (예제용)
├── logo.png          # 로고 이미지 (예제용)
└── ...               # 기타 정적 자산들
```

## 🎯 용도

- **파비콘**: `favicon.ico`
- **로고 이미지**: `logo.png`, `logo.svg` 등
- **기타 정적 이미지**: 문서용 이미지, 아이콘 등
- **정적 JSON 파일**: 설정 파일, 데이터 파일 등
- **기타 정적 자산**: CSS, 폰트 파일 등

## 📋 사용법

### Vite에서 사용
```javascript
// 정적 자산 참조
const logoUrl = '/logo.png';
const faviconUrl = '/favicon.ico';
```

### HTML에서 사용
```html
<link rel="icon" href="/favicon.ico" type="image/x-icon">
<img src="/logo.png" alt="JihoFrame Logo">
```

## ⚡ Vite 연동

이 디렉토리의 파일들은 Vite의 정적 자산 처리 시스템에 의해 자동으로 처리됩니다.
- 개발 시: 개발 서버에서 직접 제공
- 빌드 시: `dist/` 디렉토리로 복사

## 📝 참고

- [Vite Static Asset Handling](https://vitejs.dev/guide/assets.html#static-assets)
- [Public Directory](https://vitejs.dev/guide/assets.html#the-public-directory) 