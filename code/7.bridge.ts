/*
핵심 키워드
1. 추상화 계층 (Abstraction Layer)
•	Abstraction
	•	클라이언트가 사용하는 인터페이스를 정의
	•	Implementor 를 참조하여 실제 작업을 위임
•	RefinedAbstraction
	•	Abstraction 을 확장한 구체 클래스
	•	추가 기능이나 비즈니스 로직을 구현

예:
	•	Shape (추상화)
	•	Circle, Square (구체 추상화)

⸻

2. 구현 계층 (Implementation Layer)
•	Implementor
	•	추상화가 사용할 메서드 시그니처만 정의
	•	내부 동작 방식은 정의하지 않음
•	ConcreteImplementor
	•	Implementor 를 실제로 구현
	•	플랫폼/API/환경마다 다른 구체 로직을 담음

예:
	•	Renderer (구현자 인터페이스)
	•	SVGRenderer, CanvasRenderer (구체 구현자)


장점
	•	유연성 : 추상화와 구현을 독립적으로 확장 가능
	• 변경에 강함 : 구현체를 추가/교체해도 추상화 계층에는 영향 없음
	•	코드 중복 감소 : 공통 로직은 Abstraction에, 세부 로직은 Implementor에 집중

  

*/

// 1) Implementor: 디바이스가 가져야 할 공통 인터페이스
interface Device {
  isEnabled(): boolean;
  enable(): void;
  disable(): void;
  getVolume(): number;
  setVolume(percent: number): void;
  getChannel(): number;
  setChannel(channel: number): void;
}

// 2) ConcreteImplementor A: TV
class TV implements Device {
  private on = false;
  private volume = 30;
  private channel = 1;

  isEnabled(): boolean {
    return this.on;
  }
  enable(): void {
    this.on = true;
    console.log('TV 전원 ON');
  }
  disable(): void {
    this.on = false;
    console.log('TV 전원 OFF');
  }

  getVolume(): number {
    return this.volume;
  }
  setVolume(percent: number): void {
    this.volume = Math.max(0, Math.min(100, percent));
    console.log(`TV 볼륨: ${this.volume}%`);
  }

  getChannel(): number {
    return this.channel;
  }
  setChannel(channel: number): void {
    this.channel = channel;
    console.log(`TV 채널: ${this.channel}`);
  }
}

// 3) ConcreteImplementor B: Radio
class Radio implements Device {
  private on = false;
  private volume = 50;
  private channel = 101.1; // FM 주파수

  isEnabled(): boolean {
    return this.on;
  }
  enable(): void {
    this.on = true;
    console.log('Radio 전원 ON');
  }
  disable(): void {
    this.on = false;
    console.log('Radio 전원 OFF');
  }

  getVolume(): number {
    return this.volume;
  }
  setVolume(percent: number): void {
    this.volume = Math.max(0, Math.min(100, percent));
    console.log(`Radio 볼륨: ${this.volume}%`);
  }

  getChannel(): number {
    return this.channel;
  }
  setChannel(channel: number): void {
    this.channel = channel;
    console.log(`Radio 주파수: ${this.channel} FM`);
  }
}

// 4) Abstraction: 리모컨
class RemoteControl {
  constructor(protected device: Device) {}

  togglePower(): void {
    if (this.device.isEnabled()) {
      this.device.disable();
    } else {
      this.device.enable();
    }
  }

  volumeUp(): void {
    this.device.setVolume(this.device.getVolume() + 10);
  }
  volumeDown(): void {
    this.device.setVolume(this.device.getVolume() - 10);
  }

  channelUp(): void {
    this.device.setChannel(this.device.getChannel() + 1);
  }
  channelDown(): void {
    this.device.setChannel(this.device.getChannel() - 1);
  }
}

// 5) RefinedAbstraction: 고급 리모컨 (음소거 기능 추가)
class AdvancedRemoteControl extends RemoteControl {
  mute(): void {
    this.device.setVolume(0);
    console.log('음소거 활성화');
  }
}

// 6) 사용 예시
const tv = new TV();
const radio = new Radio();

const basicRemote  = new RemoteControl(tv);
basicRemote.togglePower(); // TV 전원 ON
basicRemote.volumeUp();    // TV 볼륨: 40%
basicRemote.channelUp();   // TV 채널: 2

const advRemote = new AdvancedRemoteControl(radio);
advRemote.togglePower();   // Radio 전원 ON
advRemote.volumeDown();    // Radio 볼륨: 40%
advRemote.mute();          // 음소거 활성화