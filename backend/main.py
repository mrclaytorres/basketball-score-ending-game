from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from nba.scores import get_nba_scores
from nba.upcoming_games import get_upcoming_games

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/scores")
def read_scores():
    return get_nba_scores()

@app.get("/api/upcoming-games")
def read_upcoming_games():
    return {"games": get_upcoming_games()}