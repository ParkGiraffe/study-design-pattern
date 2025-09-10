/*
Iterator 패턴은 컬렉션의 내부 표현을 노출하지 않고, 컬렉션 요소들에 순차적으로 접근하는 방법을 제공하는 패턴
즉, “어떻게 순회할지” 를 컬렉션 밖으로 뺀 뒤, 일관된 인터페이스로 요소를 꺼내도록 만든다
*/

/*
구성요소
	1.	Iterator (인터페이스) — next() 등 순회 관련 메서드 정의
	2.	ConcreteIterator — Iterator 인터페이스 구현, 현재 위치 등 상태 보유
	3.	Aggregate / Collection — 요소를 보유하는 객체, createIterator() 제공
	4.	ConcreteAggregate — 실제 컬렉션 구현
*/

/*
언제 쓰나?
	•	컬렉션 내부 구조(배열, 링크드리스트, 트리 등)를 감추고 싶을 때
	•	여러 방식의 순회(앞→뒤, 뒤→앞, 조건부 등)를 제공해야 할 때
	•	동시에 여러 순회가 필요할 때 (각 iterator가 자신의 상태를 가짐)
	•	클라이언트 코드에서 for ... of 같은 통일된 반복 구문을 쓰고 싶을 때
*/

// ----- 타입 및 인터페이스 -----
interface Profile {
  id: string;
  name: string;
  email: string;
}

interface ProfileIterator {
  getNext(): Profile | undefined;
  hasMore(): boolean;
}

interface SocialNetwork {
  createFriendsIterator(profileId: string): ProfileIterator;
  createCoworkersIterator(profileId: string): ProfileIterator;
}

// ----- Facebook 구현 (컬렉션) -----
class Facebook implements SocialNetwork {
  // 간단한 인메모리 그래프: profileId -> { friends: [ids], coworkers: [ids] }
  private socialGraph: Record<
    string,
    { friends: string[]; coworkers: string[] }
  > = {};
  private profiles: Record<string, Profile> = {};

  constructor(
    profiles: Profile[] = [],
    graph: Record<string, { friends: string[]; coworkers: string[] }> = {}
  ) {
    for (const p of profiles) this.profiles[p.id] = p;
    this.socialGraph = graph;
  }

  // 컬렉션(=소셜그래프)에서 실제로 프로필 리스트를 가져오는 메서드
  socialGraphRequest(
    profileId: string,
    type: "friends" | "coworkers"
  ): Profile[] {
    const ids = this.socialGraph[profileId]?.[type] ?? [];
    return ids.map((id) => this.profiles[id]).filter((p): p is Profile => !!p);
  }

  createFriendsIterator(profileId: string): ProfileIterator {
    return new FacebookIterator(this, profileId, "friends");
  }
  createCoworkersIterator(profileId: string): ProfileIterator {
    return new FacebookIterator(this, profileId, "coworkers");
  }
}

// ----- FacebookIterator (구상 반복자) -----
class FacebookIterator implements ProfileIterator {
  private currentPosition = 0;
  private cache: Profile[] | null = null;

  constructor(
    private facebook: Facebook,
    private profileId: string,
    private type: "friends" | "coworkers"
  ) {}

  private lazyInit() {
    if (this.cache === null) {
      // 실제 네트워크 요청 대신 Facebook.socialGraphRequest 사용
      this.cache = this.facebook.socialGraphRequest(this.profileId, this.type);
    }
  }

  getNext(): Profile | undefined {
    if (!this.hasMore()) return undefined;
    const result = this.cache![this.currentPosition];
    this.currentPosition++;
    return result;
  }

  hasMore(): boolean {
    this.lazyInit();
    return this.cache !== null && this.currentPosition < this.cache.length;
  }
}

// ----- SocialSpammer (클라이언트) -----
class SocialSpammer {
  send(iterator: ProfileIterator, message: string) {
    while (iterator.hasMore()) {
      const profile = iterator.getNext();
      if (profile) {
        System.sendEmail(profile.email, message);
      }
    }
  }
}

// 간단한 System 유틸(실제 메일 전송 대신 콘솔 출력)
const System = {
  sendEmail(email: string, message: string) {
    console.log(`Sending email to ${email}: ${message}`);
  },
};

// ----- Application (앱 설정 및 사용 예) -----
class Application {
  constructor(
    private network: SocialNetwork,
    private spammer = new SocialSpammer()
  ) {}

  sendSpamToFriends(profile: Profile) {
    const iterator = this.network.createFriendsIterator(profile.id);
    this.spammer.send(iterator, "Very important message");
    ㄴ;
  }

  sendSpamToCoworkers(profile: Profile) {
    const iterator = this.network.createCoworkersIterator(profile.id);
    this.spammer.send(iterator, "Very important message");
  }
}

// ----- 사용 예시 -----
const profiles: Profile[] = [
  { id: "1", name: "Alice", email: "alice@example.com" },
  { id: "2", name: "Bob", email: "bob@example.com" },
  { id: "3", name: "Carol", email: "carol@example.com" },
];

const graph = {
  "1": { friends: ["2", "3"], coworkers: ["3"] },
  "2": { friends: ["1"], coworkers: [] },
  "3": { friends: ["1"], coworkers: ["1"] },
};

const fb = new Facebook(profiles, graph);
const app = new Application(fb);

// Alice의 친구들에게 스팸 전송
app.sendSpamToFriends(profiles[0]);
// Alice의 동료들에게 스팸 전송
app.sendSpamToCoworkers(profiles[0]);
