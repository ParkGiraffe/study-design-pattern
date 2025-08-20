// 요청: 햄버거 주문
class Order {
  public paid: boolean;
  public hasIngredients: boolean;
  public specialRequest: boolean;

  constructor(paid: boolean, hasIngredients: boolean, specialRequest: boolean) {
    this.paid = paid;
    this.hasIngredients = hasIngredients;
    this.specialRequest = specialRequest;
  }
}

// Handler 기본 클래스
abstract class Handler {
  private next?: Handler;

  setNext(next: Handler): Handler {
    this.next = next;
    return next; // 체인 연결용
  }

  handle(order: Order) {
    if (this.next) {
      return this.next.handle(order);
    }
    console.log("✅ 주문이 완료되었습니다!");
  }
}

// 1) 캐셔: 결제 확인
class Cashier extends Handler {
  handle(order: Order) {
    if (!order.paid) {
      console.log("❌ 결제가 필요합니다.");
      return;
    }
    console.log("💰 결제 확인 완료");
    super.handle(order);
  }
}

// 2) 주방: 재료 확인
class Kitchen extends Handler {
  handle(order: Order) {
    if (!order.hasIngredients) {
      console.log("❌ 재료가 부족합니다.");
      return;
    }
    console.log("🍅 재료 준비 완료");
    super.handle(order);
  }
}

// 3) 매니저: 특수 주문 확인
class Manager extends Handler {
  handle(order: Order) {
    if (order.specialRequest) {
      console.log("👨‍💼 매니저가 특수 주문을 확인했습니다.");
    }
    super.handle(order);
  }
}

// -------------------- 실행 --------------------

const cashier = new Cashier();
const kitchen = new Kitchen();
const manager = new Manager();

// 체인 연결: 캐셔 → 주방 → 매니저
cashier.setNext(kitchen).setNext(manager);

// 테스트 1: 정상 주문
console.log("=== 주문 1 ===");
cashier.handle(new Order(true, true, false));

// 테스트 2: 결제 안 됨
console.log("\n=== 주문 2 ===");
cashier.handle(new Order(false, true, false));

// 테스트 3: 재료 없음
console.log("\n=== 주문 3 ===");
cashier.handle(new Order(true, false, false));

// 테스트 4: 특수 주문
console.log("\n=== 주문 4 ===");
cashier.handle(new Order(true, true, true));

/*
=== 주문 1 ===
💰 결제 확인 완료
🍅 재료 준비 완료
✅ 주문이 완료되었습니다!

=== 주문 2 ===
❌ 결제가 필요합니다.

=== 주문 3 ===
💰 결제 확인 완료
❌ 재료가 부족합니다.

=== 주문 4 ===
💰 결제 확인 완료
🍅 재료 준비 완료
👨‍💼 매니저가 특수 주문을 확인했습니다.
✅ 주문이 완료되었습니다!
*/

// -----


// 체인을 타는 과정에서, 하나라도 걸리는 게 있으면 뒤에 걸 무시하고 끊어버리기도 가능.


import { useForm } from "react-hook-form";

type Form = { email: string };

const isRequired = (v: string) =>
  v?.trim() ? true : "❌ 필수 입력입니다";

const hasAt = (v: string) =>
  v.includes("@") ? true : "❌ @가 필요합니다";

const endsWithCom = (v: string) =>
  v.endsWith(".com") ? true : "❌ .com 도메인만 허용";

function composeValidators<T>(...validators: ((v: T) => true | string)[]) {
  return (v: T) => {
    for (const fn of validators) {
      const result = fn(v);
      if (result !== true) return result; // 실패 시 연쇄 중단
    }
    return true; // 모든 검증 통과
  };
}

export default function ChainExample() {
  const { register, handleSubmit, formState: { errors } } = useForm<Form>();

  const onSubmit = (data: Form) => console.log("✅ 최종 데이터:", data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("email", {
          validate: composeValidators(isRequired, hasAt, endsWithCom)
        })}
        placeholder="email@example.com"
      />
      {errors.email && <p>{errors.email.message}</p>}
      <button>제출</button>
    </form>
  );
}

/*
	1.	isRequired 검사 → 실패 시 "필수 입력" 에러로 체인 중단
	2.	통과하면 hasAt 검사 → 실패 시 "@ 필요" 반환
	3.	또 통과하면 endsWithCom 검사 → 실패 시 ".com 필요" 반환
	4.	모두 통과하면 성공, onSubmit 단계로 넘어감
*/