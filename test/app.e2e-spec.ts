import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('/movies (GET)', () => {
    return request(app.getHttpServer()) // localhost와 같은 값이 아닌 해당 서버 호출
      .get('/movies')
      .expect(200)
      .expect([]);
  });

  describe('/movies', () => {
    it('GET', () => {
      return request(app.getHttpServer()).get('/movies').expect(200).expect([]);
    });
    it('POST', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({ title: 'test1', year: 2000, genres: ['test'] })
        .expect(201);
    });
    it('DELETE', () => {
      return request(app.getHttpServer()).delete('/movies/1').expect(200);
    });
  });

  describe('/movies/:id', () => {
    it('POST', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({ title: 'test1', year: 2000, genres: ['test'] })
        .expect(201);
    });
    it.todo('GET'); // npm 실행하면 >> [✎ todo GET] 로 표시
    it('GET', () => {
      return request(app.getHttpServer())
        .get('/movies/1')
        .expect(200)
        .expect({ id: 1, title: 'test1', year: 2000, genres: ['test'] });
    });

    it('PATCH', () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({ title: 'update Test' })
        .expect(200);
    });

    it('DELETE', () => {
      return request(app.getHttpServer()).delete('/movies/1').expect(200);
    });
  });
});
