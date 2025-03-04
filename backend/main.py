from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from nba.scores import get_nba_scores
from nba.upcoming_games import get_upcoming_games
from typing import Optional

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
async def read_upcoming_games(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    team_abbreviation: Optional[str] = Query(None),
    sort_order: str = Query("asc"),
    page: int = Query(1),
    limit: int = Query(10)
):
    print(f"Received params: start_date={start_date}, end_date={end_date}, team={team_abbreviation}, sort={sort_order}, page={page}, limit={limit}")
    
    result = get_upcoming_games(start_date, end_date, team_abbreviation, sort_order, page, limit)
    print(f"Result: {result}")
    
    return {"games": result}