// 싱글턴 패턴
// 인스턴스가 단 하나만 존재, 그리고 항상 이 인스턴스로만 모든 작업이 이뤄짐.
// 사용 예 : 단일 데이터베이스 or 로거 or 환경변수와 같이 단일 인스턴스로만 관리해야 하는 클래스일 경우 사용.
// 프론트엔드 사용 예 : axios, 리덕스(or Zustand)의 전역 state

class Logger {
  // 1. 유일한 인스턴스를 저장할 정적(private) 속성
  private static instance: Logger;
  private logs: string[] = [];

  // 2. 외부에서 new 생성자 호출을 막기 위한 private 생성자
  private constructor() {
    // 초기화 코드(예: 로그 파일 열기 등)
  }

  // 3. 인스턴스를 반환하는 정적 메서드
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // 4. 실제 사용할 메서드 예시
  public log(message: string): void {
    const timestamp = new Date().toISOString();
    this.logs.push(`[${timestamp}] ${message}`);
  }

  public getLogs(): string[] {
    return this.logs;
  }

  public clearLogs(): void {
    this.logs = [];
  }
}

const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();

console.log(logger1 === logger2); // → true (항상 같은 인스턴스를 반환)

logger1.log("애플리케이션 시작");
logger2.log("이벤트 처리 중");

console.log(logger1.getLogs()); // → [ '[2025-07-09T00:00:00.000Z] 애플리케이션 시작' ]
console.log(logger2.getLogs()); // → [ '[2025-07-09T00:00:00.000Z] 애플리케이션 시작', '[2025-07-09T00:00:00.000Z] 이벤트 처리 중' ]

logger1.clearLogs();
console.log(logger2.getLogs()); // → []

// -------------------------------------------

// 단일 책임 원칙을 어긴다는 말이 있는데, 위의 Logger class가 인스턴스 생성 및 관리 / 로그 로직 둘 다 담당하기 때문이다.
// 만약 SRP를 지키는 방식으로 사용하려면 팩토리가 필요하다.
// SRP 준수: 인스턴스 관리는 Factory가, 비즈니스는 Logger가 담당
class Logger2 {
  public log(msg: string) {
    /*…*/
  }
}

class Logger2Factory {
  private static instance: Logger2;
  public static getLogger(): Logger2 {
    if (!Logger2Factory.instance) {
      Logger2Factory.instance = new Logger2();
    }
    return Logger2Factory.instance;
  }
}
