// 1. AbstractProduct
interface Button {
  render(): void;
}
interface Checkbox {
  check(): void;
}

// 2. ConcreteProduct
class WindowsButton implements Button {
  render() {
    console.log("Windows 버튼 렌더링");
  }
}
class MacButton implements Button {
  render() {
    console.log("Mac 버튼 렌더링");
  }
}
class WindowsCheckbox implements Checkbox {
  check() {
    console.log("Windows 체크박스 선택");
  }
}
class MacCheckbox implements Checkbox {
  check() {
    console.log("Mac 체크박스 선택");
  }
}

// -----------------------------------------------
// 3. AbstractFactory
interface GUIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

// 4. ConcreteFactory
class WindowsFactory implements GUIFactory {
  createButton() {
    return new WindowsButton();
  }
  createCheckbox() {
    return new WindowsCheckbox();
  }
}
class MacFactory implements GUIFactory {
  createButton() {
    return new MacButton();
  }
  createCheckbox() {
    return new MacCheckbox();
  }
}

// -----------------------------------------------
// 5. Client
function renderUI(factory: GUIFactory) {
  const btn = factory.createButton();
  const cb = factory.createCheckbox();
  btn.render();
  cb.check();
}

renderUI(new WindowsFactory());
renderUI(new MacFactory());

export {};
