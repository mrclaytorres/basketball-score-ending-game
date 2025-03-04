from fastapi import FastAPI, Query
from nba_api.live.nba.endpoints import scoreboard
from datetime import datetime, timedelta
import pprint
from typing import Optional
import requests
import json

app = FastAPI()

# Since nba_api package does not have an endpoint to NBA schedule (Future games), we can call an NBA endpoint for the schedules
def get_nba_schedule():
    url = "https://cdn.nba.com/static/json/staticData/scheduleLeagueV2.json"
    response = requests.get(url)
    return response.json()

@app.get("/upcoming-games")
def get_upcoming_games(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    team_abbreviation: str = None,
    sort_order: Optional[str] = "asc",
    page: int = 1,
    limit: int = 100
):
    today = datetime.today().strftime("%Y-%m-%d")

    # Ensure we are working with strings, not Query objects
    start_date = str(start_date) if start_date is not None else today
    end_date = str(end_date) if end_date is not None else (datetime.today() + timedelta(days=7)).strftime("%Y-%m-%d")

    # Fetch NBA schedule data
    games_data = get_nba_schedule()
    
    upcoming_games = []

    for game in games_data["leagueSchedule"]["gameDates"][0]["games"]:
        game_date = datetime.strptime(game["gameDateEst"], "%Y-%m-%dT%H:%M:%SZ").strftime("%Y-%m-%d")

        print(game["gameId"])
        # print(start_date)
        # print(end_date)

        # Filter by date range
        if start_date <= game_date <= end_date:
            print("Entered")
            game_info = {
                "GAME_ID": game["gameId"],
                "GAME_DATE": game_date,
                "HOME_TEAM_ID": game["homeTeam"]["teamId"],
                "AWAY_TEAM_ID": game["awayTeam"]["teamId"],
                "HOME_TEAM_ABBREVIATION": game["homeTeam"]["teamTricode"],
                "AWAY_TEAM_ABBREVIATION": game["awayTeam"]["teamTricode"],
            }

            # Filter by team if provided
            if team_abbreviation and team_abbreviation not in [game_info["HOME_TEAM_ABBREVIATION"], game_info["AWAY_TEAM_ABBREVIATION"]]:
                continue  # Skip this game if the team does not match

            upcoming_games.append(game_info)

    # Sorting
    reverse = (sort_order.lower() == "desc") if sort_order else False
    upcoming_games.sort(key=lambda x: x["GAME_DATE"], reverse=reverse)

    # Pagination
    total_games = len(upcoming_games)
    start_index = (page - 1) * limit
    end_index = start_index + limit
    paginated_games = upcoming_games[start_index:end_index]

    pprint.pprint({
        "total_games": total_games,
        "page": page,
        "limit": limit,
        "total_pages": (total_games // limit) + (1 if total_games % limit > 0 else 0),
        "upcoming_games": paginated_games,
    })

    return {
        "total_games": total_games,
        "page": page,
        "limit": limit,
        "total_pages": (total_games // limit) + (1 if total_games % limit > 0 else 0),
        "upcoming_games": paginated_games,
    }
