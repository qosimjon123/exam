'use strict';
//-------------------------------------------------MAP----------------------------------------------------------

let map;

DG.then(function () {
    map = DG.map('map', {
        center: [54.98, 82.89],
        zoom: 13,
    });

    DG.marker([54.98, 82.89]).addTo(map).bindPopup('Вы кликнули по мне!');
});
//-------------------------------------------------MAP----------------------------------------------------------
let apiKey = "3d905a6f-cb29-44b4-8988-6582e1783fb9";
function saveToSessionStorage(data) {

    sessionStorage.setItem("data", JSON.stringify(data));

}
let getRequestMainTable = async function (url, method) {
    if (method == 'GET') {
        return await fetch(url, {

        })

    }
};
// --------------------------------------------------------таблица с гидами---------------------------------------------------------------
function getGidTable(id) {
    //Поменяй ссылку на свою

    let cur_url = new URL(`http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${id}/guides?api_key=${apiKey}`);
    getRequestMainTable(cur_url, 'GET')
        .then((data) => {
            return data.json()
        })
        .then(data => { fillGitTable(data); fillSelectlang(data) }
        )
        .catch(error => console.error(`Something went wrong: ${error}`))

}
//   ДЛЯ ОПРЕДЕЛЕНИЯ ГОД/ЛЕТ/ГОДА
function plural(number, titles) {
    let cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

let declension = ['год', 'года', 'лет'];
//-------------------------------------------------
let BdForLang = new Set();
function fillSelectlang(data) {
    console.log(BdForLang)
    let sessionDb = new Set();

    for (let i = 0; i < data.length; i++) {
        sessionDb.add(data[i].language);
    }

    let selectLang = document.querySelector('.lang-gid');


    selectLang.innerHTML = "";


    let header = document.createElement('option');
    header.setAttribute("disabled", true);
    header.setAttribute("selected", true);
    header.textContent = "Выбрать язык";
    selectLang.appendChild(header);

    for (let lang of sessionDb) {
        if (BdForLang.has(lang)) {
            console.log(lang)
        } else {
            BdForLang.add(lang);
        }
    }

    BdForLang.forEach(value => {
        let newOption = document.createElement('option');
        newOption.value = value;
        newOption.textContent = value;
        selectLang.append(newOption);
    })
}
function fillGitTable(data) {
    let tableBody = document.querySelector('.gid-fillbody');
    let template = document.querySelector('.template-row-gid');

    for (let i = 0; i < data.length; i++) {
        let clonedRow = template.content.cloneNode(true);

        let id = clonedRow.querySelector('.id-git-route');
        let Fio = clonedRow.querySelector('.FIO');
        let language = clonedRow.querySelector('.language');
        let workExperience = clonedRow.querySelector('.workExperience');
        let PricePerHour = clonedRow.querySelector('.PricePerHour');

        id.textContent = data[i].id;
        id.setAttribute('data-route-id', data[i].route_id);
        Fio.textContent = data[i].name;
        let pluralDetect = plural(data[i].workExperience, declension);
        workExperience.textContent = data[i].workExperience + ` ${pluralDetect}`;
        language.textContent = data[i].language;
        PricePerHour.textContent = data[i].pricePerHour + " ₽";

        tableBody.appendChild(clonedRow);
    }
}


function DeleteGid(routeId, method) {
    let table = document.querySelector(".gid-fillbody");
    let currentRouteId = table.querySelectorAll(".id-git-route")



    for (const route of currentRouteId) {

        let route2 = route.getAttribute('data-route-id');

        if (route2 == routeId) {
            route.closest('tr').remove();
        }
    }


}

//-------------------------------------------------Добавление Записей----------------------------------------------------------


// обязательное анализ кода и исправление некоторых данных
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
function fillTable(data) {
    let tableBody = document.querySelector('.fillbody');
    let template = document.querySelector('.template-row');
    tableBody.textContent = "";
    if (data == "netdanix") {
        return
    }
    for (let i = 0; i < data.length; i++) {
        let clonedRow = template.content.cloneNode(true);
        let tr = clonedRow.querySelector("#id-tr");
        tr.setAttribute('data-id', `${JSON.stringify(data[i].id)}`);
        let route = clonedRow.querySelector('.route');
        let desc = clonedRow.querySelector('.desc');
        let mainObjects = clonedRow.querySelector('.mainObjects');

        route.textContent = data[i].name;
        desc.textContent = data[i].description;
        mainObjects.textContent = data[i].mainObject;

        tableBody.appendChild(clonedRow);
    }

}
let parse = [];
function parseData(data) {
    parse = [];
    currentPage = 0;
    let result = [];
    for (let i = 0; i < data.length; i++) {
        if (result.length == 5) {
            parse.push(result);
            result = [];
        }
        else {
            result.push(data[i])
        }
    }
    parse.push(result);
    updateContent();

}

let currentPage = 0;
let pagBtns = document.querySelector('.pagination-btn');

pagBtns.addEventListener('click', paginationBtnActived);

function paginationBtnActived(event) {
    if (event.target.textContent === "Далее") {
        if (currentPage < parse.length - 1) {
            currentPage++;
            updateContent();
        }
    } else if (event.target.textContent === "Назад") {
        if (currentPage > 0) {
            currentPage--;
            updateContent();
        }
    }

    // Обновление состояния кнопок
    updateButtonsState();
}

function updateContent() {

    //console.log('Обновление содержимого для страницы', currentPage);
    fillTable(parse[currentPage]);
}
// ---------------------------------ONLY NEXT OR PREV BUTTONS------------------------------------ 
function updateButtonsState() {
    // Обновление состояния кнопок
    let nextBtn = document.querySelector('.btn-next');
    let prevBtn = document.querySelector('.btn-prev');

    if (currentPage === 0) {
        prevBtn.classList.add('disabled');
    } else {
        prevBtn.classList.remove('disabled');
    }

    if (currentPage === parse.length - 1) {
        nextBtn.classList.add('disabled');
    } else {
        nextBtn.classList.remove('disabled');
    }
}
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------


//-------------------------------------------------Добавление Записей----------------------------------------------------------

function getMainTable() {
    let url = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=${apiKey}`;
    getRequestMainTable(url, 'GET')
        .then((data) => {
            return data.json()
        })
        .then(data => {
            parseData(data); addHint(data);

            saveToSessionStorage(data)
        }
        )
        .catch(error => console.error(`Something went wrong: ${error}`))
}
//--------------------------------------------------SEARCHROUTEBLOCK----------------------------------------------------------
let filterBtn = document.querySelector('.search-btn');
function searchFromBtn() {
    let inputValue = document.querySelector('#input-for-search').value;
    let data = JSON.parse(sessionStorage.getItem('data'));
    if (inputValue == "") {
        console.log("Input field is empty");
        parseData(data);
    }
    else {
        let newData = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].name == inputValue) {
                newData.push(data[i]);
            }
        }
        if (newData.length == 0) {
            let activateMsg = document.querySelector(".alert-msg")
            activateMsg.classList.remove("d-none");
            setTimeout(() => activateMsg.classList.add("d-none"), 2000)
        }
        else {
            parseData(newData);
        }
    }
}
// ------------------------------------------------Кнопка для выборанного маршрута----------------------------
let chosenRoute = new Set();
document.querySelector('.fillbody').addEventListener('click', function (event) {
    // Проверка, что клик был по кнопке
    if (event.target.tagName === 'BUTTON') {
        // Получение родительской строки (tr)
        let row = event.target.closest('tr');

        // Получение значения атрибута data-id из строки
        let dataId = row.getAttribute('data-id');

        // Ваш код обработки клика на кнопку
        //console.log('Кнопка в строке с data-id ' + dataId + ' была нажата.');
        if (chosenRoute.has(dataId)) {
            DeleteGid(dataId, 'deluseroute');
            chosenRoute.delete(dataId);

            if (chosenRoute.size == 0) {
                let delElem = document.querySelector('.chosen-gids');
                delElem.classList.remove('d-none')


            }
            //console.log(chosenRoute);

        } else {
            chosenRoute.add(dataId);
            if (chosenRoute.size > 0) {
                let delElem = document.querySelector('.chosen-gids');
                delElem.classList.add('d-none')


            }
            getGidTable(dataId);
            //console.log(chosenRoute);
        }

    }

});
// ------------------------------------------------Кнопка для выборанного маршрута----------------------------


filterBtn.addEventListener('click', searchFromBtn)
function addHint(data) {
    let getData = document.querySelector('#routes-list');
    for (let i = 0; i < data.length; i++) {
        let string = document.createElement('option');
        string.textContent = data[i].name;
        getData.append(string);
    }
}
// ------------------------------------------------СЕКЦИЯ ДЛЯ ВЫБОРА ЯЗЫКА ГИДА----------------------------------------------------------- 
let body = document.querySelector('.gid-fillbody');
let elems;
function hideElement(element) {
    if (!element.classList.contains('d-none')) {
        element.classList.add('d-none');
    }
}

function showElement(element) {
    let delElem = document.querySelector('.chosen-gids');
    delElem.classList.add('d-none')
    if (element.classList.contains('d-none')) {
        element.classList.remove('d-none');
    }
}
document.querySelector('.lang-gid').addEventListener('change', (e) => {
    let value = e.target.value;
    elems = body.querySelectorAll('.git-table');
    let foundResults = false;  // Флаг, указывающий, были ли найдены результаты

    for (let i = 0; i < elems.length; i++) {
        let langGid = elems[i].querySelector('.language').textContent;
        if (langGid === value) {
            showElement(elems[i]);
            foundResults = true;
        } else {
            hideElement(elems[i]);
        }
    }

    // Проверяем, были ли найдены результаты
    if (!foundResults) {
        console.log('Нет результатов для выбранного языка.');
        let delElem = document.querySelector('.chosen-gids');
        delElem.classList.remove('d-none')
    }
});
// ------------------------------------------------ОБРАБОТЧИК ДЛЯ ПЕЧАТИ ОПЫТ РАБОТЫ---------------------------------------------------------- 
const workFromForm = document.getElementById('work-from');
const workToForm = document.getElementById('work-to');

// ------------------------------------------------ЗАГРУЗКА----------------------------------------------------------- 
window.onload = function () {
    getMainTable();

};
