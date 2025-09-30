// ---------- Memento 패턴 (TypeScript) ----------

// Memento: 상태(스냅샷)를 보관
class Memento {
  // 실제 상태는 private으로 감춘다(타입스크립트 수준에서만 보호).
  constructor(
    private readonly state: string,
    private readonly timestamp = new Date()
  ) {}

  // Originator만 이 메서드를 사용해야 한다는 규약으로 둔다.
  getState(): string {
    return this.state;
  }

  getName(): string {
    return `${this.timestamp.toISOString()} (${this.state.slice(0, 20)}${
      this.state.length > 20 ? "..." : ""
    })`;
  }
}

// Originator: 현재 상태를 가지고 Memento를 생성/복원
class DocumentOriginator {
  private content = "";

  write(text: string) {
    this.content += text;
  }

  overwrite(text: string) {
    this.content = text;
  }

  getContent(): string {
    return this.content;
  }

  createMemento(): Memento {
    return new Memento(this.content);
  }

  // memento의 내부 구조는 Originator만 알도록 설계
  restore(m: Memento) {
    this.content = m.getState();
  }
}

// Caretaker: 여러 Memento를 보관하고 undo/redo 제공
class Caretaker {
  private history: Memento[] = [];
  private currentIndex = -1;

  // 스냅샷을 추가하면 현재 인덱스 이후의 히스토리는 버린다 (redo 불가하게)
  backup(m: Memento) {
    // 만약 undo로 뒤로 가 있다가 새 작업을 하면 redo 기록을 삭제
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(m);
    this.currentIndex = this.history.length - 1;
  }

  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  canRedo(): boolean {
    return this.currentIndex + 1 < this.history.length;
  }

  // undo: 한 단계 이전 상태로 복원
  undo(originator: DocumentOriginator): boolean {
    if (!this.canUndo()) return false;
    this.currentIndex--;
    const m = this.history[this.currentIndex];
    originator.restore(m);
    return true;
  }

  // redo: 한 단계 앞으로
  redo(originator: DocumentOriginator): boolean {
    if (!this.canRedo()) return false;
    this.currentIndex++;
    const m = this.history[this.currentIndex];
    originator.restore(m);
    return true;
  }

  // 디버그용: 히스토리 목록
  showHistory() {
    console.log("History:");
    this.history.forEach((m, idx) => {
      console.log(
        `${idx === this.currentIndex ? "->" : "  "} [${idx}] ${m.getName()}`
      );
    });
  }
}

// ---------- 사용 예시 ----------

const doc = new DocumentOriginator();
const caretaker = new Caretaker();

// 초기 상태 스냅샷
caretaker.backup(doc.createMemento());

doc.write("Hello");
caretaker.backup(doc.createMemento());

doc.write(", world");
caretaker.backup(doc.createMemento());

doc.write("!!!");
caretaker.backup(doc.createMemento());

console.log("현재 문서:", doc.getContent());
// 현재 문서: Hello, world!!!

caretaker.showHistory();

// undo 1
if (caretaker.undo(doc)) {
  console.log("undo ->", doc.getContent()); // Hello, world
}

// undo 2
if (caretaker.undo(doc)) {
  console.log("undo ->", doc.getContent()); // Hello
}

// redo
if (caretaker.redo(doc)) {
  console.log("redo ->", doc.getContent()); // Hello, world
}

// 새 작업을 하면 redo 히스토리는 삭제된다
doc.write(" :)");
caretaker.backup(doc.createMemento());
caretaker.showHistory();

// redo 시도 (불가)
console.log("canRedo?", caretaker.canRedo()); // false
