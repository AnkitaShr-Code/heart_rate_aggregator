# Heart Rate Aggregation API

## Description
This API processes and stores clinical data, particularly heart rate data, and aggregates the values in 15-minute intervals. 

## Prerequisites
1.	Node.js: Ensure Node.js is installed on your machine.
2.	npm: Comes bundled with Node.js.
3.	SQLite: The project uses SQLite for simplicity. No separate installation is required


## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AnkitaShr-Code/heart_rate_aggregator.git
2.	Navigate to the project directory: 
   ```bash
  	cd heart_rate_aggregator
4.	Install dependencies: 
   ```bash
   npm install
5.	Configure the Database
    o	Open config/config.json to configure the database connection if needed.
    o	By default, SQLite is configured: 
    o	{
    o	  "development": {
    o	    "dialect": "sqlite",
    o	    "storage": ":memory:"
    o	  }
    o	}
6.	Run Database Migrations
   ```bash
   npx sequelize-cli db:migrate
7.	Start the Server
   ```bash
   npm start
8. To run test:
   ```bash
   npm test

Usage
1.	Start the server: 
   ```bash
   npm start
2.	Send a POST request to http://localhost:3000/api/heart-rate with the payload.
   Sample payload can be found in tests/mockData
3. Response Format
{
    "success": true,
    "message": "Data processed successfully",
    "data": {
        "<interval>": {
            "minHeartRate": <min>,
            "maxHeartRate": <max>
        }
    }
}

