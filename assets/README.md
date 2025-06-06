# Assets

이 디렉토리는 소스 코드에서 직접 import하여 사용하는 자산들을 포함합니다.

## 📁 디렉토리 구조

```
assets/
├── README.md          # 이 파일
├── images/           # 이미지 파일들
├── styles/           # CSS/SCSS 파일들
├── fonts/            # 폰트 파일들
└── icons/            # 아이콘 파일들
```

## 🎯 용도

- **이미지**: 컴포넌트에서 사용하는 이미지들
- **스타일**: CSS, SCSS, Less 파일들
- **폰트**: 웹폰트 파일들
- **아이콘**: SVG, PNG 아이콘들
- **기타**: JSON 데이터, 설정 파일 등

## 📋 사용법

### JavaScript/TypeScript에서 import
```javascript
// 이미지 import
import logo from './assets/images/logo.png';
import icon from './assets/icons/check.svg';

// CSS import
import './assets/styles/main.css';

// JSON 데이터 import
import config from './assets/data/config.json';
```

### JihoFrame에서 사용
```javascript
import logoImg from '../assets/images/logo.png';

function Header() {
  return {
    layout: [
      {
        img: {
          src: logoImg,
          alt: "JihoFrame Logo",
          style: { width: "100px", height: "auto" }
        }
      }
    ]
  };
}
```

## ⚡ Vite 연동

이 디렉토리의 파일들은 Vite의 자산 처리 시스템에 의해:
- **개발 시**: ES 모듈로 변환되어 제공
- **빌드 시**: 최적화되고 해시가 추가된 파일명으로 변환
- **자동 최적화**: 이미지 압축, CSS 최적화 등

## 🆚 Public vs Assets

| 항목 | Public | Assets |
|------|--------|--------|
| 접근 방법 | URL 경로로 직접 접근 | import/require로 접근 |
| 빌드 처리 | 그대로 복사 | 번들링/최적화 |
| 파일명 | 변경되지 않음 | 해시 추가됨 |
| 사용 예 | favicon, robots.txt | 컴포넌트 이미지, CSS |

## 📝 참고

- [Vite Asset Handling](https://vitejs.dev/guide/assets.html)
- [Static vs Dynamic Assets](https://vitejs.dev/guide/assets.html#importing-asset-as-url) 