/**
 * JihoFrame 성능 벤치마크 도구
 */

class PerformanceBenchmark {
  constructor() {
    this.results = new Map();
    this.baselines = new Map();
    this.currentSuite = null;
  }

  /**
   * 벤치마크 스위트 시작
   */
  suite(name) {
    this.currentSuite = name;
    this.results.set(name, []);
    console.log(`\n🏃‍♂️ 벤치마크 스위트: ${name}`);
    return this;
  }

  /**
   * 개별 벤치마크 실행
   */
  bench(name, fn, options = {}) {
    if (!this.currentSuite) {
      throw new Error('벤치마크 스위트를 먼저 시작하세요. suite() 메서드를 호출하세요.');
    }

    const {
      iterations = 1000,
      warmup = 100,
      timeout = 5000,
    } = options;

    console.log(`  ⏱️  ${name} 실행 중...`);

    // 워밍업
    for (let i = 0; i < warmup; i++) {
      fn();
    }

    // 실제 측정
    const times = [];
    const startTime = performance.now();

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      fn();
      const end = performance.now();
      times.push(end - start);

      // 타임아웃 체크
      if (performance.now() - startTime > timeout) {
        console.warn(`    ⚠️  타임아웃으로 인해 ${i + 1}/${iterations} 반복 후 중단`);
        break;
      }
    }

    const result = this.calculateStats(times);
    result.name = name;
    result.iterations = times.length;

    this.results.get(this.currentSuite).push(result);

    console.log(`    ✅ 완료: ${result.mean.toFixed(3)}ms (평균) ± ${result.stdDev.toFixed(3)}ms`);

