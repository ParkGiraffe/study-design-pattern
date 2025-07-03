// 1. Prototype 인터페이스: clone 메서드를 정의
interface IPrototype<T> {
  clone(): T;
}

// 2. Concrete Prototype 클래스: 실제 복제 대상
class Shape implements IPrototype<Shape> {
  constructor(
    public id: string,
    public x: number,
    public y: number,
    public metadata: { [key: string]: any } = {}
  ) {}

  public clone(): Shape {
    return new Shape(this.id, this.x, this.y, this.metadata);
  }

  public describe(): string {
    return `Shape[${this.id}]: (${this.x}, ${
      this.y
    }), metadata=${JSON.stringify(this.metadata)}`;
  }
}

// 3. Client: Prototype 레지스트리에서 복제하여 사용 <- 다양한 방식으로 미리 설정된 객체들을 찍어내기가 가능. 자식 클래스를 여러 개 만들어서 인스턴스를 찍어낼 필요 X
class ShapeManager {
  private prototypes: Map<string, Shape> = new Map();

  // 원본 등록
  public registerPrototype(shape: Shape): void {
    this.prototypes.set(shape.id, shape);
  }

  // id로 복제본 생성
  public createClone(id: string): Shape | null {
    const proto = this.prototypes.get(id);
    if (!proto) return null;

    const cloned = proto.clone();
    // 복제본에 새로운 id 부여 (optional)
    cloned.id = `${proto.id}_clone`;
    return cloned;
  }
}

// 사용 예시
const manager = new ShapeManager();

// 원본 객체 생성 및 등록
const circle = new Shape("1", 10, 20, { color: "red", radius: 5 });
const rect = new Shape("2", 30, 40, {
  color: "blue",
  width: 100,
  height: 50,
});

manager.registerPrototype(circle);
manager.registerPrototype(rect);

// 복제본 생성
const circleClone = manager.createClone("1");
if (circleClone) {
  // 복제 후 속성 변경해도 원본에는 영향 없음
  circleClone.x = 99;
  circleClone.metadata.color = "green";
  console.log("복제본", circleClone.describe());
  console.log("원본", circle.describe());
  // → Shape[1] : (99, 20), metadata={"color":"green","radius":5}
}

const rectClone = manager.createClone("2");
if (rectClone) {
  console.log("복제본", rectClone.describe());
  console.log("원본", rect.describe());
  // → Shape[2] : (30, 40), metadata={"color":"blue","width":100,"height":50}
}

// -------------------------------------------
// 예외 상황 : 순환 참조가 있는 복잡한 객체들을 복제하는 것은 매우 까다로울 수 있습니다.

// 1) Prototype 인터페이스
interface IPrototype<T> {
  clone(): T;
}

// 2) 순환 참조를 가진 CNode 클래스
class CNode implements IPrototype<CNode> {
  constructor(
    public name: string,
    public parent: CNode | null = null,
    public children: CNode[] = []
  ) {}

  // 깊은 복사 시도: 반복문 + 재귀
  public clone(): CNode {
    // 새 인스턴스 생성
    const copy = new CNode(this.name);
    // 부모 복제
    if (this.parent) {
      copy.parent = this.parent.clone(); // ← 재귀 복제
    }
    // 자식들 복제
    copy.children = this.children.map((child) => child.clone()); // ← 재귀 복제
    return copy;
  }
}

// 3) 순환 구조 생성
const root = new CNode("root");
const child = new CNode("child", root);
root.children.push(child);
// root ↔ child 간에 순환 참조가 형성됨

// 4) 복제 시도
try {
  const rootClone = root.clone();
  console.log("복제 성공:", rootClone);
} catch (err) {
  console.error("오류 발생:", err);
}

// -> 오류 발생: RangeError: Maximum call stack size exceeded
// 이 객체가 이미 복제 중인지를 검사하지 않아서 무한루프 발생.


// 해결책

/*

public clone(map = new WeakMap<Node, Node>()): Node {
  // 이미 복제된 노드라면 재사용
  if (map.has(this)) return map.get(this)!;

  const copy = new Node(this.name);
  map.set(this, copy);

  if (this.parent) {
    copy.parent = this.parent.clone(map);
  }
  copy.children = this.children.map(child => child.clone(map));

  return copy;
}

 */ 

// WeekMap을 비롯한, 메모이제이션 사용하기