export default function HowToPlay() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-6">How to Play the Basketball Ending Last Digits Game</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-orange-400">1. Understanding the Basics</h3>
          <p className="text-gray-300">
            This game is based on the last digits of both teams’ final scores in a basketball game. The first digit is taken from the winning team’s score, while the second digit is taken from the losing team’s score. If the final score is <span className="font-bold">94-95</span>, the winning combination is <span className="font-bold">5-4</span>. Only the end of regulation score counts—overtime scores do not apply.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-orange-400">2. Placing Your Bet</h3>
          <p className="text-gray-300">
            Select a two-digit number combination (e.g., <span className="font-bold">2-4</span>). Many players choose numbers based on birthdays or lucky numbers. Each combination corresponds to a slot on the Game board (a 10x10 grid with numbers 00-99). Pay the entry fee to claim your chosen slot.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-orange-400">3. Determining the Winner</h3>
          <p className="text-gray-300">
            After the basketball game ends, check the final score. The winning combination is determined by:
          </p>
          <ul className="list-disc list-inside text-gray-300">
            <li><span className="font-bold">First digit:</span> Last digit of the winning team’s score.</li>
            <li><span className="font-bold">Second digit:</span> Last digit of the losing team’s score.</li>
          </ul>
          <p className="text-gray-300 mt-2">
            Example Winning Combinations:
          </p>
          <ul className="list-disc list-inside text-gray-300">
            <li>Final score <span className="font-bold">102-94</span> → Winning combination: <span className="font-bold">2-4</span></li>
            <li>Final score <span className="font-bold">85-100</span> → Winning combination: <span className="font-bold">0-5</span></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-orange-400">4. Prize Distribution</h3>
          <p className="text-gray-300">
            Prizes are often distributed by quarter:
          </p>
          <ul className="list-disc list-inside text-gray-300">
            <li>1st Quarter – Small prize</li>
            <li>2nd Quarter – Small prize</li>
            <li>3rd Quarter – Small prize</li>
            <li>4th Quarter (Final Score) – <span className="font-bold">Largest prize</span></li>
          </ul>
          <p className="text-gray-300 mt-2">If a game has an overtime period, only the regulation final score is considered.</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-orange-400">5. Additional Rules & Considerations</h3>
          <ul className="list-disc list-inside text-gray-300">
            <li>No more placing and withdrawing of bets/slots after the game has started.</li>
            <li>Strictly <span className="font-bold">No Pay No Win</span>.</li>
            <li>If no one has the exact winning combination, the prize is forfeit for that quarter (depending on house rules).</li>
            <li>Players must understand the rules before placing bets to avoid disputes.</li>
          </ul>
          <p className="text-gray-300 mt-5">This game adds an extra layer of excitement to basketball matches, making every final score matter even more!</p>
        </div>
      </div>
    </div>
  );
}