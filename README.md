# NCAA Men's Swimming Championship Selection Simulator

## Overview
This project simulates the NCAA Men's Swimming Championship selection process by retrieving data from SwimCloud, processing it based on NCAA rules, and generating CSV and Excel reports. It demonstrates API integration, data processing, and automation using Node.js. Now refactored into a **modular structure** with improved **error handling** and a **REST API** using Express.

## Features
- Fetches real-time swimming performance data from SwimCloud API
- Simulates NCAA selection process based on "A" and "B" qualifying times
- Generates structured CSV files for different stages of selection
- Aggregates final selection results into an Excel file
- **Now includes a REST API** to retrieve selection data dynamically
- **Deployed to AWS** with API Gateway and Lambda

## Selection Process
The NCAA invites a fixed number of athletes each year:
- **270 Men & 322 Women**, including **35 men's and 41 women's** spots reserved for divers.
- Automatic qualification for swimmers who achieve **"A" cuts**.
- Remaining spots filled using "B" cut times until all slots are allocated evenly across events.
- Final selection prioritizes the closest times to the "A" cut.

## Technology Stack
- **Node.js** for scripting and automation
- **Express.js** for building a REST API
- **Axios** for making REST API calls to SwimCloud
- **FS (File System Module)** for handling CSV file generation
- **ExcelJS** for aggregating CSV data into an Excel spreadsheet
- **Winston** for structured logging
- **AWS Lambda & API Gateway** for cloud deployment

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/ncaa-swim-selection.git
   cd ncaa-swim-selection
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the selection process manually:
   ```bash
   node generate-csvs.js
   ```
   This script fetches top times, processes selection rounds, and saves CSV files.

4. Generate the final Excel report:
   ```bash
   node generate-excel.js
   ```

5. Start the API server:
   ```bash
   npm start
   ```

## API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/top50` | Get top 50 times per event |
| GET | `/api/acuts` | Get all swimmers with "A" cuts |
| GET | `/api/selection-rounds` | Get selection rounds |
| GET | `/api/final-selections` | Get final selected swimmers |

## AWS Deployment
1. **Deploy API to AWS Lambda** using **Serverless Framework**:
   ```bash
   serverless deploy
   ```
2. API Gateway will provide an endpoint like:
   ```
   https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/api/top50
   ```

## Output Files
- `data/top50-by-event.csv` – Top 50 times per event
- `data/a-cuts-by-event.csv` – All swimmers with "A" cuts
- `data/top11-by-event.csv` – Top 11 fastest per event
- `data/selection-by-round.csv` – NCAA selection rounds
- `data/final-235-swimmers.csv` – Final NCAA selections
- `data/ncaa-swim-selection.xlsx` – Aggregated results

## Enhancements & Future Work
- [x] Modularize code for better maintainability
- [x] Add error handling and logging
- [x] Convert project into an Express API
- [x] Deploy selection process to AWS using Lambda & API Gateway
- [ ] Add data visualization with D3.js or Python Matplotlib
- [ ] Build a simple front-end to query API

## Contributions
Contributions are welcome! Feel free to fork the repo and submit a PR.

## License
MIT License

