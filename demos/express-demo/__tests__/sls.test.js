const request = require("supertest");
const app = require('../sls')

describe('Express server', () => {
  test('path / should get index page', async () => {
    const response = await request(app).get('/');
    expect(response.text).toContain('Serverless Framework')
  })

  test('path /post', async () => {
    const response = await request(app).get('/post');
    expect(response.body).toEqual([
      {
        title: 'serverless framework',
        link: 'https://serverless.com'
      }
    ])
  })

  test('path /post/:id', async () => {
    const response = await request(app).get('/post/1');
    expect(response.body).toEqual({
      id: '1',
      title: 'serverless framework',
      link: 'https://serverless.com'
    })
  })
})