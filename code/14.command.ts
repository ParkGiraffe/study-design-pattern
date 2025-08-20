// Command 인터페이스
interface Command {
  execute(): void;
  undo(): void;
}

// Receiver: 실제 동작하는 객체
class Light {
  on() {
    console.log("불 켜짐");
  }
  off() {
    console.log(" 불 꺼짐");
  }
}

// ConcreteCommand: 켜기 명령
class LightOnCommand implements Command {
  constructor(private light: Light) {}
  execute() {
    this.light.on();
  }
  undo() {
    this.light.off();
  }
}

// ConcreteCommand: 끄기 명령
class LightOffCommand implements Command {
  constructor(private light: Light) {}
  execute() {
    this.light.off();
  }
  undo() {
    this.light.on();
  }
}

// Invoker: 명령 실행자 (리모컨)
class RemoteControl {
  private history: Command[] = [];

  press(command: Command) {
    command.execute();
    this.history.push(command);
  }

  undo() {
    const cmd = this.history.pop();
    if (cmd) cmd.undo();
    else console.log("명령이 없습니다.");
  }
}

// 사용 예시
const light = new Light();
const remote = new RemoteControl();

const lightOn = new LightOnCommand(light);
const lightOff = new LightOffCommand(light);

remote.press(lightOn); // 불 켜짐
remote.press(lightOff); // 불 꺼짐
remote.undo(); // 불 켜짐 (undo 실행)
remote.undo(); // 불 꺼짐 (undo 실행)
remote.undo(); // 명령이 없습니다.ƒ
