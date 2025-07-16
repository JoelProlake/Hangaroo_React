/* 

Components required

1. Wrong mark square (4)
2. Alphabet (26)
3. Title Bar (1)
4. Answer squares (4x14)

*/
import { useEffect, useState } from "react";

export default function Hangaroo() {
  const [isWrong, setIsWrong] = useState([false, false, false, false]);
  const [isPlay, setIsplay] = useState(false);
  const [arrangedArr, setArrangedArr] = useState([]);
  const [str, setStr] = useState("");
  
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

  // let string;


  useEffect(() => {
    const arrangedArrFromFunc = arrangeWords(str);
    setArrangedArr(arrangedArrFromFunc)
  }, [str])
  


  // Wrong Mark Square Component
  function WrongMarkSquare({ isWrong }) {
    return (
      <div className="w-14 h-16 rounded-md bg-yellow-500 ">
        <p className={`text-6xl  font-black ${isWrong ? "text-red-500" : "text-yellow-600"} `}>
          X
        </p>
      </div>
    );
  }

  // Alphabet Square Component
  function AlphabetSquare({ alphabet, isClicked }) {
    console.log(alphabets);
    return (
      <button
        onClick={() => handleLetterClick(alphabet)}
        // disabled={alphabets[alphabet] ? true : false}
        disabled={isClicked}
        className={`w-8 h-8 rounded-xl text-xl bg-green-600 text-white font-black border-2 border-black items-center leading-4 `}
      >
        {alphabet}
      </button>
    );
  }

  // Answer Squares component (4 x 14 = 56)
  function AnswerSquare({answer}) {
    return (
      
      <div className={`w-10 h-10 rounded-xl text-xl ${answer ? 'bg-green-500 bulged-shadow-inset' : 'bg-yellow-600 sunked-shadow-inset'} text-white font-bold i items-center text-center leading-9`}>
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
      isWrong.splice(index, 1, true)
    } else {
      gameOver();
    }
  }

  // #### Displays alphabets if clicked alphabets are correct #### //
  function handleLetterDisplay(letter) {
    // dispLetters.push(letter);
    setDisplayingLetters(prev => [...prev, letter]);
  }

  function gameOver() {
    for (let i = 65; i <= 90; i++) {
      letterMap[String.fromCharCode(i)] = true;
    }
    setAlphabets(letterMap);
    setDisplayingLetters(allChars);
    setTimeout({reset}, 2000);
  }

  function reset() {
    
  }

  // #### Funtion to get new string and set arranged Arr #### //
  function getString() {
    setIsplay(true);

    // We can get strings using API
    let tempStr = "Hello, World!".toUpperCase();
    
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

    return grid;
  }


  return (
    <>

      {!isPlay ? 
      (<button onClick={getString} className="w-32 h-16 pb-2 rounded-lg bg-yellow-500 text-green-500 font-bold text-5xl font-[cursive] hover:scale-95">Play</button>)
        :
      (<div>
        <div className="flex gap-1">
          <WrongMarkSquare isWrong={isWrong[0]} />
          <WrongMarkSquare isWrong={isWrong[1]} />
          <WrongMarkSquare isWrong={isWrong[2]} />
          <WrongMarkSquare isWrong={isWrong[3]} />
        </div>

        <div className="flex flex-wrap w-[30rem] gap-1 pt-3 pb-3 pl-[0.4rem] pr-1 border-2 border-blue-800 rounded-lg bg-white">
        {Object.entries(alphabets).map(([letter, isClicked]) => (
          <AlphabetSquare key={letter} alphabet={letter} isClicked={isClicked} />
        ))}
        </div>

        
        <div className="flex flex-wrap gap-1 w-[40rem] p-2 pl-[15px] bg-yellow-600 rounded-lg mt-2">
          {arrangedArr.map((item, index) => (
            <AnswerSquare key={index} answer={item} />)
          )}
        </div>
      </div>)
      }
    </>
  );
}
