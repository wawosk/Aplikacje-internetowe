let zadania = JSON.parse(localStorage.getItem("zadania")) || []; // Tablica do przechowywania zadań

function dodajAkapit() {
    let tresc = document.getElementById("tekst").value.trim();
    let data = document.getElementById("data").value;

    // Walidacja
    if (tresc.length < 3 || tresc.length > 255) {
        alert("Treść zadania musi mieć od 3 do 255 znaków.");
        return;
    }

    if (data && new Date(data) < new Date()) {
        alert("Data musi być pusta lub w przyszłości.");
        return;
    }

    const nowyAkapit = document.createElement("div");
    nowyAkapit.classList.add("akapit");

    const tekstAkapitu = document.createElement("p");
    tekstAkapitu.textContent = `${tresc}`;

    const dataAkapitu = document.createElement("p");
    dataAkapitu.textContent = `Termin: ${data}`;
    dataAkapitu.style.fontStyle = "italic";

    const usunButton = document.createElement("button");
    usunButton.textContent = "Usuń";
    usunButton.classList.add("usun-button");

    usunButton.onclick = function () {
        if (confirm("Czy na pewno chcesz usunąć to zadanie?")) {
            nowyAkapit.remove();
            usunZadanieZStorage(tresc, data);
        }
    };

    nowyAkapit.onclick = function (event) {
        if (event.target === usunButton) return;

        const edytujTekst = document.createElement("input");
        edytujTekst.type = "text";
        edytujTekst.value = tresc;

        const edytujDate = document.createElement("input");
        edytujDate.type = "date";
        edytujDate.value = data;

        nowyAkapit.replaceChild(edytujTekst, tekstAkapitu);
        nowyAkapit.replaceChild(edytujDate, dataAkapitu);

        const zapiszZmiany = () => {
            const nowaTresc = edytujTekst.value.trim();
            const nowaData = edytujDate.value;

            // Walidacja edytowanej treści
            if (nowaTresc.length < 3 || nowaTresc.length > 255) {
                alert("Treść zadania musi mieć od 3 do 255 znaków.");
                return;
            }

            if (nowaData && new Date(nowaData) < new Date()) {
                alert("Data musi być pusta lub w przyszłości.");
                return;
            }

            // Uaktualniamy teksty
            tekstAkapitu.textContent = nowaTresc;
            dataAkapitu.textContent = `Termin: ${nowaData}`;
            nowyAkapit.replaceChild(tekstAkapitu, edytujTekst);
            nowyAkapit.replaceChild(dataAkapitu, edytujDate);

            // Aktualizujemy dane w localStorage
            aktualizujZadanieWStorage(tresc, data, nowaTresc, nowaData);
            // Ustawiamy nowe wartości
            tresc = nowaTresc;
            data = nowaData;
        };

        edytujTekst.addEventListener("blur", zapiszZmiany);
        edytujTekst.addEventListener("keypress", (e) => {
            if (e.key === "Enter") zapiszZmiany();
        });

        edytujDate.addEventListener("blur", zapiszZmiany);
        edytujDate.addEventListener("keypress", (e) => {
            if (e.key === "Enter") zapiszZmiany();
        });
    };

    nowyAkapit.appendChild(tekstAkapitu);
    nowyAkapit.appendChild(dataAkapitu);
    nowyAkapit.appendChild(usunButton);

    document.getElementById("kontener").appendChild(nowyAkapit);

    zapiszDoStorage(tresc, data); // Zapisanie nowego zadania do localStorage
    zadania.push({ tresc, data }); // Dodanie nowego zadania do lokalnej tablicy

    document.getElementById("tekst").value = "";
    document.getElementById("data").value = "";
}

function wyszukajZadania() {
    const query = document.getElementById("wyszukiwarka").value.toLowerCase();
    const zadaniaDOM = document.querySelectorAll(".akapit");

    zadaniaDOM.forEach(zadanie => {
        const tekst = zadanie.querySelector("p").textContent.toLowerCase();

        if (query.length < 2) {
            // Jeśli pole wyszukiwania jest puste lub ma mniej niż 2 znaki, pokazujemy wszystkie zadania
            zadanie.style.display = "flex";
            const akapitTekst = zadanie.querySelector("p");
            akapitTekst.innerHTML = akapitTekst.textContent; // Reset stylu i podświetlenia
        } else {
            const matches = tekst.includes(query);
            zadanie.style.display = matches ? "flex" : "none";

            // Czyszczenie wcześniejszych podświetleń
            const akapitTekst = zadanie.querySelector("p");
            akapitTekst.innerHTML = akapitTekst.textContent;

            // Podświetlenie wyszukiwanego tekstu
            if (matches) {
                const regex = new RegExp(`(${query})`, "gi");
                akapitTekst.innerHTML = akapitTekst.textContent.replace(regex, `<span class="highlight">$1</span>`);
            }
        }
    });
}

