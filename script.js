const mixer = array => {
    for (let i = array.length; i; i--) {
        let randomized = Math.floor(Math.random() * i);
        [array[i - 1], array[randomized]] = [array[randomized], array[i - 1]];
    }
    return array;
}

const buttonSelect = document.querySelectorAll(".button-select button")
const mixing = mixer(field3);
const backEnd = { name: "back-end", img: "back-end.png"}
const start = document.getElementById("start")
const memoryGame = document.getElementById("memory-case");
const startAgain = document.getElementById("start-again");
const pyro = document.getElementById("pyro");
const rules = document.getElementById("rules");
const newElement = document.createElement("div");

let opening = 0;
let score = 0;
let needed = [];
let firstCard, lastCard;
let turnOvered = false;
let lockCard = false;
let asNeeded = [];
let cloneAsNeeded = [];
let columns = null;
let rows = null;
let getTag = null
const countDown = document.getElementById("timer")
let startingMinutes = null

function getData() {
    columns = parseInt(this.dataset.columns,10);
    rows = parseInt(this.dataset.rows,10);
}

buttonSelect.forEach(elem => {
    elem.addEventListener("click", getData)
})

function rulesGame () {
    alert(" Opening The Cards Correctly 10 Points.  5 Points Are Deducted When Opened Incorrectly.")
}

function startGame () {
    needed = (columns*rows)/2;
    asNeeded = mixing.slice(0, needed);
    cloneAsNeeded = asNeeded.concat(asNeeded);
    start.classList.add("display-none")
    rules.classList.add("display-none")
    newElement.classList.toggle("memory-visible")
    startingMinutes = columns/2;
    let time = startingMinutes * 60;
    function timerCountDown () {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        countDown.innerHTML = `Countdown Start ${minutes} : ${seconds}`
        countDown.classList.add("memory-visible")
        time--
    }
    let timerInterval = setInterval(() => {
        timerCountDown();

        if (time === 0) {
            countDown.innerHTML = ''
            alert("Your Time is Out!")
            clearInterval(timerInterval);
            startAgainGame()
        }
    },1000);

    mixer(cloneAsNeeded).map((elem) => {
        const memoryCard = document.createElement("div");
        const backImg = document.createElement("img");
        backImg.classList.toggle("back-face")
        backImg.src = `./cards image/${backEnd.img}`
        memoryCard.classList.add("memory-card")
        const img = document.createElement("img");
        img.src = `./cards image/${elem.img}`
        img.classList.add("cards-images")
        memoryCard.appendChild(img);
        memoryCard.appendChild(backImg)
        newElement.appendChild(memoryCard);
        memoryCard.setAttribute("id",`${elem.name}`)
        startAgain.classList.add("display-block")
        window.scrollTo(0,document.body.scrollHeight);
        memoryCard.addEventListener("click", turnedOver )
    })

    newElement.setAttribute("id","memory-game")
    newElement.classList.add("memory-game")
    newElement.classList.add("grid-container")
    newElement.style.cssText = `grid-template-columns: repeat(${columns},1fr)`;
    console.log(getTag)
    memoryGame.appendChild(newElement);

    function turnedOver() {
        if (lockCard) return;
        if (this === firstCard) return;
        this.classList.toggle('turned-over')
        if (!turnOvered) {
            turnOvered = true;
            firstCard = this;
        } else {
            turnOvered = false;
            lastCard = this;

            if (firstCard.id === lastCard.id) {
                checkOpened(firstCard, lastCard)
            } else {
                checkClosed()
            }
        }

        function checkOpened(firstCard, lastCard) {
            firstCard.removeEventListener("click", turnedOver)
            lastCard.removeEventListener("click", turnedOver)
            opening++;
            score += 10;
            if (opening === (columns*rows)/2) {
                setTimeout(() => {
                    alert(`You Win, Congratulations, Your Score Is ${score}`)
                    pyro.classList.add("display-block")
                    clearInterval(timerInterval)
                }, 500)
            }
        }

        function checkClosed() {
            lockCard = true;
            setTimeout(() => {
                if (score === 0) {
                    score += 5
                } else {
                    score -= 5;
                }
                firstCard.classList.remove("turned-over")
                lastCard.classList.remove("turned-over")
                resetCard()
            }, 1500)
        }
        function resetCard() {
            [turnOvered, lockCard] = [false, false];
            [firstCard, lastCard] = [null, null]
        }
    }
}

function startAgainGame () {
    location.reload()
}
