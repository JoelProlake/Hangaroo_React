import React, { useEffect, useState } from "react";

function TicTacToe() {

    const[winner, setWinner] = useState("");
    const [isX, setIsX] = useState(true);
    const [boxValue, setBoxValue] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const result = checkWinner();
        if (result) setWinner(result);
    }, [boxValue]);



    // Conmponent to show WINNER Pop Up or TIE Pop Up 
    function ShowWinner({displayTxt}) {
        return (
            <div className="fixed top-0 left-0 h-[100vh] w-[100vw] bg-teal-100 ">
            <div className="p-4 bg-teal-200 rounded h-[100vh] flex flex-col justify-center items-center">
                <h1 className="text-xl font-bold">{displayTxt}</h1>
                <ResetBtn />
            </div>
            </div>
        );
    }

    // Component to display squares of board
    function Square({sqNo}){
        return (
            <button onClick={() => {handleClick(sqNo)}} className="h-20 w-20 text-4xl bg-teal-100 rounded">{boxValue[sqNo]}</button>
        );
    }

    // Reset Button Component
    function ResetBtn(){
        return (
            <button onClick={reset} className="mt-8 bg-teal-400 p-2 pl-4 pr-4 rounded-lg text-lg font-semibold">Reset</button>
        );
    }



    const reset = () => {
        setIsX(true);
        setWinner("");
        setBoxValue([]);
        setCount(0);
    };

    const handleClick = (squareNo) => {
        if(boxValue[squareNo] || winner) return;

        setCount(count+1);
        console.log(squareNo);
        const newBoxValue = [...boxValue];
        newBoxValue[squareNo] = isX ? "X" : "O";
        setBoxValue(newBoxValue);
        setIsX(!isX);

        console.log(boxValue);
          
    };

    const checkWinner = () => {
        console.log(boxValue);
        console.log("hello");
        const lines = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];

        for (let [a, b, c] of lines) {
            if (boxValue[a] && boxValue[a] === boxValue[b] && boxValue[a] === boxValue[c]){
                return boxValue[a];
            }
        }
        return null;
        
    };



    return (
        <>
        
        <div className="flex flex-col justify-center items-center h-lvh">
            <h1 className="text-4xl pb-8 font-bold text-teal-900">Tic Tac Toe</h1>
            <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                    <Square sqNo={0} />
                    <Square sqNo={1} />
                    <Square sqNo={2} />
                </div>
                <div className="flex gap-1">
                    <Square sqNo={3} />
                    <Square sqNo={4} />
                    <Square sqNo={5} />
                </div>
                <div className="flex gap-1">
                    <Square sqNo={6} />
                    <Square sqNo={7} />
                    <Square sqNo={8} />
                </div>
            </div>
            <ResetBtn />
        </div>

        {/* Display Pop Up when winner found */}
        { winner && (<ShowWinner displayTxt={`Player ${winner} is the winner`} />) } 

        {/* Display Pop Up when game tied */}
        { count == 9 && (<ShowWinner displayTxt={`It's a Tie`} />)  } 

                
        </>
    );
}
export default TicTacToe;