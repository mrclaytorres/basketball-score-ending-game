# This script is used to lock games that are older than 24 hours
# It is run by a cron job every 24 hours
# The cron job is set up in the backend/scripts/lockGames.sh file
# Copy this file somewhere else like ~/lockGames.sh
# Make it executable: chmod +x ~/lockGames.sh
# Edit the crontab: crontab -e
# Add this line to run the script every day at midnight: 0 0 * * * /bin/bash ~/lockGames.sh >> ~/lockGames.log 2>&1

#!/bin/bash
cd /path/to/your/project
/path/to/your/bin/node lockGames.js