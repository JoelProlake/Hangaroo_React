/* 

Components required

1. Wrong mark square (4)
2. Alphabet (26)
3. Title Bar (1)
4. Answer squares (4x14)

- Should create You Win Component
- Implement handleWin function. 

*/
import { useEffect, useState, useCallback } from "react";

export default function Hangaroo() {
  const [isWrong, setIsWrong] = useState([false, false, false, false]);
  const [wrongAnimations, setWrongAnimations] = useState([false, false, false, false]);
  const [isPlay, setIsplay] = useState(false);
  const [arrangedArr, setArrangedArr] = useState([]);
  const [str, setStr] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [winCount, setWinCount] = useState(0);
  const [strAlphabets, setStrAlphabets] = useState();
  const [isBlinking, setIsBlinking] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);

  const allChars = Array.from({ length: 128 }, (_, i) => String.fromCharCode(i));
  let dispLetters = allChars.filter(
    ch => !(/[a-zA-Z]/.test(ch)) && /[\x21-\x7E]/.test(ch)
  );
  const [displayingLetters, setDisplayingLetters] = useState(dispLetters);

  // const letters = Array.from({ length: 26 }, (_, i) =>
  //   String.fromCharCode(65 + i));

  let letterMap = {};
  for (let i = 65; i <= 90; i++) {
    letterMap[String.fromCharCode(i)] = false;
  }
  const [alphabets, setAlphabets] = useState(letterMap);

  // Keyboard event handler
  const handleKeyPress = useCallback((event) => {
    const key = event.key.toUpperCase();

    // Only allow A-Z keys, prevent all other keys
    if (key.length === 1 && key >= 'A' && key <= 'Z') {
      // Prevent default behavior for all keys
      event.preventDefault();

      // Only process if game is active, button not disabled, and not showing win modal
      if (!alphabets[key] && isPlay && !isGameOver && !showWinModal) {
        handleLetterClick(key);
      }
    } else {
      // Prevent any non A-Z key from doing anything
      event.preventDefault();
    }
  }, [alphabets, isPlay, isGameOver, showWinModal]);

  // Add keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);


  // let string;


  useEffect(() => {
    const arrangedArrFromFunc = arrangeWords(str);
    setArrangedArr(arrangedArrFromFunc)
  }, [str]);

  // useEffect(() => {
  //   console.log("Answer Displayed");
  // }, [displayingLetters]);

  // useEffect(() => {
  //   if (!isWrong.includes(false)) {
  //     gameOver();
  //   }
  // }, [isWrong]);
  


  // Wrong Mark Square Component
  function WrongMarkSquare({ isWrong, shouldAnimate }) {
    return (
      <div className={`w-20 h-20 rounded-2xl relative overflow-hidden border-3 shadow-2xl transition-all duration-500 transform ${
        isWrong
          ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-800 border-red-300 scale-110'
          : 'bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-700 border-purple-400 hover:scale-105'
      }`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`text-5xl font-black transition-all duration-500 ${
            isWrong ? "text-yellow-200 drop-shadow-2xl animate-pulse" : "text-purple-200"
          } ${shouldAnimate && isWrong ? "wrong-mark-enter" : ""}`}>
            ✗
          </div>
        </div>
        {isWrong && (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent animate-ping"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      </div>
    );
  }

  // Win Count Indicator Component
  function WinCountIndicator({ winCount }) {
    const buttons = Array.from({ length: 10 }, (_, i) => i + 1);

    return (
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-3 h-18 w-28 border-2 border-green-300 shadow-lg">
        <div className="grid grid-cols-5 gap-1.5 mt-1">
          {buttons.slice(0, 5).map((buttonNum) => (
            <div
              key={buttonNum}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                buttonNum <= winCount
                  ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-sm bulged-shadow-inset win-glow'
                  : 'bg-gradient-to-br from-green-700 to-green-800 sunked-shadow-inset'
              }`}
            />
          ))}
        </div>
        <div className="grid grid-cols-5 gap-1.5 mt-1">
          {buttons.slice(5, 10).map((buttonNum) => (
            <div
              key={buttonNum}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                buttonNum <= winCount
                  ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-sm bulged-shadow-inset win-glow'
                  : 'bg-gradient-to-br from-green-700 to-green-800 sunked-shadow-inset'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Alphabet Square Component
  function AlphabetSquare({ alphabet, isClicked }) {
    return (
      <button
        onClick={() => handleLetterClick(alphabet)}
        disabled={isClicked}
        className={`w-14 h-14 rounded-xl text-xl font-black border-2 items-center button-disabled-transition hover:scale-105 active:scale-95 transition-all duration-200 shadow-md ${
          isClicked
            ? 'bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 text-purple-200 border-purple-300 cursor-not-allowed opacity-60'
            : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-blue-300 hover:from-blue-400 hover:to-purple-500 shadow-lg'
        }`}
        style={{
          flexBasis: 'calc(7.69% - 8px)' // 13 buttons per row with gaps
        }}
      >
        {alphabet}
      </button>
    );
  }

  // Answer Squares component (4 x 14 = 56)
  function AnswerSquare({answer}) {
    return (
      <div className={`w-11 h-11 rounded-lg text-xl font-black flex items-center justify-center answer-fill-transition border-2 transition-all duration-300 ${
        answer
          ? 'bg-gradient-to-br from-emerald-400 to-green-500 border-green-300 text-yellow-100 shadow-lg bulged-shadow-inset drop-shadow-lg'
          : 'bg-gradient-to-br from-white/20 to-white/10 border-white/30 text-white/60 sunked-shadow-inset'
      } ${isBlinking && answer ? 'answer-squares-blink' : ''}`}>
        {displayingLetters.includes(answer) && answer}
      </div>
    );
  }

  // #### Handle Letter Click function #### //
  function handleLetterClick(letter) {
    setAlphabets(prev => ({ ...prev, [letter]: true }));
    // alphabets[letter] = true;
    if (str.toUpperCase().includes(letter)) {
      handleLetterDisplay(letter);
    } else {
      handleWrongGuess();
    }
  }

  // #### Handle Wrong Guess #### //
  function handleWrongGuess() {
    const index = isWrong.indexOf(false);
    if (index !== -1) {
      const newIsWrong = [...isWrong];
      const newWrongAnimations = [...wrongAnimations];
      newIsWrong[index] = true;
      newWrongAnimations[index] = true;
      setIsWrong(newIsWrong);
      setWrongAnimations(newWrongAnimations);

      // Reset animation state after animation completes (2 seconds)
      setTimeout(() => {
        setWrongAnimations(prev => {
          const updated = [...prev];
          updated[index] = false;
          return updated;
        });
      }, 2000);

      if (!newIsWrong.includes(false)){
        setTimeout(() => gameOver(), 2000); // Wait for animation to complete
      }
    }
    else {
      gameOver();
    }
  }

  // #### Displays alphabets if clicked alphabets are correct #### //
  function handleLetterDisplay(letter) {
    // dispLetters.push(letter);
    const updatedDisplayingLetters = [...displayingLetters, letter];
    setDisplayingLetters(updatedDisplayingLetters);

    // Check Winning
    console.log("Checking completion");
    console.log("strAlphabets", strAlphabets);
    console.log("Displaying Letters", displayingLetters);

    const isAllPresent = strAlphabets.every(alph => updatedDisplayingLetters.includes(alph));
    if (isAllPresent) {
      console.log("Completed");
      // Apply animation for AnswerSquares here to blink upto 3 times
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
        setWinCount(prevCount => {
          const newCount = prevCount + 1;
          if (newCount === 10) {
            handleWin();
          }
          return newCount;
        });
        if (winCount !== 9) { // Only reset if not winning
          reset();
        }
      }, 1500); // Wait for blink animation to complete
    } else {
      console.log("Not completed");
    }
  }

  function gameOver() {
    for (let i = 65; i <= 90; i++) {
      letterMap[String.fromCharCode(i)] = true;
    }
    setAlphabets(letterMap);
    setDisplayingLetters(allChars);
    setWinCount(0);
    setIsGameOver(true);
    setIsBlinking(false);
    setWrongAnimations([false, false, false, false]);
    // setTimeout({reset}, 2000);
  }

  function handleWin() {
    setShowWinModal(true);
  }

  function reset() {
    // Create fresh letterMap
    let freshLetterMap = {};
    for (let i = 65; i <= 90; i++) {
      freshLetterMap[String.fromCharCode(i)] = false;
    }
    setAlphabets(freshLetterMap);
    setDisplayingLetters(dispLetters);
    setIsGameOver(false);
    setIsBlinking(false);
    setShowWinModal(false);
    setIsWrong([false, false, false, false]);
    setWrongAnimations([false, false, false, false]);
    getString();
  }

  function resetWithWinCount() {
    // Create fresh letterMap
    let freshLetterMap = {};
    for (let i = 65; i <= 90; i++) {
      freshLetterMap[String.fromCharCode(i)] = false;
    }
    setAlphabets(freshLetterMap);
    setDisplayingLetters(dispLetters);
    setIsGameOver(false);
    setIsBlinking(false);
    setShowWinModal(false);
    setWinCount(0);  // Reset win count
    setIsWrong([false, false, false, false]);
    setWrongAnimations([false, false, false, false]);
    getString();
  }

  function resetToMainMenu() {
    // Create fresh letterMap
    let freshLetterMap = {};
    for (let i = 65; i <= 90; i++) {
      freshLetterMap[String.fromCharCode(i)] = false;
    }
    setAlphabets(freshLetterMap);
    setDisplayingLetters(dispLetters);
    setIsGameOver(false);
    setIsBlinking(false);
    setShowWinModal(false);
    setWinCount(0);
    setIsplay(false);
    setIsWrong([false, false, false, false]);
    setWrongAnimations([false, false, false, false]);
    setStr("");
    setArrangedArr([]);
    setStrAlphabets([]);
  }

  // You Win Modal Component
  function YouWinModal() {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-8 rounded-3xl shadow-2xl border-4 border-yellow-300 max-w-md w-full mx-4 animate-bounce-in">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-spin-slow">🎉</div>
            <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg animate-pulse">
              🏆 YOU WIN! 🏆
            </h1>
            <p className="text-xl text-yellow-100 mb-6 font-bold">
              Congratulations! You've mastered the word game!
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetWithWinCount}
                className="bg-gradient-to-br from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-lg border-2 border-green-300 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
              >
                🎮 Play Again
              </button>
              <button
                onClick={resetToMainMenu}
                className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-lg border-2 border-purple-300 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
              >
                🏠 Main Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // #### Funtion to get new string and set arranged Arr #### //
  
  function getString() {
    setIsplay(true);

    // We can get strings using API
    let tempStr = "Hello, World!".toUpperCase();

    // let strAlphs = tempStr.split('').filter(ch => /A-Z/.test(ch));
    let strAlphs = [...new Set(tempStr.split('').filter(ch => /[A-Z]/.test(ch)))];
    setStrAlphabets(strAlphs);
    setStr(tempStr);   
    
  }

  // #### Function to arrange and align in 4 rows #### //
  function arrangeWords(inputString) {
    console.log(inputString);
    const maxCols = 14;
    const totalRows = 4;
    const totalCells = maxCols * totalRows;

    // Fill with nulls initially
    const grid = Array(totalCells).fill(null);

    // Word wrapping
    const words = inputString.trim().split(" ");
    const lines = [];
    let currentLine = "";

    for (let word of words) {
      const tryLine = currentLine ? currentLine + " " + word : word;
      if (tryLine.length <= maxCols) {
        currentLine = tryLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);

    // Row start based on number of lines
    const lineCount = lines.length;
    let startRow = lineCount === 1 ? 1 : lineCount === 2 ? 1 : 0;

    // Fill centered lines into the grid
    for (let i = 0; i < lines.length; i++) {
      const rowIndex = startRow + i;
      const line = lines[i];
      const padding = Math.floor((maxCols - line.length) / 2);
      const rowStart = rowIndex * maxCols;

      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        grid[rowStart + padding + j] = (char === ' ') ? null : char;
      }
    }
    
    console.log("Arranged words", grid);
    return grid;
  }


  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900 flex">
      {/* Game Area - Left Side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          {!isPlay ?
          (<div className="flex justify-center">
            <button onClick={getString} className="w-40 h-20 pb-2 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 text-white font-bold text-4xl font-[cursive] hover:scale-95 shadow-2xl border-4 border-white/20">
              Play
            </button>
          </div>)
            :
          (<div className="flex flex-col items-center justify-center space-y-8">
            {/* Top Bar with Wrong Marks and Win Counter */}
            <div className="flex justify-between items-center w-full max-w-[41rem] bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="w-6"></div>
              <div className="flex gap-2 justify-center">
                <WrongMarkSquare isWrong={isWrong[0]} shouldAnimate={wrongAnimations[0]} />
                <WrongMarkSquare isWrong={isWrong[1]} shouldAnimate={wrongAnimations[1]} />
                <WrongMarkSquare isWrong={isWrong[2]} shouldAnimate={wrongAnimations[2]} />
                <WrongMarkSquare isWrong={isWrong[3]} shouldAnimate={wrongAnimations[3]} />
              </div>
              <WinCountIndicator winCount={winCount} />
            </div>

            {/* Alphabet Grid or Game Over */}
            {isGameOver ? (
              <div className="flex flex-col w-full max-w-[34rem] h-[8rem] pb-3 items-center justify-center border-2 border-red-400 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 shadow-2xl game-over-transition">
                <div className="rounded-lg text-center">
                  <p className="text-white font-bold text-5xl font-[cursive] drop-shadow-lg">Game Over</p>
                  <button onClick={reset} className="bg-gradient-to-br from-yellow-400 to-orange-500 mt-3 p-3 rounded-xl w-36 font-bold text-xl text-white border-2 border-white/30 hover:scale-95 heartbeat-animation shadow-lg">
                    Play Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap w-full max-w-[50rem] min-h-[8rem] gap-2 p-6 border-2 border-white/30 rounded-2xl bg-white/10 backdrop-blur-sm">
              {Object.entries(alphabets).map(([letter, isClicked]) => (
                <AlphabetSquare key={letter} alphabet={letter} isClicked={isClicked} />
              ))}
              </div>
            )}

            {/* Answer Grid */}
            <div className={`grid grid-cols-14 gap-1 w-full max-w-[45rem] p-4 rounded-2xl bg-transition shadow-xl border-2 ${!isWrong.includes(false) ? 'bg-gradient-to-br from-red-500 to-red-700 border-red-300' : 'bg-gradient-to-br from-amber-500 to-orange-600 border-orange-300'}`}>
              {Array.from({ length: 56 }, (_, index) => (
                <AnswerSquare key={index} answer={arrangedArr[index]} />)
              )}
            </div>
          </div>)
          }
        </div>
      </div>
      </div>

      {/* You Win Modal */}
      {showWinModal && <YouWinModal />}
    </>
  );
}
