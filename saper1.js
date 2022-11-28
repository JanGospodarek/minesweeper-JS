class Game {
  main = document.getElementById("main");
  liczbaBomb;
  liczbaBombObok;
  kafel;
  wysokoscPlanszy;
  szerokoscPlanszy;
  allChecked;
  ableToMod;
  pozostaloBomb;
  checkTimer;
  bombPosArr = [];
  arrPlansza = [];
  timer = 0;
  rows = new Array(this.wysokoscPlanszy);
  constructor() {
    this.createForm();
  }
  createForm() {
    const formularz = document.createElement("form");
    const input1 = document.createElement("input");
    const input2 = document.createElement("input");
    const input3 = document.createElement("input");
    const button = document.createElement("button");
    const p1 = document.createElement("p");
    const p2 = document.createElement("p");
    const p3 = document.createElement("p");
    const czas = document.createElement("p");
    const liczbaBomb = document.createElement("p");
    czas.innerText = "Czas gry:  ";
    czas.setAttribute("id", "czas");
    p1.innerText = "Wysokość planszy: ";
    p2.innerText = "Szerokość planszy: ";
    p3.innerText = "Ilość bomb: ";
    button.innerText = "Generuj";
    button.id = "submit";
    input1.id = "height";
    input2.id = "width";
    liczbaBomb.id = "liczbaBomb";
    input3.id = "bombs";
    input1.addEventListener("input", (e) => {
      this.handleOnChange(input1);
    });

    input2.addEventListener("input", (e) => {
      this.handleOnChange(input2);
    });
    input3.addEventListener("input", (e) => {
      this.handleOnChange(input3);
    });
    button.setAttribute("type", "submit");
    formularz.setAttribute("id", "form");
    input1.setAttribute("type", "text");
    input2.setAttribute("type", "text");
    input3.setAttribute("type", "text");

    p1.appendChild(input1);
    p2.appendChild(input2);
    p3.appendChild(input3);
    formularz.appendChild(p1);
    formularz.appendChild(p2);
    formularz.appendChild(p3);
    formularz.appendChild(button);
    this.main.appendChild(formularz);
    this.main.appendChild(czas);
    this.main.appendChild(liczbaBomb);

    document
      .getElementById("submit")
      .addEventListener("click", (e) => this.handleForm(e));
  }
  startTimer() {
    setInterval(() => {
      this.timer += 1;
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

    // this.wysokoscPlanszy = Number(document.getElementById("height").value);
    // this.szerokoscPlanszy = Number(document.getElementById("width").value);

    // this.liczbaBomb = Number(document.getElementById("bombs").value);
    this.wysokoscPlanszy = 10;
    this.szerokoscPlanszy = 10;
    this.liczbaBomb = 10;
    this.startTimer();

    this.bombPositions();
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
  }
  renderBombNumber() {
    let liczba = 0;
    liczba = this.arrPlansza.reduce((acc, cur) => {
      if (!cur.flag) return (acc += cur.bomb);
      else return (acc += 0);
    }, 0);

    document.getElementById("liczbaBomb").innerText = " ";
    document.getElementById(
      "liczbaBomb"
    ).innerText = `Pozostało bomb: ${liczba}`;
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
        kafelek.id = `${index * 20}&${l * 20}`;
        kafelek.setAttribute("dataID", `k-${i}`);
        kafelek.classList.add("NO");
        kafelek.classList.add("kafelek");
        kafelek.style.top = `${index * 20}px`;
        kafelek.style.left = `${l * 20}px`;
        if (this.arrPlansza[i].bomb === 1) {
          kafelek.style.backgroundColor = "red";
        }
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

  nearBombs(div_le) {
    // this.liczbaBombObok = 0;
    // let puste = [];
    // this.allChecked = false;

    // const index = this.arrPlansza.findIndex(
    //   (el) => el.row === wiersz && el.col === kolumna
    // );
    // this.kafel = document.getElementById(`k-${index}`);

    // for (let i = -1; i < 2; i++) {
    //   for (let j = -1; j < 2; j++) {
    //     let element = this.arrPlansza.find(
    //       (el) => el.row === wiersz + i && el.col === kolumna + j
    //     );
    //     // const indexEl = this.arrPlansza.findIndex(
    //     //   (el) => el.row === wiersz + i && el.col === kolumna + j
    //     // );
    //     if (element && !element.checked) {
    //       if (element.bomb === 1) {
    //         this.liczbaBombObok++;
    //       }

    //       if (element.bomb === 0) puste.push(element);
    //     }
    //     if (i == 1 && j == 1) {
    //       this.allChecked = true;
    //     }
    //   }
    // }
    // // this.checkIfAllChecked();
    // let i = 0;
    // while (i < puste.length) {
    //   if (this.liczbaBombObok === 0) {
    //     this.kafel.style.backgroundColor = "darkgrey";
    //     console.log(puste);
    //     this.nearBombs(puste[i].row, puste[i].col);
    //   } else {
    //     this.kafel.innerText = this.liczbaBombObok;
    //   }
    //   i++;
    // }

    // if (div_le.style.backgroundImage == 'url("img/flaga.PNG")') {
    //   bombs_left++;
    //   document.getElementById("p_BL").innerText =
    //     "Bombs to defuse left: " + bombs_left + ".";
    // }
    //REFACTOR THIS!!!!!
    const bombArr = this.arrPlansza.filter((el) => el.bomb === 1);

    let checking = function (idElToCheck) {
      for (let i = 0; i < bombArr.length; i++) {
        let id = bombArr[i].row * 20 + "&" + bombArr[i].col * 20;

        if (id == document.getElementById(idElToCheck).id) {
          return true;
        }
      }
      return false;
    };

    let a = 0;

    let tab_cords = div_le.id.split("&");
    let x = parseInt(tab_cords[0]);
    let y = parseInt(tab_cords[1]);

    div_le.classList.remove("NO");
    div_le.classList.add("YES");

    let bexpieczne = [];

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let xi = x + i * 20;
        let yj = y + j * 20;
        const curEl = document.getElementById(xi + "&" + yj);

        if (curEl !== null && curEl.classList.contains("NO")) {
          bexpieczne.push({ xi: xi, yj: yj });
        }
      }
    }

    for (let i = 0; i < bexpieczne.length; i++) {
      let flag_FE = true;

      bombArr.forEach(function (object) {
        if (flag_FE) {
          if (
            object.row * 20 == bexpieczne[i].xi &&
            object.col * 20 == bexpieczne[i].yj
          ) {
            a++;
            flag_FE = false;
          }
        }
      });
    }

    for (let i = 0; i < bexpieczne.length; i++) {
      if (!checking(document.getElementById(x + "&" + y).id) && a == 0) {
        const thisBInder = this;
        thisBInder.nearBombs(
          document.getElementById(bexpieczne[i].xi + "&" + bexpieczne[i].yj)
        );
      }
    }

    div_le.style.backgroundColor = "lightgrey";
    if (a != 0) div_le.innerText = a;
  }

  // checkIfAllChecked() {

  // }
  handleKafelekClick(e) {
    // try {
    if (!e.target.classList.contains("kafelek")) return;
    const kafelek = e.target.closest(".kafelek");

    const id = Number(kafelek.getAttribute("dataID").split("-")[1]);

    let czyBomba = this.arrPlansza[id].bomb;
    if (czyBomba === 1) {
      this.looseGame();
      return;
    }

    this.nearBombs(kafelek);
    // } catch (error) {
    //   alert(error.message);
    // }
  }
  handleRMBClick(e) {
    e.preventDefault();
    if (!e.target.classList.contains("kafelek")) return;
    const kafelek = e.target.closest(".kafelek");

    const id = Number(kafelek.getAttribute("dataID").split("-")[1]);
    kafelek.style.backgroundColor = "green";

    let czyBomba = this.arrPlansza[id].bomb;
    if (czyBomba) {
      this.arrPlansza[id].flag = true;
      this.renderBombNumber();
    }
    console.log(id);
  }
  looseGame() {
    alert("Przegrałeś!");
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
}

const game = new Game();
