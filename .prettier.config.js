module.exports = {
  // 기본 포맷팅
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  
  // 배열과 객체
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  
  // 화살표 함수
  arrowParens: 'avoid',
  
  // 줄바꿈
  endOfLine: 'lf',
  
  // HTML/JSX (향후 확장용)
  htmlWhitespaceSensitivity: 'css',
  
  // 파일별 설정
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 120,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 100,
        proseWrap: 'always',
      },
    },
  ],
}; 