const board = document.querySelector('.board');
const blockHeight = 50;
const blockWidth = 50;
const blocks = [];

const rows = Math.floor(board.clientHeight/blockHeight);
const cols = Math.floor(board.clientWidth/blockWidth);

const gameOver = document.querySelector(".game-over");
const startBtn = document.querySelector("#start-btn")
const restartBtn = document.querySelector("#restart-btn");

const scoreCounter = document.querySelector("#score");
const highScoreElement = document.querySelector("#high-score");
const timeElement = document.querySelector("#timer")

let intervalId = null;
let food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)};

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let timer = "00-00"

highScoreElement.textContent = highScore;

let snake = [
    {x: 1, y:3},
    {x: 1, y:4},
    {x: 1, y:5}
]
let direction = "down";

for(let row=0; row<rows; row++){
    for(let col=0; col<cols; col++){
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}

function render(){
    let head = null;
    if(direction === "left"){
        head = {x: snake[0].x, y: snake[0].y - 1};
    }
    else if(direction === "right"){
        head = {x: snake[0].x, y: snake[0].y + 1};
    }
    else if(direction === "up"){
        head = {x: snake[0].x - 1, y: snake[0].y};
    }
    else if(direction === "down"){
        head = {x: snake[0].x + 1, y: snake[0].y};
    }
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("filled");
    })
    
    
    if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){
        gameOver.style.display = "flex";
        clearInterval(intervalId);
        return;
    }
    
    snake.unshift(head);
    snake.pop()

    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.add("filled");
    })
    
    blocks[`${food.x}-${food.y}`].classList.add("food");

    if(head.x === food.x && head.y === food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)};

        score += 10;
        blocks[`${food.x}-${food.y}`].classList.add("food");

        if(highScore < score){
            highScore = score;
            localStorage.setItem("highScore", JSON.parse(highScore));
        }
        snake.unshift(head)
    }
    scoreCounter.textContent = score;
}

function startGame(){
    score = 0;
    intervalId = setInterval(() =>{
        render()
    },300)
}

startBtn.addEventListener("click", startGame);

addEventListener("keydown", (event) => {
    if(event.key === "ArrowUp"){
        direction = "up";
    }
    else if(event.key === "ArrowDown"){
        direction = "down";
    }
    else if(event.key === "ArrowRight"){
        direction = "right";
    }else if(event.key === "ArrowLeft"){
        direction = "left";
    }
});

restartBtn.addEventListener("click", ()=>{
    snake = [
        {x: 1, y:3},
        {x: 1, y:4},
        {x: 1, y:5}
    ]
    direction = "down";
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)};

    gameOver.style.display = "none";
    clearInterval(intervalId);

    highScoreElement.textContent = highScore;

})