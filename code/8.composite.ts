// Leaf와 Composite | 개별과 집합을 하나의 인터페이스로 통일해서, 클라이언트의 입장에서 구분감이 안 느껴지게 사용

/*
	1.	GUI 컴포넌트 트리
	•	버튼, 체크박스 같은 단일 요소(Leaf)와 패널, 윈도우 같은 컨테이너(Composite)를
	•	동일한 render() 또는 draw() 호출로 처리

	2.	파일 시스템(디렉터리 구조)
	•	파일(Leaf)과 폴더(Composite)를
	•	같은 getSize(), delete(), move() API로 다루며
	•	재귀적으로 하위 폴더·파일을 순회

	3.	그래픽 에디터(벡터 드로잉)
	•	선·원·다각형 같은 기본 도형(Leaf)
	•	그룹(group) 기능으로 묶인 도형 세트(Composite)
	•	그룹 전체를 이동·회전·확대/축소할 때 유용




  구현 방법
  1. 앱의 핵심 모델이 트리 구조로 표현될 수 있는지 확인하세요. 그 후 앱을 단순 요소와 컨테이너로 분해하세요. 컨테이너는 다른 컨테이너들과 단순 요소들을 모두 포함할 수 있어야 합니다.
  2. 컴포넌트 인터페이스를 선언하세요. 이 인터페이스 내에는 복잡하고 단순한 컴포넌트 모두에 적합한 메서드들의 리스트를 포함하세요.
  3. 단순 요소들을 나타내는 잎 클래스를 생성하세요. 하나의 프로그램에는 여러 개의 서로 다른 잎 클래스들이 있을 수 있습니다.
  4. 복잡한 요소들을 나타내는 컨테이너 클래스를 만든 후, 이 클래스에 하위 요소들에 대한 참조를 저장하기 위한 배열 필드를 제공하세요. 배열은 잎과 컨테이너를 모두 저장할 수 있어야 하므로 컴포넌트 인터페이스 유형으로 선언하셔야 합니다.
  컴포넌트 인터페이스의 메서드들을 구현하는 동안 컨테이너는 대부분 작업을 하위 요소들에 위임해야 한다는 점을 기억하세요.
  5. 마지막으로 컨테이너에서 자식 요소들을 추가 및 제거하는 메서드들을 정의하세요.
  이러한 작업은 컴포넌트 인터페이스에서 선언할 수 있으나, 그리하면 잎 클래스의 메서드들이 비어 있을 것이므로 인터페이스 분리 원칙을 위반할 것입니다. 그러나 클라이언트는 트리를 구성할 때도 포함해서 모든 요소를 동등하게 처리할 수 있을 것입니다.
*/

// 1) Component
interface Graphic {
  draw(indent?: string): void;
}

// 2) Leaf
class Circle implements Graphic {
  // Ex: 포토샵 단일 도형 레이어
  constructor(private name: string) {}
  draw(indent = ""): void {
    console.log(`${indent}○ Circle: ${this.name}`);
  }
}

// 3) Composite
class CompositeGraphic implements Graphic {
  // Ex: 포토샵 복합 레이어
  private children: Graphic[] = [];

  add(child: Graphic): void {
    this.children.push(child);
  }
  remove(child: Graphic): void {
    this.children = this.children.filter((c) => c !== child);
  }

  draw(indent = ""): void {
    console.log(`${indent}▣ Composite 시작`);
    for (const child of this.children) {
      child.draw(indent + "  ");
    }
    console.log(`${indent}▣ Composite 끝`);
  }
}

// 4) 사용 예시
const circle1 = new Circle("A");
const circle2 = new Circle("B");
const circle3 = new Circle("C");

console.log("========== 단일 도형 레이어 ==========");
circle1.draw();
circle2.draw();

console.log("========== 복합 레이어 ==========");
const graphic = new CompositeGraphic();
graphic.add(circle1);
graphic.add(circle2);

const subGraphic = new CompositeGraphic();
subGraphic.add(circle3);

graphic.add(subGraphic);

// 트리 전체 그리기
graphic.draw();

/*
output:

========== 단일 도형 레이어 ==========
○ Circle: A
○ Circle: B
========== 복합 레이어 ==========
▣ Composite 시작
  ○ Circle: A
  ○ Circle: B
  ▣ Composite 시작
    ○ Circle: C
  ▣ Composite 끝
▣ Composite 끝

*/
