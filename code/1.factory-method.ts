// Product
interface Button {
  render(): void;
}

// ConcreteProduct
class WindowsButton implements Button {
  render() {
    console.log("Windows 스타일 버튼 렌더링");
  }
}
class MacButton implements Button {
  render() {
    console.log("Mac 스타일 버튼 렌더링");
  }
}

// -----------------------------------------------
// Creator
abstract class Dialog {
  // 팩토리 메서드
  abstract createButton(): Button;

  renderWindow() {
    const btn = this.createButton();
    btn.render();
  }
}

// ConcreteCreator
class WindowsDialog extends Dialog {
  createButton(): Button {
    return new WindowsButton();
  }
}
class MacDialog extends Dialog {
  createButton(): Button {
    return new MacButton();
  }
}

// -----------------------------------------------
// 클라이언트
function clientCode(dialog: Dialog) {
  dialog.renderWindow();
}

clientCode(new WindowsDialog()); // Windows 스타일 버튼 렌더링
clientCode(new MacDialog()); // Mac 스타일 버튼 렌더링

// -----------------------------------------------
// Concreate Class는 내부 State를 가질 수 있다.
// Class 답게 생성자도 가진다.
class DarkButton implements Button {
  constructor(private theme: string) {}
  render() {
    console.log(`🔥 ${this.theme} DarkButton 렌더링`);
  }
}

class LightButton implements Button {
  constructor(private theme: string) {}
  render() {
    console.log(`🌟 ${this.theme} LightButton 렌더링`);
  }
}

class TextButton implements Button {
  private label: string;
  constructor(theme: string) {
    this.label = `${theme.toUpperCase()}용 버튼`;
  }
  render() {
    console.log(`👉 렌더링: ${this.label}`);
  }
}

class ThemedDialog extends Dialog {
  private theme: string; // 테마 상태
  private createdCount = 0; // 생성 횟수 상태

  constructor(theme: string) {
    super();
    this.theme = theme;
  }

  createButton(): Button {
    this.createdCount++;
    console.log(`[${this.theme}] 버튼 생성 횟수: ${this.createdCount}`);
    // 테마에 따라 다른 ConcreteProduct 생성
    return this.theme === "dark"
      ? new DarkButton(this.theme)
      : new LightButton(this.theme);
  }
}

export {};
