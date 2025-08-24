import request from 'supertest'
import app from '../../src/main'

describe('Auth', () => {
    it('should return 200 when signup', async () => {
        const response = await request(app)
            .post('/sign-up/email')
            .send({
                name: 'John Doe',
                email: 'test@me.com',
                role: 'artist',
                password: 'Password123!',
            })
            .set('Accept', 'application/json')

        expect(response.headers['Content-Type']).toMatch(/json/)
        expect(response.status).toEqual(200)
    })
})
