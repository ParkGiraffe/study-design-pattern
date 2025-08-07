// 복잡한 서브 시스템
class WaterHeater {
  boilWater() {
    console.log("물을 끓이는 중...");
  }
}

class Grinder {
  grindBeans() {
    console.log("원두를 가는 중...");
  }
}

class Brewer {
  brew() {
    console.log("커피를 내리는 중...");
  }
}

class MilkDispenser {
  addMilk() {
    console.log("우유를 추가하는 중...");
  }
}

// Facade 클래스를 묶어주는 클래스.
class CoffeeMachine {
  private heater = new WaterHeater();
  private grinder = new Grinder();
  private brewer = new Brewer();
  private milkDispenser = new MilkDispenser();

  makeCoffee(coffeeType?: string) {
    if (coffeeType === "latte") {
      this.milkDispenser.addMilk();
    }
    this.heater.boilWater();
    this.grinder.grindBeans();
    this.brewer.brew();
    console.log("☕ 커피 완성!");
  }
}

// 클라이언트
const machine = new CoffeeMachine();
machine.makeCoffee();
machine.makeCoffee("latte");

// 출력:
// 물을 끓이는 중...
// 원두를 가는 중...
// 커피를 내리는 중...
// ☕ 커피 완성!

// 물을 끓이는 중...
// 원두를 가는 중...
// 커피를 내리는 중...
// 우유를 추가하는 중...
// ☕ 커피 완성!