    return this;
  }

  /**
   * 통계 계산
   */
  calculateStats(times) {
    times.sort((a, b) => a - b);
    
    const sum = times.reduce((acc, time) => acc + time, 0);
    const mean = sum / times.length;
    
    const variance = times.reduce((acc, time) => acc + Math.pow(time - mean, 2), 0) / times.length;
    const stdDev = Math.sqrt(variance);
    
    const p50 = times[Math.floor(times.length * 0.5)];
    const p95 = times[Math.floor(times.length * 0.95)];
    const p99 = times[Math.floor(times.length * 0.99)];

    return {
      times,
      sum,
      mean,
      stdDev,
      min: times[0],
      max: times[times.length - 1],
      p50,
      p95,
      p99,
      opsPerSecond: 1000 / mean,
    };
  }

  /**
   * 메모리 사용량 측정
   */
  measureMemory(name, fn) {
    if (!performance.memory) {
      console.warn('메모리 측정이 지원되지 않는 환경입니다.');
      return null;
    }

    // 가비지 컬렉션 (가능한 경우)
    if (global.gc) {
      global.gc();
    }

    const beforeMemory = {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
    };

    const startTime = performance.now();
    const result = fn();
    const endTime = performance.now();

    const afterMemory = {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
    };

    const memoryResult = {
      name,
      executionTime: endTime - startTime,
      memoryDelta: afterMemory.used - beforeMemory.used,
      memoryDeltaMB: (afterMemory.used - beforeMemory.used) / 1048576,
      beforeMemory,
      afterMemory,
      result,
    };

    console.log(`🧠 메모리 측정: ${name}`);
    console.log(`   실행 시간: ${memoryResult.executionTime.toFixed(3)}ms`);
    console.log(`   메모리 변화: ${memoryResult.memoryDeltaMB.toFixed(3)}MB`);

    return memoryResult;
  }

  /**
   * 비교 벤치마크 실행
   */
  compare(benchmarks, options = {}) {
    const results = [];
    
    for (const benchmark of benchmarks) {
      this.suite(benchmark.name);
      this.bench('execution', benchmark.fn, options);
      results.push({
        name: benchmark.name,
        result: this.results.get(benchmark.name)[0],
      });
    }

    // 결과 비교
    console.log('\n📊 비교 결과:');
    const fastest = results.reduce((fast, current) => 
      current.result.mean < fast.result.mean ? current : fast
    );

    results.forEach(({ name, result }) => {
      const ratio = result.mean / fastest.result.mean;
      const status = ratio === 1 ? '🥇 가장 빠름' : `${ratio.toFixed(2)}x 느림`;
      console.log(`   ${name}: ${result.mean.toFixed(3)}ms (${status})`);
    });

    return results;
  }

  /**
   * 베이스라인 설정
   */
  setBaseline(name, result) {
    this.baselines.set(name, result);
    console.log(`📏 베이스라인 설정: ${name} - ${result.mean.toFixed(3)}ms`);
  }

  /**
   * 베이스라인과 비교
   */
  compareToBaseline(name, result) {
    const baseline = this.baselines.get(name);
    if (!baseline) {
      console.warn(`베이스라인을 찾을 수 없습니다: ${name}`);
      return null;
    }

    const improvement = ((baseline.mean - result.mean) / baseline.mean) * 100;
    const status = improvement > 0 ? '🚀 개선됨' : '📉 느려짐';
    
    console.log(`📈 베이스라인 비교: ${name}`);
    console.log(`   이전: ${baseline.mean.toFixed(3)}ms`);
    console.log(`   현재: ${result.mean.toFixed(3)}ms`);
    console.log(`   변화: ${Math.abs(improvement).toFixed(2)}% ${status}`);

    return {
      baseline: baseline.mean,
      current: result.mean,
      improvement,
      status,
    };
  }

  /**
   * HTML 리포트 생성
   */
  generateHtmlReport() {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>JihoFrame 성능 벤치마크 리포트</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .suite { margin-bottom: 30px; border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
        .benchmark { margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 3px; }
        .stats { display: flex; gap: 15px; flex-wrap: wrap; }
        .stat { background: white; padding: 8px; border-radius: 3px; border: 1px solid #ddd; }
        .chart { width: 100%; height: 200px; background: #fff; border: 1px solid #ddd; margin: 10px 0; }
        h1 { color: #333; } h2 { color: #666; } h3 { color: #888; }
    </style>
</head>
<body>
    <h1>🏃‍♂️ JihoFrame 성능 벤치마크 리포트</h1>
    <p><strong>생성 시간:</strong> ${new Date().toLocaleString()}</p>
    
    ${Array.from(this.results.entries()).map(([suiteName, benchmarks]) => `
        <div class="suite">
            <h2>${suiteName}</h2>
            ${benchmarks.map(benchmark => `
                <div class="benchmark">
                    <h3>${benchmark.name}</h3>
                    <div class="stats">
                        <div class="stat"><strong>평균:</strong> ${benchmark.mean.toFixed(3)}ms</div>
                        <div class="stat"><strong>최소:</strong> ${benchmark.min.toFixed(3)}ms</div>
                        <div class="stat"><strong>최대:</strong> ${benchmark.max.toFixed(3)}ms</div>
                        <div class="stat"><strong>표준편차:</strong> ${benchmark.stdDev.toFixed(3)}ms</div>
                        <div class="stat"><strong>P50:</strong> ${benchmark.p50.toFixed(3)}ms</div>
                        <div class="stat"><strong>P95:</strong> ${benchmark.p95.toFixed(3)}ms</div>
                        <div class="stat"><strong>P99:</strong> ${benchmark.p99.toFixed(3)}ms</div>
                        <div class="stat"><strong>OPS:</strong> ${Math.round(benchmark.opsPerSecond)}/sec</div>
                        <div class="stat"><strong>반복:</strong> ${benchmark.iterations}회</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('')}
    
    <div class="suite">
        <h2>성능 권장사항</h2>
        ${this.generatePerformanceRecommendations()}
    </div>
</body>
</html>`;

    return html;
  }

  /**
   * 성능 권장사항 생성
   */
  generatePerformanceRecommendations() {
    const recommendations = [];
    
    for (const [suiteName, benchmarks] of this.results.entries()) {
      for (const benchmark of benchmarks) {
        if (benchmark.mean > 50) {
          recommendations.push(`⚠️ ${suiteName}/${benchmark.name}: 실행 시간이 50ms를 초과합니다.`);
        }
        if (benchmark.stdDev / benchmark.mean > 0.5) {
          recommendations.push(`📊 ${suiteName}/${benchmark.name}: 성능 편차가 큽니다. 일관성을 확인하세요.`);
        }
        if (benchmark.opsPerSecond < 1000) {
          recommendations.push(`🐌 ${suiteName}/${benchmark.name}: 초당 연산 수가 낮습니다.`);
        }
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ 모든 성능 지표가 양호합니다!');
    }

    return recommendations.map(rec => `<p>${rec}</p>`).join('');
  }

  /**
   * 결과 출력
   */
  printResults() {
    console.log('\n📊 벤치마크 결과 요약:');
    
    for (const [suiteName, benchmarks] of this.results.entries()) {
      console.log(`\n🏃‍♂️ ${suiteName}:`);
      
      for (const benchmark of benchmarks) {
        console.log(`  ${benchmark.name}:`);
        console.log(`    평균: ${benchmark.mean.toFixed(3)}ms`);
        console.log(`    범위: ${benchmark.min.toFixed(3)}ms ~ ${benchmark.max.toFixed(3)}ms`);
        console.log(`    P95: ${benchmark.p95.toFixed(3)}ms`);
        console.log(`    OPS: ${Math.round(benchmark.opsPerSecond)}/sec`);
        console.log(`    반복: ${benchmark.iterations}회`);
      }
    }
  }

  /**
   * 결과 지우기
   */
  clear() {
    this.results.clear();
    this.baselines.clear();
    this.currentSuite = null;
  }
}

export default PerformanceBenchmark; 