/*
원래 객체(Subject)에 대한 직접적인 접근을 제한하고, 클라이언트의 요청이 Subject에 전달되기 전 후에 무언가를 수행하게 한다.


[Client]
   ↓
[Proxy] ──▶ [RealSubject]

Client: 요청을 보냄
Proxy: RealSubject와 동일한 인터페이스를 가지며, 요청을 대신 처리하거나 RealSubject에게 전달
RealSubject: 실제 작업을 수행하는 객체
*/

// Subject
interface WeatherAPI {
  getWeather(city: string): string;
}

// Real Subject
class RealWeatherAPI implements WeatherAPI {
  getWeather(city: string): string {
    console.log("외부 API 호출  ");
    return `${city}의 날씨: 맑음`;
  }
}

// Proxy : 캐시를 저장하거나 불러옴.
class WeatherProxy implements WeatherAPI {
  realAPI: RealWeatherAPI;
  private cache = new Map<string, string>();

  constructor(realAPI: RealWeatherAPI) {
    this.realAPI = realAPI;
  }

  getWeather(city: string): string {
    if (!this.cache.has(city)) {
      const result = this.realAPI.getWeather(city);
      this.cache.set(city, result);
    }
    return this.cache.get(city)!;
  }
}

// 사용
const realAPI = new RealWeatherAPI();
const proxy = new WeatherProxy(realAPI);
console.log(proxy.getWeather("Seoul")); // 외부 호출
console.log(proxy.getWeather("Seoul")); // 캐시 응답

/*
외부 API 호출
Seoul의 날씨: 맑음
Seoul의 날씨: 맑음
*/
