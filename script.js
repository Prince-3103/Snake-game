const board = document.querySelector('.board');
const blockHeight = 50;
const blockWidth = 50;
const blocks = [];

const rows = Math.floor(board.clientHeight/blockHeight);
const cols = Math.floor(board.clientWidth/blockWidth);

const gameOver = document.querySelector(".game-over");
const startBtn = document.querySelector("#start-btn")
const restartBtn = document.querySelector("#restart-btn");

const scoreCounter = document.querySelectorAll(".your-score");
const highScoreElement = document.querySelectorAll(".high-score");
const timeElement = document.querySelectorAll(".timer")

let intervalId = null;
let timeIntervalId = null;
let food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)};

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let timer = "00:00"

highScoreElement.forEach(highScoreCount =>{
    highScoreCount.textContent = highScore;
})

let snake = [
    {x: 4, y:7},
    {x: 4, y:6},
    {x: 4, y:5}
]
let direction = "right";

function renderBoard(){
    for(let row=0; row<rows; row++){
        for(let col=0; col<cols; col++){
            const block = document.createElement("div");
            block.classList.add("block");
            board.appendChild(block);
            blocks[`${row}-${col}`] = block;
        }
    }
}
renderBoard();

function updateHighScore(){
    highScoreElement.forEach(highScoreCount => {
        highScoreCount.textContent = highScore;
    });
}

function eatFood(head){
    if(highScore < score){
        highScore = score;
        localStorage.setItem("highScore", highScore);
        updateHighScore();
    }
    if(head.x === food.x && head.y === food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)};

        score += 10;
        blocks[`${food.x}-${food.y}`].classList.add("food");

        if(highScore < score){
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
        snake.unshift(head)
        return true;
    }
    return false;
}

function getNextHead(){
    if(direction === "left"){
        return {x: snake[0].x, y: snake[0].y - 1};
    }
    else if(direction === "right"){
        return {x: snake[0].x, y: snake[0].y + 1};
    }
    else if(direction === "up"){
        return {x: snake[0].x - 1, y: snake[0].y};
    }
    else if(direction === "down"){
        return {x: snake[0].x + 1, y: snake[0].y};
    }
}

function handleGameOver(){
    gameOver.style.display = "flex";
    clearInterval(intervalId);
    clearInterval(timeIntervalId);
}

function render(){
    let head = getNextHead();

    snake.forEach((segment, index) => {    
        blocks[`${segment.x}-${segment.y}`].classList.remove("filled", "snake-head");
    })

    // Self Bite 
    const hitSnake = snake.some(segment => {
        return segment.x === head.x && segment.y === head.y;
    });
    if(hitSnake){
        handleGameOver();
        return;
    }
    
    // Hitting wall
    if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){
        handleGameOver()
        return;
    }
    
    // Moving Snake
    snake.unshift(head);
    snake.pop()

    snake.forEach((segment, index)=>{
        if(index === 0){
            blocks[`${segment.x}-${segment.y}`].classList.add("snake-head")
        }
        else{
            blocks[`${segment.x}-${segment.y}`].classList.add("filled");
        }
    })
    
    blocks[`${food.x}-${food.y}`].classList.add("food");

    // Eating Food
    eatFood(head)
    
    scoreCounter.forEach((scoreCount) => {
        scoreCount.textContent = score;
    })
}

function startGame(){
    score = 0;
    intervalId = setInterval(() =>{
        render()
    },200);
    timeIntervalId = setInterval(() => {
        let [min, sec] = timer.split(":").map(Number);

        if(sec == 59){
            min++;
            sec = 0;
        }
        else{
            sec++;
        }
        timer = `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
        timeElement.forEach((timeCounter) => {
            timeCounter.textContent = timer;
        })
    }, 1000);
}

function restartGame(){
    snake = [
        {x: 1, y:3},
        {x: 1, y:4},
        {x: 1, y:5}
    ]
    direction = "down";
    timer = `00:00`;
    timeElement.forEach(timeCounter => {
        timeCounter.textContent =  timer;
    })
    clearInterval(timeIntervalId)
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)};

    gameOver.style.display = "none";
    clearInterval(intervalId);

    updateHighScore()
}

startBtn.addEventListener("click", startGame);

addEventListener("keydown", (event) => {
    if(event.key === "ArrowUp" && direction !== "down"){
        direction = "up";
    }
    else if(event.key === "ArrowDown" && direction !== "up"){
        direction = "down";
    }
    else if(event.key === "ArrowRight" && direction !== "left"){
        direction = "right";
    }else if(event.key === "ArrowLeft"  && direction !== "right"){
        direction = "left";
    }
});

restartBtn.addEventListener("click", ()=>{
    restartGame();
})