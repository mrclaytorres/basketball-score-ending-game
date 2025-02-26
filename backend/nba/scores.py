from nba_api.live.nba.endpoints import scoreboard
import pprint

def get_nba_scores():
    games = scoreboard.ScoreBoard().games.get_dict()
    scores = []

    for game in games:
        
        teamA = game['awayTeam']['teamName']
        teamB = game['homeTeam']['teamName']

        q1 = f"{max(game['awayTeam']['periods'][0]['score'], game['homeTeam']['periods'][0]['score'])} - {min(game['awayTeam']['periods'][0]['score'], game['homeTeam']['periods'][0]['score'])}"
        q2 = f"{max(game['awayTeam']['periods'][1]['score'], game['homeTeam']['periods'][1]['score'])} - {min(game['awayTeam']['periods'][1]['score'], game['homeTeam']['periods'][1]['score'])}"
        q3 = f"{max(game['awayTeam']['periods'][2]['score'], game['homeTeam']['periods'][2]['score'])} - {min(game['awayTeam']['periods'][2]['score'], game['homeTeam']['periods'][2]['score'])}"
        q4 = f"{max(game['awayTeam']['periods'][3]['score'], game['homeTeam']['periods'][3]['score'])} - {min(game['awayTeam']['periods'][3]['score'], game['homeTeam']['periods'][3]['score'])}"
        
        scores.append({
            'teamA': teamA,
            'teamB': teamB,
            'q1': q1,
            'q2': q2,
            'q3': q3,
            'q4': q4
        })

    return scores
