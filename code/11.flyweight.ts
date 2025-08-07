// 주요 키워드 : 고유한 상태와 공유한 상태
// 공통된 데이터를 공유하여 메모리 낭비를 줄이기

// 공유한 상태
class CharacterStyle {
  constructor(public font: string, public size: number, public color: string) {}

  applyStyle(char: string, x: number, y: number) {
    console.log(
      `Rendering '${char}' at (${x}, ${y}) with style: font=${this.font}, size=${this.size}, color=${this.color}`
    );
  }
}

// 공유한 상태를 관리하는 팩토리
class CharacterStyleFactory {
  private styles: Map<string, CharacterStyle> = new Map();

  getStyle(font: string, size: number, color: string): CharacterStyle {
    const key = `${font}_${size}_${color}`;
    if (!this.styles.has(key)) {
      this.styles.set(key, new CharacterStyle(font, size, color));
    }
    return this.styles.get(key)!;
  }
}

// 고유한 상태
class Character {
  constructor(
    private char: string,
    private x: number,
    private y: number,
    private style: CharacterStyle
  ) {}

  render() {
    this.style.applyStyle(this.char, this.x, this.y);
  }
}

// 적용
const factory = new CharacterStyleFactory();

const style1 = factory.getStyle("Arial", 12, "black");
const style2 = factory.getStyle("Arial", 12, "black"); // 재사용됨
const style3 = factory.getStyle("Verdana", 14, "blue"); // 새로 생성됨

const characters: Character[] = [
  new Character("H", 0, 0, style1),
  new Character("e", 10, 0, style1),
  new Character("l", 20, 0, style1),
  new Character("l", 30, 0, style2), // style1과 동일 객체
  new Character("o", 40, 0, style3), // 다른 스타일
];

characters.forEach((char) => char.render());
/*
Rendering 'H' at (0, 0) with style: font=Arial, size=12, color=black
Rendering 'e' at (10, 0) with style: font=Arial, size=12, color=black
Rendering 'l' at (20, 0) with style: font=Arial, size=12, color=black
Rendering 'l' at (30, 0) with style: font=Arial, size=12, color=black
Rendering 'o' at (40, 0) with style: font=Verdana, size=14, color=blue
*/

/*
style 객체 하나의 메모리 사용량을 약 100 bytes 라고 가정

플라이웨이트 적용 X

문자 수 : 10,000개
style 객체 수 : 10,000개
총 메모리 사용량 : 10,000 × 100 bytes = 약 1MB



플라이웨이트 적용 O

문자 수 : 10,000개
style 객체 수 : 3개
총 메모리 사용량 : 10,000 × 4 bytes + 3 × 100 bytes = 약 40KB

*/

// --------
// 배틀필드 사례

interface Vector3 {
  x: number;
  y: number;
  z: number;
}

class BulletType {
  constructor(
    public mesh: string, // ex) "rifle_bullet.glb"
    public material: string, // ex) "metal"
    public sound: string // ex) "bullet_hit.mp3"
  ) {}

  render(position: Vector3, velocity: Vector3) {
    console.log(`Rendering bullet at ${position} with ${this.mesh}`);
  }
}

class BulletTypeFactory {
  private static types = new Map<string, BulletType>();

  static getBulletType(
    mesh: string,
    material: string,
    sound: string
  ): BulletType {
    const key = `${mesh}_${material}_${sound}`;
    if (!this.types.has(key)) {
      this.types.set(key, new BulletType(mesh, material, sound));
    }
    return this.types.get(key)!;
  }
}

class Bullet {
  constructor(
    private position: Vector3,
    private velocity: Vector3,
    private bulletType: BulletType
  ) {}

  update() {
    this.position = {
      x: this.position.x + this.velocity.x,
      y: this.position.y + this.velocity.y,
      z: this.position.z + this.velocity.z,
    };
    this.bulletType.render(this.position, this.velocity);
  }
}



/*
총알 10,000개
항목                       | 미적용                  | 적용
Bullet 객체 (위치/속도 등) | 약 200KB                | 약 200KB
BulletType 객체            | 10,000개 × 50KB = 500MB | 1개 × 50KB
총합                       | 약 500.2MB              | 약 250KB

*/