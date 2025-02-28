# Basketball Score Ending Game

## Database
For the database, we will be using MongoDB

#### Install Dependencies
`> npm install next-auth bcryptjs mongoose`  

##### Docker
We will be using Docker to run MongoDB  
`> docker run -d -p 27017:27017 --name mongodb mongo`

## Backend
The backend runs on Python with FastAPI to fetch scores using nba_api package.

#### Install Dependencies
`> cd backend`  
`> pip install -r requirements.txt`

#### Run the application
`> uvicorn main:app --reload --host 0.0.0.0 --port 8000`

## Frontend
The frontend uses React with Next.js

#### Install Dependencies
`> npm install`

#### Run the application
`> npm run dev`