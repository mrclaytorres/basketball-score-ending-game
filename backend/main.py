from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from nba.scores import get_nba_scores

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
