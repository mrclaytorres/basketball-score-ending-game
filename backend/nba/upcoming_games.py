from fastapi import FastAPI, Query, Depends
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

def consolidate_games(games_data):
    # Consolidate games data
    games = []
    for game in games_data["leagueSchedule"]["gameDates"]:
        for game in game["games"]:
            games.append(game)
    return games

def get_upcoming_games(
    start_date,
    end_date,
    team_abbreviation,
    sort_order,
    page, 
    limit):
    
    # Fetch NBA schedule data and consolidate into one array
    games_data = get_nba_schedule()
    consolidated_games = consolidate_games(games_data)
    
    upcoming_games = []

    for game in consolidated_games:
        game_date = datetime.strptime(game["gameDateEst"], "%Y-%m-%dT%H:%M:%SZ").strftime("%Y-%m-%d")

        # Filter by date range
        if start_date <= game_date <= end_date:
            game_info = {
                "GAME_ID": game["gameId"],
                "GAME_DATE": game_date,
                "GAME_TIME": game["gameTimeEst"],
                "HOME_TEAM_ID": game["homeTeam"]["teamId"],
                "AWAY_TEAM_ID": game["awayTeam"]["teamId"],
                "HOME_TEAM_ABBREVIATION": game["homeTeam"]["teamTricode"],
                "AWAY_TEAM_ABBREVIATION": game["awayTeam"]["teamTricode"],
                "HOME_TEAM_NAME": game["homeTeam"]["teamName"],
                "AWAY_TEAM_NAME": game["awayTeam"]["teamName"],
                "HOME_TEAM_CITY": game["homeTeam"]["teamCity"],
                "AWAY_TEAM_CITY": game["awayTeam"]["teamCity"],
                "HOME_TEAM_SLUG": game["homeTeam"]["teamSlug"],
                "AWAY_TEAM_SLUG": game["awayTeam"]["teamSlug"],
            }

            # Filter by team if provided
            if team_abbreviation and team_abbreviation not in [game_info["HOME_TEAM_ABBREVIATION"], game_info["AWAY_TEAM_ABBREVIATION"]]:
                continue  # Skip this game if the team does not match

            upcoming_games.append(game_info)

    # Sorting
    sort_order = str(sort_order).lower() if sort_order else "asc"
    reverse = (sort_order.lower() == "desc") if sort_order else False
    upcoming_games.sort(key=lambda x: x["GAME_DATE"], reverse=reverse)

    # Pagination
    total_games = len(upcoming_games)
    start_index = (page - 1) * limit
    end_index = start_index + limit
    paginated_games = upcoming_games[start_index:end_index]

    return {
        "total_games": total_games,
        "page": page,
        "limit": limit,
        "total_pages": (total_games // limit) + (1 if total_games % limit > 0 else 0),
        "upcoming_games": paginated_games,
    }
