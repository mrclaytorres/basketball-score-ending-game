from nba_api.live.nba.endpoints import scoreboard
import pprint

def get_nba_scores():
    games = scoreboard.ScoreBoard().games.get_dict()
    scores = []

    for game in games:
        
        gameStatusText = game['gameStatusText']
        teamA = game['awayTeam']['teamName']
        teamB = game['homeTeam']['teamName']
        teamATriCode = game['awayTeam']['teamTricode']
        teamBTriCode = game['homeTeam']['teamTricode']
        homeTeamPeriods = game['homeTeam']['periods']
        awayTeamPeriods = game['awayTeam']['periods']

        q1scoreAway = game['awayTeam']['periods'][0]['score']
        q1scoreHome = game['homeTeam']['periods'][0]['score']
        q2scoreAway = game['awayTeam']['periods'][1]['score'] + q1scoreAway
        q2scoreHome = game['homeTeam']['periods'][1]['score'] + q1scoreHome
        q3scoreAway = game['awayTeam']['periods'][2]['score'] + q2scoreAway
        q3scoreHome = game['homeTeam']['periods'][2]['score'] + q2scoreHome
        q4scoreAway = game['awayTeam']['periods'][3]['score'] + q3scoreAway
        q4scoreHome = game['homeTeam']['periods'][3]['score'] + q3scoreHome

        # q1 = f"{max(game['awayTeam']['periods'][0]['score'], game['homeTeam']['periods'][0]['score'])} - {min(game['awayTeam']['periods'][0]['score'], game['homeTeam']['periods'][0]['score'])}"
        # q2 = f"{max(q2scoreAway, q2scoreHome)} - {min(q2scoreAway, q2scoreHome)}"
        # q3 = f"{max(q3scoreAway, q3scoreHome)} - {min(q3scoreAway, q3scoreHome)}"
        # q4 = f"{max(q4scoreAway, q4scoreHome)} - {min(q4scoreAway, q4scoreHome)}"
        
        q1 = {"teamA": {game['awayTeam']['periods'][0]['score']}, "teamB": {game['homeTeam']['periods'][0]['score']}}
        q2 = {"teamA": {q2scoreAway}, "teamB": {q2scoreHome}}
        q3 = {"teamA": {q3scoreAway}, "teamB": {q3scoreHome}}
        q4 = {"teamA": {q4scoreAway}, "teamB": {q4scoreHome}}

        scores.append({
            'id': game['gameId'],
            'gameStatusText': gameStatusText,
            'teamA': teamA,
            'teamB': teamB,
            'teamAPeriods': awayTeamPeriods,
            'teamBPeriods': homeTeamPeriods,
            'teamATriCode': teamATriCode,
            'teamBTriCode': teamBTriCode,
            'q1': q1,
            'q2': q2,
            'q3': q3,
            'q4': q4
        })

        pprint.pprint(scores)

    return scores
