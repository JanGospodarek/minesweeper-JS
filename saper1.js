class Game {
  main = document.getElementById("main");
  div = document.createElement("div");
  appended = false;
  liczbaBomb;
  liczbaBombObok;
  kafel;
  nick;
  start = false;
  wysokoscPlanszy;
  szerokoscPlanszy;
  allChecked;
  ableToMod;
  pozostaloBomb;
  timerInterval;
  checkTimer;
  terazFlaga = 1;
  lastClicked;
  rekordBoard;
  rekordy = [];
  bombPosArr = [];
  arrPlansza = [];
  timer = 0;
  rows = new Array(this.wysokoscPlanszy);
  constructor() {
    this.createForm();
  }
  createForm() {
    const input1 = document.getElementById("height");
    const input2 = document.getElementById("width");
    const input3 = document.getElementById("bombs");
    input1.addEventListener("input", (e) => {
      this.handleOnChange(input1);
    });

    input2.addEventListener("input", (e) => {
      this.handleOnChange(input2);
    });
    input3.addEventListener("input", (e) => {
      this.handleOnChange(input3);
    });
    document
      .getElementById("submit")
      .addEventListener("click", (e) => this.handleForm(e));
  }
  startTimer() {
    const date = new Date();
    this.timerInterval = setInterval(() => {
      let a = new Date();
      let d = a - date;
      this.timer = new Date(d).getSeconds();
      document.querySelector("#czas").innerText = " ";
      document.querySelector("#czas").innerText = `Czas gry: ${this.timer}`;
    }, 1000);
  }
  handleOnChange(element) {
    if (isNaN(Number(element.value.trim()))) {
      setTimeout(() => {
        element.value = "";
      }, 1000);
    }
  }

  handleForm(e) {
    e.preventDefault();

    if (!this.start) {
      // this.wysokoscPlanszy = Number(document.getElementById("height").value);
      // this.szerokoscPlanszy = Number(document.getElementById("width").value);

      // this.liczbaBomb = Number(document.getElementById("bombs").value);
      this.wysokoscPlanszy = 10;
      this.szerokoscPlanszy = 11;
      this.liczbaBomb = 1;
      console.log(this.wysokoscPlanszy);
      if (
        this.wysokoscPlanszy === 0 ||
        this.szerokoscPlanszy === 0 ||
        this.liczbaBomb === 0
      ) {
        location.reload();
      }
      this.pozostaloBomb = this.liczbaBomb;
      this.startTimer();
      this.getCookies();
      this.bombPositions();
      this.start = true;
    }
  }
  getCookies() {
    const fresh = document.cookie;
    if (!fresh) return;
    const cookies = JSON.parse(document.cookie.split("=")[1]);
    console.log(cookies);
    this.rekordy = cookies;
  }
  createArr() {
    for (let index = 0; index < this.wysokoscPlanszy; index++) {
      if (this.rows[index] === undefined) {
        this.rows[index] = new Array(this.szerokoscPlanszy).fill(false);
      }
    }
    for (let index = 0; index < this.wysokoscPlanszy; index++) {
      for (let l = 0; l < this.szerokoscPlanszy; l++) {
        let obj;

        this.rows[index][l]
          ? (obj = { row: index, col: l, bomb: 1, checked: false, flag: false })
          : (obj = {
              row: index,
              col: l,
              bomb: 0,
              checked: false,
              flag: false,
            });
        this.arrPlansza.push(obj);
      }
    }
    this.renderBombNumber();
    this.render();
    this.renderRekordy();
  }

  bombPositions() {
    const randomPosGenerate = () => {
      const numerWiersza = Math.floor(Math.random() * this.wysokoscPlanszy);
      const numerKolumny = Math.floor(Math.random() * this.szerokoscPlanszy);
      let wiersz = this.rows[numerWiersza];

      if (!this.rows[numerWiersza]) {
        wiersz = new Array(10).fill(false);
        this.rows[numerWiersza] = wiersz;
      }

      if (!wiersz[numerKolumny]) {
        wiersz[numerKolumny] = true;
        return;
      } else {
        randomPosGenerate();
      }
    };

    for (let i = 0; i < this.liczbaBomb; i++) {
      randomPosGenerate();
    }

    this.createArr();
  }
  render() {
    this.plansza = document.createElement("div");
    this.plansza.classList.add("plansza");
    this.plansza.style.width = `${this.wysokoscPlanszy * 20}px`;
    this.plansza.style.height = `${this.szerokoscPlanszy * 20}px`;
    let i = 0;
    for (let index = 0; index < this.wysokoscPlanszy; index++) {
      for (let l = 0; l < this.szerokoscPlanszy; l++) {
        let kafelek = document.createElement("div");
        kafelek.id = `${index * 20}X${l * 20}`;
        kafelek.setAttribute("dataID", `k-${i}`);
        kafelek.classList.add("NO");
        kafelek.classList.add("kafelek");
        kafelek.style.backgroundImage = "url(./img/klepa.PNG)";

        kafelek.style.top = `${index * 20}px`;
        kafelek.style.left = `${l * 20}px`;

        this.plansza.appendChild(kafelek);
        i++;
      }
    }

    this.main.appendChild(this.plansza);
    document
      .querySelector(".plansza")
      .addEventListener("click", (e) => this.handleKafelekClick(e));
    document
      .querySelector(".plansza")
      .addEventListener("contextmenu", (e) => this.handleRMBClick(e), false);
  }
  renderRekordy() {
    this.rekordBoard = document.createElement("div");

    const boardH = document.createElement("div");
    const boardFilter = document.createElement("div");
    const select = document.createElement("select");

    boardH.classList.add("boardH");
    boardFilter.classList.add("boardFilter");
    boardH.innerText = "Tabela wyników";
    select.id = "filter";
    this.rekordBoard.classList.add("board");

    boardFilter.appendChild(select);
    this.main.appendChild(this.rekordBoard);
    this.rekordBoard.appendChild(boardFilter);
    this.rekordBoard.appendChild(boardH);

    const vals = [];
    this.rekordy.forEach((rekord) =>
      vals.push(`${rekord.wysokoscPlanszy}X${rekord.szerokoscPlanszy}`)
    );

    new Set(vals).forEach((rekord) => {
      const opt = document.createElement("option");
      opt.setAttribute("value", rekord);
      opt.innerText = rekord;
      opt.classList.add("opt");
      select.appendChild(opt);
    });
    let filtered = [];

    select.addEventListener("change", (e) => {
      filtered = this.rekordy.filter(
        (rekord) =>
          e.target.value ==
          `${rekord.wysokoscPlanszy}X${rekord.szerokoscPlanszy}`
      );
      console.log(filtered);
      this.div.innerHTML = "";
      this.renderTabOfRekords(filtered);
    });
    this.div.innerHTML = "";

    this.renderTabOfRekords(this.rekordy);
  }
  renderTabOfRekords(arr) {
    this.div.classList.add("essa");
    this.rekordBoard.appendChild(this.div);
    arr.forEach((rekord, i) => {
      const div1 = document.createElement("div");
      const div2 = document.createElement("div");
      const div3 = document.createElement("div");
      div1.empty;
      div1.classList.add("boardItem");
      div2.classList.add("boardItem");
      div3.classList.add("boardItem");
      div1.style.gridColumn = 1;
      div2.style.gridColumn = 2;
      div3.style.gridColumn = 3;
      div1.style.gridRow = i + 2;
      div2.style.gridRow = i + 2;
      div3.style.gridRow = i + 2;
      div1.innerText = rekord.name;
      div2.innerText = rekord.time;
      const wymiary = `${rekord.wysokoscPlanszy}X${rekord.szerokoscPlanszy}`;
      div3.innerText = wymiary;
      this.div.appendChild(div1);
      this.div.appendChild(div2);
      this.div.appendChild(div3);
    });
  }
  nearBombs(kafel) {
    const bombArr = this.arrPlansza.filter((el) => el.bomb === 1);

    function checking(ID) {
      for (let i = 0; i < bombArr.length; i++) {
        if (
          `${bombArr[i].row * 20}X${bombArr[i].col * 20}` ==
          document.getElementById(ID).id
        ) {
          return true;
        }
      }
      return false;
    }

    let a = 0;

    const tab_cords = kafel.id.split("X");
    const x = parseInt(tab_cords[0]);
    const y = parseInt(tab_cords[1]);
    const id = kafel.getAttribute("dataID").split("-")[1];
    kafel.classList.remove("NO");
    kafel.classList.add("YES");
    this.arrPlansza[id].checked = true;
    const bezpieczne = [];

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        const row = x + i * 20;
        const col = y + j * 20;
        const curEl = document.getElementById(`${row}X${col}`);

        if (curEl !== null && curEl.classList.contains("NO")) {
          bezpieczne.push({ row: row, col: col });
        }
      }
    }

    for (let i = 0; i < bezpieczne.length; i++) {
      let hasFlag = true;

      bombArr.forEach(function (object) {
        if (hasFlag) {
          if (
            object.row * 20 == bezpieczne[i].row &&
            object.col * 20 == bezpieczne[i].col
          ) {
            a++;
            hasFlag = false;
          }
        }
      });
    }

    for (let i = 0; i < bezpieczne.length; i++) {
      if (!checking(document.getElementById(`${x}X${y}`).id) && a == 0) {
        const thisBInder = this;
        thisBInder.nearBombs(
          document.getElementById(`${bezpieczne[i].row}X${bezpieczne[i].col}`)
        );
      }
    }
    kafel.style.backgroundImage = null;
    kafel.style.backgroundColor = "lightgray";
    if (a != 0) kafel.innerText = a;
    this.checkIsWin();
  }

  renderBombNumber() {
    document.getElementById("liczbaBomb").innerText = " ";
    document.getElementById(
      "liczbaBomb"
    ).innerText = `Pozostało bomb: ${this.pozostaloBomb}`;
  }
  handleKafelekClick(e) {
    if (!this.start) return;
    if (!e.target.classList.contains("kafelek")) return;
    const kafelek = e.target.closest(".kafelek");

    const id = Number(kafelek.getAttribute("dataID").split("-")[1]);

    let czyBomba = this.arrPlansza[id].bomb;
    if (czyBomba === 1) {
      this.looseGame();
      return;
    }

    this.nearBombs(kafelek);
    if (this.start) this.checkIsWin();
  }
  handleRMBClick(e) {
    e.preventDefault();
    if (!this.start) return;

    if (!e.target.classList.contains("kafelek")) return;

    this.terazFlaga = 1;

    const kafelek = e.target.closest(".kafelek");
    if (this.lastClicked === kafelek) this.terazFlaga = 0;
    else this.terazFlaga = 1;
    this.lastClicked = kafelek;

    const id = Number(kafelek.getAttribute("dataID").split("-")[1]);
    let czyBomba = this.arrPlansza[id].bomb;

    if (czyBomba === 1 && !this.arrPlansza[id].flag) {
      this.pozostaloBomb--;
      this.renderBombNumber();
    }
    if (this.arrPlansza[id].checked) return;
    this.arrPlansza[id].flag = true;
    this.terazFlaga === 1
      ? (kafelek.style.backgroundImage = "url(./img/flaga.PNG)")
      : (kafelek.style.backgroundImage = "url(./img/pyt.PNG)");

    if (this.start) this.checkIsWin();
  }
  looseGame() {
    const bombsArr = [];
    document.querySelectorAll(".kafelek").forEach((el) => {
      const id = el.id.split("X");
      const x = Number(id[0]) / 20;
      const y = Number(id[1]) / 20;
      const index = this.arrPlansza.findIndex(
        (el) => el.row == x && el.col == y && el.bomb == 1
      );
      if (this.arrPlansza[index])
        bombsArr.push(
          `${this.arrPlansza[index].row * 20}X${
            this.arrPlansza[index].col * 20
          }`
        );
    });
    console.log(bombsArr);
    bombsArr.forEach((bomb) => {
      document.getElementById(bomb).style.backgroundImage =
        "url(./img/bomb.PNG)";
    });
    this.start = false;
    this.reset("Przegrałeś!");
  }
  checkIsWin() {
    let win = false;
    for (let index = 0; index < this.arrPlansza.length; index++) {
      const el = this.arrPlansza[index];
      if (el.checked && el.bomb === 0) win = true;
      if (!el.checked && el.bomb === 0) {
        win = false;
        break;
      }
    }

    if (win && this.pozostaloBomb === 0) {
      alert("Wygrałeś");
      this.renderNick();
      this.start = false;
    }
  }
  renderNick() {
    clearInterval(this.timerInterval);

    const formularz = document.createElement("form");
    const nick = document.createElement("input");
    const pN = document.createElement("p");
    const button = document.createElement("button");

    pN.innerText = "Twój nick: ";
    nick.id = "nick";
    button.id = "submit";
    formularz.id = "nickForm";
    button.innerText = "Submit";
    button.setAttribute("type", "submit");

    pN.appendChild(nick);
    formularz.appendChild(pN);
    formularz.appendChild(button);
    this.main.appendChild(formularz);
    formularz.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = nick.value;
      this.nick = name;
      this.pushToRekordy();
      if (this.appended) return;
      this.renderRekordy();
      this.appended = true;
      const buttonres = document.createElement("button");
      buttonres.id = "reset";
      buttonres.innerText = "Reset";
      document.querySelector("#form").appendChild(buttonres);
      buttonres.addEventListener("click", (e) => location.reload());
    });
  }
  pushToRekordy() {
    const obj = {
      name: this.nick,
      time: this.timer,
      szerokoscPlanszy: this.szerokoscPlanszy,
      wysokoscPlanszy: this.wysokoscPlanszy,
    };
    this.rekordy.push(obj);
    const json_str = JSON.stringify(this.rekordy);
    this.createCookie("rekordy", json_str, 2);
  }
  reset(msg) {
    if (!msg == undefined) alert(msg);
    clearInterval(this.timerInterval);
    setTimeout(() => {
      location.reload();
    }, 5000);
  }
  createCookie(name, value, hours) {
    const date = new Date();
    date.setTime(date.getTime() + Number(hours) * 3600 * 1000);
    document.cookie =
      name + "=" + value + "; path=/;expires = " + date.toGMTString();
  }
}

