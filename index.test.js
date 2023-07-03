// install dependencies
const { execSync } = require('child_process');
execSync('npm install');
execSync('npm run seed');

const request = require("supertest")
const { db } = require('./db/connection');
const { Musician , Band} = require('./models/index')
const app = require('./src/app');
const {seedMusician, seedBand }= require("./seedData");
const { hasUncaughtExceptionCaptureCallback } = require('process');


describe('./musicians endpoint', () => {

    beforeAll(async () => {
        await db.sync({ force: true });
        await Musician.bulkCreate(seedMusician);
        await Band.bulkCreate(seedBand);
      });
    // Write your tests here
    it('should return musicians', async () =>{
        const response = await request(app).get('/musicians');
        expect(response.statusCode).toBe(200);
        const responseData = JSON.parse(response.text);
        expect(responseData).toBeInstanceOf(Array);
        expect(responseData.length).toBeGreaterThan(0);
    })
})