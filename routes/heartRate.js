const express = require('express');
const {Op} = require('sequelize');
const {HeartRate} = require('../models');
const router = express.Router();

// POST endpoint for processing clinical data
router.post('/', async(req, res) => {
    try{
        const {clinical_data, patient_id} = req.body;

        // validate the request payload details
        if(!clinical_data || !clinical_data.HEART_RATE || !clinical_data.HEART_RATE.data) {
            return res.status(400).json({
                message: 'Invalid payload. Missing required details for Heart rate',
                isSuccess: false
            });
        }

        // Extract and process heart rate data
        const heartRateData = clinical_data.HEART_RATE.data.map((ele) => ({
            patient_id,
            on_date: ele.on_date,
            measurement: parseInt(ele.measurement)
        }));

        // save to database:
        await HeartRate.bulkCreate(heartRateData);

        // aggregate data for 15 min intervals
        const aggregatedData = await aggregateHeartRate(patient_id);

        return res.status(200).json({
            message: 'Data successfully processed!',
            isSuccess: true,
            data: {
                result: aggregatedData
            }
        });
    } catch(error) {
        console.error(`Error occured while 
                processing heart rate data: ${error}`);
        return res.status(500).json({
            message: 'Something went wrong!',
            isSuccess: false,
            error: error.message
        });
    }
});

async function aggregateHeartRate(patient_id) {
    const heartRates = await HeartRate.findAll({
        where: {patient_id},
        attributes: ['on_date', 'measurement'],
        order: [['on_date', 'ASC']]
    });

    const intervals ={};
    heartRates.forEach((ele) => {
        const onDate = new Date(ele.on_date);
        const intervalStart = new Date(
            onDate.getFullYear(),
            onDate.getMonth(),
            onDate.getDate(),
            onDate.getHours(),
            Math.floor(onDate.getMinutes()/15)* 15
        );

        const intervalKey = intervalStart.toISOString();
        if(!intervals[intervalKey]) {
            intervals[intervalKey] = {minHeartRate: ele.measurement, maxHeartRate: ele.measurement};
        } else {
            intervals[intervalKey].minHeartRate = Math.min(intervals[intervalKey].minHeartRate, ele.measurement);
            intervals[intervalKey].maxHeartRate = Math.max(intervals[intervalKey].maxHeartRate, ele.measurement);
        }
    });
    return intervals;

}

module.exports = router;