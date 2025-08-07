// Component
interface Coffee {
  cost(): number;
  description(): string;
}

// ConcreteComponent
class BasicCoffee implements Coffee {
  cost() {
    return 3000;
  }

  description() {
    return "기본 커피";
  }
}

// Decorator
class CoffeeDecorator implements Coffee {
  constructor(protected coffee: Coffee) {}

  cost(): number {
    return this.coffee.cost();
  }

  description(): string {
    return this.coffee.description();
  }
}

// ConcreteDecorator
class MilkDecorator extends CoffeeDecorator {
  cost(): number {
    return super.cost() + 500;
  }

  description(): string {
    return super.description() + ", 우유";
  }
}

class SugarDecorator extends CoffeeDecorator {
  cost(): number {
    return super.cost() + 200;
  }

  description(): string {
    return super.description() + ", 설탕";
  }
}

// 사용 예시
let coffee: Coffee = new BasicCoffee();
coffee = new MilkDecorator(coffee); // 기존 데이터를 까지 않고, 위해 부속을 담을 수 있음.
coffee = new SugarDecorator(coffee);

console.log(coffee.description()); // 기본 커피, 우유, 설탕
console.log(coffee.cost()); // 3700




function withAuth<P>(WrappedComponent: React.ComponentType<P>) {
  return function AuthWrapper(props: P) {
    const isLoggedIn = Boolean(localStorage.getItem("token"));
    if (!isLoggedIn) {
      return <div>로그인이 필요합니다.</div>;
    }
    return <WrappedComponent {...props} />;
  };
}

// Page.tsx
function Dashboard() {
  return <div>대시보드</div>;
}

export default withAuth(Dashboard);