# This script is used to lock games that are older than 24 hours
# It is run by a cron job every 24 hours
# The cron job is set up in the backend/scripts/lockGames.sh file

#!/bin/bash
cd /path/to/your/project
/path/to/your/bin/node lockGames.js