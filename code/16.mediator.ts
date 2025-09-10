/*
Mediator 패턴은 여러 객체(동료, colleague)들의 직접적인 상호작용을 제거하고, 대신 중앙 조정자(Mediator) 를 통해 통신하게 해서 객체들 간 결합도를 낮추는 행동 패턴
즉, 서로 직접 objA.send(objB) 하지 않고, objA가 Mediator에게 메시지를 보내면 Mediator가 적절한 대상(들)에게 전달
*/

// ----- 타입/인터페이스 -----
interface Mediator {
  register(user: User): void;
  sendMessage(from: string, to: string | null, message: string): void;
}

abstract class User {
  constructor(public name: string, protected mediator: Mediator) {}
  abstract receive(from: string, message: string): void;

  send(to: string | null, message: string) {
    this.mediator.sendMessage(this.name, to, message);
  }
}

// ----- ConcreteMediator: ChatRoom -----
class ChatRoom implements Mediator {
  private users: Map<string, User> = new Map();

  register(user: User): void {
    this.users.set(user.name, user);
  }

  sendMessage(from: string, to: string | null, message: string): void {
    if (to === null) {
      // broadcast
      for (const [name, user] of this.users) {
        if (name !== from) user.receive(from, message);
      }
    } else {
      // direct message (if recipient exists)
      const recipient = this.users.get(to);
      if (recipient) recipient.receive(from, message);
      else {
        // 선택적으로: 발신자에게 실패 알림
        const sender = this.users.get(from);
        sender?.receive("system", `User "${to}" not found.`);
      }
    }
  }
}

// ----- ConcreteColleague: Concrete User -----
class ConcreteUser extends User {
  receive(from: string, message: string): void {
    console.log(`[${this.name}] ← ${from}: ${message}`);
  }
}

// ----- 사용 예시 -----
const room = new ChatRoom();

const alice = new ConcreteUser("Alice", room);
const bob = new ConcreteUser("Bob", room);
const carol = new ConcreteUser("Carol", room);

room.register(alice);
room.register(bob);
room.register(carol);

alice.send(null, "Hello everyone!"); // broadcast
bob.send("Alice", "Hey Alice, how are you?"); // direct
carol.send("Dan", "Are you there?"); // recipient 없음 -> system 알림
