// 클라이언트로부터 Product 클래스에 여러 개의 (필요 없을 가능성이 높은) 인자를 받는 방식을 피하기 위해서
// 빌더 패턴을 사용한다.

// Product: 최종 생성될 객체
class Pizza {
  constructor(
    private size: "small" | "medium" | "large",
    private cheese: boolean,
    private pepperoni: boolean,
    private bacon: boolean
  ) {}

  public describe(): string {
    const toppings = [
      this.cheese ? "치즈" : null,
      this.pepperoni ? "페퍼로니" : null,
      this.bacon ? "베이컨" : null,
    ]
      .filter(Boolean)
      .join(", ");

    return `${this.size} 사이즈 피자에 토핑: ${toppings || "기본"} 입니다.`;
  }
}

// Builder 인터페이스 : 모든 빌더가 구현해야 할 메서드 정의 || 생성 단계를 정의
interface IPizzaBuilder {
  setSize(size: "small" | "medium" | "large"): this;
  addCheese(): this;
  addPepperoni(): this;
  addBacon(): this;
  build(): Pizza;
}

// Concrete Builder 클래스 : Builder 인터페이스에서 정의된 단계들을 구현하여 제품 생성
class PizzaBuilder implements IPizzaBuilder {
  private size: "small" | "medium" | "large" = "medium";
  private cheese = false;
  private pepperoni = false;
  private bacon = false;

  public setSize(size: "small" | "medium" | "large"): this {
    this.size = size;
    return this;
  }

  public addCheese(): this {
    this.cheese = true;
    return this;
  }

  public addPepperoni(): this {
    this.pepperoni = true;
    return this;
  }

  public addBacon(): this {
    this.bacon = true;
    return this;
  }

  public build(): Pizza {
    return new Pizza(this.size, this.cheese, this.pepperoni, this.bacon);
  }
}

// Director 클래스: 빌더를 이용해 표준 레시피로 객체 생성 || 건설 순서를 빌더에 안내 (빌더의 속성들을 지정)
class Director {
  constructor(private builder: IPizzaBuilder) {}

  // 마르게리타 피자 표준 조립
  public makeMargherita(): Pizza {
    return this.builder.setSize("medium").addCheese().build();
  }

  // 페퍼로니 피자 표준 조립
  public makePepperoni(): Pizza {
    return this.builder.setSize("large").addCheese().addPepperoni().build();
  }

  // 미트 피자 표준 조립
  public makeMeat(): Pizza {
    return this.builder
      .setSize("large")
      .addCheese()
      .addPepperoni()
      .addBacon()
      .build();
  }
}

// Client: Director와 Builder를 사용하여 피자 생성
const builder = new PizzaBuilder();
const director = new Director(builder);

const margherita = director.makeMargherita(); // Pizza('medium', true, false, false, false)
console.log(margherita.describe());
// → medium 사이즈 피자에 토핑: 치즈 입니다.

const pepperoni = director.makePepperoni();
console.log(pepperoni.describe());
// → large 사이즈 피자에 토핑: 치즈, 페퍼로니 입니다.

const meat = director.makeMeat();
console.log(meat.describe());
// → large 사이즈 피자에 토핑: 치즈, 페퍼로니, 베이컨 입니다.