// Funkcje do obsługi localStorage
function zapiszDoStorage(tresc, data) {
    zadania.push({ tresc, data }); // Dodanie nowego zadania do lokalnej tablicy
    localStorage.setItem("zadania", JSON.stringify(zadania));
}

function usunZadanieZStorage(tresc, data) {
    zadania = zadania.filter(z => z.tresc !== tresc || z.data !== data);
    localStorage.setItem("zadania", JSON.stringify(zadania));
}

function aktualizujZadanieWStorage(staraTresc, staraData, nowaTresc, nowaData) {
    zadania = zadania.map(zadanie =>
        (zadanie.tresc === staraTresc && zadanie.data === staraData)
            ? { tresc: nowaTresc, data: nowaData }
            : zadanie
    );
    localStorage.setItem("zadania", JSON.stringify(zadania));
}

// Funkcja inicjalizująca
function init() {
    zadania.forEach(zadanie => {
        const nowyAkapit = document.createElement("div");
        nowyAkapit.classList.add("akapit");

        const tekstAkapitu = document.createElement("p");
        tekstAkapitu.textContent = `${zadanie.tresc}`;

        const dataAkapitu = document.createElement("p");
        dataAkapitu.textContent = `Termin: ${zadanie.data}`;
        dataAkapitu.style.fontStyle = "italic";

        const usunButton = document.createElement("button");
        usunButton.textContent = "Usuń";
        usunButton.classList.add("usun-button");

        usunButton.onclick = function () {
            if (confirm("Czy na pewno chcesz usunąć to zadanie?")) {
                nowyAkapit.remove();
                usunZadanieZStorage(zadanie.tresc, zadanie.data);
            }
        };

        nowyAkapit.onclick = function (event) {
            if (event.target === usunButton) return;

            const edytujTekst = document.createElement("input");
            edytujTekst.type = "text";
            edytujTekst.value = zadanie.tresc;

            const edytujDate = document.createElement("input");
            edytujDate.type = "date";
            edytujDate.value = zadanie.data;

            nowyAkapit.replaceChild(edytujTekst, tekstAkapitu);
            nowyAkapit.replaceChild(edytujDate, dataAkapitu);

            const zapiszZmiany = () => {
                const nowaTresc = edytujTekst.value.trim();
                const nowaData = edytujDate.value;

                // Walidacja edytowanej treści
                if (nowaTresc.length < 3 || nowaTresc.length > 255) {
                    alert("Treść zadania musi mieć od 3 do 255 znaków.");
                    return;
                }

                if (nowaData && new Date(nowaData) < new Date()) {
                    alert("Data musi być pusta lub w przyszłości.");
                    return;
                }

                tekstAkapitu.textContent = nowaTresc;
                dataAkapitu.textContent = `Termin: ${nowaData}`;
                nowyAkapit.replaceChild(tekstAkapitu, edytujTekst);
                nowyAkapit.replaceChild(dataAkapitu, edytujDate);

                // Aktualizujemy dane w localStorage
                aktualizujZadanieWStorage(zadanie.tresc, zadanie.data, nowaTresc, nowaData);
                zadanie.tresc = nowaTresc; // Aktualizujemy lokalnie
                zadanie.data = nowaData; // Aktualizujemy lokalnie
            };

            edytujTekst.addEventListener("blur", zapiszZmiany);
            edytujTekst.addEventListener("keypress", (e) => {
                if (e.key === "Enter") zapiszZmiany();
            });

            edytujDate.addEventListener("blur", zapiszZmiany);
            edytujDate.addEventListener("keypress", (e) => {
                if (e.key === "Enter") zapiszZmiany();
            });
        };

        nowyAkapit.appendChild(tekstAkapitu);
        nowyAkapit.appendChild(dataAkapitu);
        nowyAkapit.appendChild(usunButton);

        document.getElementById("kontener").appendChild(nowyAkapit);
    });
}

window.onload = init; // Inicjalizacja po załadowaniu strony
