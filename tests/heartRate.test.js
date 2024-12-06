const request = require('supertest');
const express = require('express');
const {sequelize, HeartRate} = require('../models');
const fs = require('fs');
const path = require('path');

const samplePayloadPath = path.join(__dirname, './mockData/clinical_metrics.json');
const heartRateRouter = require('../routes/heartRate');

const app = express();

app.use(express.json());

app.use('/api/heart-rate', heartRateRouter);

function readLargeJSONPayload (filePath) {
    return new Promise((resolve, reject) => {
        let jsonData = '';
        const readStream = fs.createReadStream(filePath, {encoding: 'utf8'});

        readStream.on('data', (chunk) => {
            jsonData += chunk;
        });

        readStream.on('end', () => {
            try{
                resolve(JSON.parse(jsonData));
            } catch(error) {
                reject(error);
            };
        });

        readStream.on('error', (err) => {
            reject(err);
        });
    })
}

beforeAll(async() => {
    await sequelize.sync({force: true});
});

afterAll(async() => {
    await sequelize.close();
});

describe('Heart rate aggregator API', () => {
    it('should process and store heart rate data, then return aggregated results', async() => {
        const samplePayload =await readLargeJSONPayload(samplePayloadPath);
        const response = await request(app).post('/api/heart-rate').send(samplePayload);
        // console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.isSuccess).toBe(true); 
    });
});