// 사용처
// 레거시(기존) 코드를 손대지 않고도 새 인터페이스에 맞춰 재활용하고 싶을 때
// 서로 다른 라이브러리나 모듈을 통합해야 할 때
// 클라이언트 코드 변경 없이 시스템을 확장하고 싶을 때

// 핵심 개념
// Target: 클라이언트가 기대하는 인터페이스
// Adaptee: 기존에 존재하지만 인터페이스가 달라 그대로 쓸 수 없는 클래스
// Adapter: Adaptee를 감싸(Target) 인터페이스에 맞춰 변환해 주는 클래스

// 사이트의 예시
// 1) Target 클래스: 둥근 구멍(RoundHole)이 기대하는 기능
interface IRoundPeg {
  getRadius(): number;
}

// 2) Adaptee 클래스: 네모난 못(SquarePeg)
class SquarePeg {
  constructor(private width: number) {} // 한 변의 길이

  public getWidth(): number {
    return this.width;
  }
}

// 3) Adapter 클래스: SquarePeg을 IRoundPeg으로 포장
class SquarePegAdapter implements IRoundPeg {
  constructor(private squarePeg: SquarePeg) {}

  // 둥근 구멍에 맞추기 위해, 대각선 길이의 절반을 반지름으로 사용
  public getRadius(): number {
    return (this.squarePeg.getWidth() * Math.sqrt(2)) / 2;
  }
}

// 4) 클라이언트: 둥근 구멍(RoundHole)
class RoundHole {
  constructor(private radius: number) {}

  public fits(peg: IRoundPeg): boolean {
    return peg.getRadius() <= this.radius;
  }
}

// --- 사용 예시 ---
const hole = new RoundHole(5);

// 1) 둥근 못은 당연히 들어감
const roundPeg: IRoundPeg = { getRadius: () => 5 };
console.log(hole.fits(roundPeg)); // → true

// 2) 네모난 못은 직접 넣을 수 없음
const smallSquare = new SquarePeg(5);
console.log(
  // (smallSquare as any) 는 IRoundPeg이 아니므로 타입 오류
  // hole.fits(smallSquare)
  "직접은 불가, 어댑터 필요"
);

// 3) 어댑터를 사용하면 네모 못도 들어감
const adapter = new SquarePegAdapter(smallSquare);
console.log(hole.fits(adapter));
// → true
// (width=5짜리 네모는 대각선 반이 약 3.54, 반지름 5짜리 구멍에 잘 맞음)

// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------

// 1. Target 인터페이스: 클라이언트가 기대하는 메서드
interface MediaPlayer {
  play(audioType: string, fileName: string): void;
}

// 2. Adaptee 클래스들: 이미 존재하지만 Target과 인터페이스가 다름
class VlcPlayer {
  playVlc(fileName: string): void {
    console.log(`Playing VLC file: ${fileName}`);
  }
}

class Mp4Player {
  playMp4(fileName: string): void {
    console.log(`Playing MP4 file: ${fileName}`);
  }
}


// 3. Adapter 클래스: Target을 구현하면서 Adaptee를 내부 보유
class MediaAdapter implements MediaPlayer {
  private vlc: VlcPlayer;
  private mp4: Mp4Player;

  constructor(audioType: string) {
    if (audioType === "vlc") {
      this.vlc = new VlcPlayer();
    } else if (audioType === "mp4") {
      this.mp4 = new Mp4Player();
    }
  }

  public play(audioType: string, fileName: string): void {
    if (audioType === "vlc") {
      this.vlc.playVlc(fileName);
    } else if (audioType === "mp4") {
      this.mp4.playMp4(fileName);
    } else {
      console.error(`Unsupported format: ${audioType}`);
    }
  }
}

// 사용 예시
const mp4Adapter = new MediaAdapter("mp4");
mp4Adapter.play("mp4", "video.mp4"); // → Playing MP4 file: video.mp4

// 4. Client 클래스: Target 인터페이스만 사용
class AudioPlayer implements MediaPlayer {
  private adapter: MediaAdapter | null = null;

  public play(audioType: string, fileName: string): void {
    if (audioType === "mp3") {
      console.log(`Playing MP3 file: ${fileName}`);
    } else if (audioType === "vlc" || audioType === "mp4") {
      this.adapter = new MediaAdapter(audioType);
      this.adapter.play(audioType, fileName);
    } else {
      console.error(`Invalid media. ${audioType} format not supported`);
    }
  }
}

const player = new AudioPlayer();
player.play("mp3", "song.mp3"); // → Playing MP3 file: song.mp3
player.play("mp4", "video.mp4"); // → Playing MP4 file: video.mp4
player.play("vlc", "movie.vlc"); // → Playing VLC file: movie.vlc
player.play("avi", "clip.avi"); // → Invalid media. avi format not supported
