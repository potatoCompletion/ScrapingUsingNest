import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JSDOM } from 'jsdom';
import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  getMain(): string {
    return `<head>
  <meta charset="UTF-8">
  <title>Title</title>
</head>
<body>
  <button onclick="location.href='/scraping';">start</button>
  <br><br>
  <label id="loginLabel">조회 전</label>
  <br><br>
</body>
</html>`;
  }

  async scraping() {
    const jar = new CookieJar();
    const client = wrapper(
      axios.create({
        jar,
        timeout: 10000,
      }),
    );

    const reData = await client.post('url', 'data');

    const document = new JSDOM(reData.data).window.document;

    const ts = document.querySelector('input[name=ts]').getAttribute('value');

    await client.post('url', ts + 'someData');

    return `<html lang="ko">
  <head>
    <title>스크래핑 결과</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">메인화면</a></h1>
    ${reData.data}
  </body>
  </html>`;
  }
}