function displayForm() {
  const formularz = document.createElement("form");
  const main = document.getElementById("main");
  const p1 = createEl(
    "p",
    "Wysokość planszy",
    null,
    null,
    null,
    formularz,
    true
  );
  const p2 = createEl(
    "p",
    "Szerokość planszy",
    null,
    null,
    null,
    formularz,
    true
  );
  const p3 = createEl(
    "p",
    "Liczba bomb",
    null,
    null,
    null,
    null,
    formularz,
    true
  );

  createEl("input", null, "height", "type", "text", p1, false);
  createEl("input", null, "width", "type", "text", p2, false);
  createEl("input", null, "bombs", "type", "text", p3, false);
  createEl("button", "Submit", "submit", "type", "submit", formularz, false);

  const czas = document.createElement("p");
  const liczbaBomb = document.createElement("p");
  czas.innerText = "Czas gry:  ";
  liczbaBomb.id = "liczbaBomb";
  czas.setAttribute("id", "czas");
  formularz.setAttribute("id", "form");

  formularz.appendChild(p1);
  formularz.appendChild(p2);
  formularz.appendChild(p3);
  main.appendChild(formularz);
  main.appendChild(czas);
  main.appendChild(liczbaBomb);
  const game = new Game();
}
displayForm();
function createEl(name, inner, id, attr, attrVal, appendTo, returnEl) {
  const element = document.createElement(name);
  if (inner !== null) element.innerText = inner;
  if (id !== null) element.id = id;
  if (attr !== null && attr !== null) element.setAttribute(attr, attrVal);
  if (appendTo !== null) appendTo.appendChild(element);
  if (returnEl) return element;
}
