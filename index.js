'use strict';
//-------------------------------------------------BOOTSTRAP----------------------------------------------------------

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
    //console.log(BdForLang)
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
    } else

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
const workContainer = document.querySelector('.opit-raboty');
let container;

workContainer.addEventListener("change", (e) => {
    let firstValue = e.target.value;
    if (e.target.classList.contains()) {

    }
})



// ------------------------ВСЕ ЧТО СВЯЗАНО С ОТПРАВКОЙ ФОРМЫ НА СЕРВЕР + ОБЩАЯ ФУНКЦИЯ ДЛЯ ВСЕХ ТИПОВ ЗАПРОСА---------------------------------

async function requests(url, data, method) {
    if (method == "POST") {
        return await fetch(url, {
            method: method,
            body: data
        })
            .then(Response => Response.json())
            .catch((e) => console.log("Error in " + method))
    } else if (method == "GET") {
        return await fetch(url)
            .then(Response => Response.json())
            .catch((e) => console.log("Error in " + method))
    } else if (method == "PUT") {
        return await fetch(url, {
            method: method,
            body: data
        })
            .then(Response => Response.json())
            .catch((e) => console.log("Error in " + method))
    } else if (method == "DELETE") {
        return await fetch(url, {
            method: method,
            body: data
        })
            .then(Response => Response.json())
            .catch((e) => console.log("Error in " + method))
    }
}
// ----------------------------------------MODAL WINDOW TO SEND-------------------------------------------------------
function getRouteNameById(data) {
    let local = JSON.parse(sessionStorage.getItem('data'));
    console.log(local[5].name)
    for (let i = 0; i < local.length; i++) {
        if (local[i].id == data) {
            console.log(local[i].name);
            return local[i].name;
        }
    }
}
let globalPrice = 0;
document.querySelector('.gid-fillbody').addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        // Получение родительской строки (tr)

        let row = e.target.closest('tr');

        // --------------------------------------------получение данных из строки-------------------------------------------------
        let gidId = row.querySelector('.id-git-route');
        let routeId = gidId.getAttribute('data-route-id');
        let gidName = row.querySelector('.FIO');
        let routeName = getRouteNameById(Number(routeId));
        // --------------------------------------------ОБНОВИТЬ И СБРОС ДЛЯ КАЖДОЙ СТРОКИ-------------------------------------------------
        let duration = document.querySelector(".one");
        duration.selected = true;
        document.querySelector('.excursion-start').value = "";
        document.querySelector('#flexCheckDefault').checked = false;
        let peopleCount = document.querySelector('.people-amount');
        peopleCount.value = 1;
        let gidPrice = row.querySelector(".PricePerHour")

        // --------------------------------------------получение данных из модального окна + textcontent-------------------------------------------------
        let fioField = document.querySelector('.gid-name');
        fioField.textContent = gidName.textContent;
        let routeField = document.querySelector('.excursion-name');
        routeField.textContent = routeName;
        let nadbavka = document.querySelector('.option-discount');
        nadbavka.textContent = 0 + " ₽";
        let price = document.querySelector('.excursion-price');
        price.textContent = gidPrice.textContent;
        globalPrice = parseInt(gidPrice.textContent);
        // Ваш код обработки клика на кнопку
        //console.log('Кнопка в строке с data-id ' + dataId + ' была нажата.');

    }
})


//--------------------------------------------------УСЛОВИИ ДЛЯ МОДАЛЬНОГО ОКНА ----------------------------------------------------------
function conditionOfModalForm() {
    //---------------DATE-------------------
    function addMonths(date, months) {
        let newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + months);
        return newDate;
    }

    let dateInput = document.querySelector('.datepicker');
    let today = new Date();
    let todayString = today.toISOString().split('T')[0];

    let endDate = addMonths(today, 3);
    let endDateString = endDate.toISOString().split('T')[0];
    dateInput.setAttribute("value", todayString)
    dateInput.setAttribute("min", todayString);
    dateInput.setAttribute("max", endDateString);

    // console.log(todayString, endDateString);

    //---------------CLOCK-------------------




}
// ------------------------------------------------ADD EVENTLISTENER FOR FORM FIELDS---------------------------------------------------------- 
function calculatePrice(guideServiceCost, hoursNumber, isThisDayOff, isItMorning, isItEvening, numberOfVisitors, nadbavka) {
    let basePrice = guideServiceCost * hoursNumber * isThisDayOff;
    let morningSurcharge = isItMorning ? 400 : 0;
    let eveningSurcharge = isItEvening ? 1000 : 0;
    let visitorsSurcharge = 0;

    if (numberOfVisitors >= 1 && numberOfVisitors <= 5) {
        visitorsSurcharge = 0;
    } else if (numberOfVisitors > 5 && numberOfVisitors <= 10) {
        visitorsSurcharge = 1000;
    } else if (numberOfVisitors > 10 && numberOfVisitors <= 20) {
        visitorsSurcharge = 1500;
    }

    let totalPrice = basePrice + morningSurcharge + eveningSurcharge + visitorsSurcharge;
    return totalPrice + nadbavka;
}
function changePrice(sum, nadbavka) {
    let guideServiceCost = document.querySelector('.excursion-price');
    guideServiceCost.textContent = sum + " ₽";

    let nadbavkaElement = document.querySelector('.option-discount');
    nadbavkaElement.textContent = nadbavka + " ₽";
}

function isHoliday(date) {
    const holidays = [
        new Date('2024-01-01'), // Новый год
        new Date('2024-03-08'), // Международный женский день
        new Date('2024-05-01'), // Праздник труда
        new Date('2024-05-09'), // День Победы
        new Date('2024-06-12'), // День России
        // далее по усмотрению
    ];
    for (const holiday of holidays) {
        if (date.toISOString().split('T')[0] == holiday.toISOString().split('T')[0] || date.getDay() == 6 || date.getDay() == 0) {
            console.log('Сегодня праздничный день!');
            return true;
        }
    }
    return false;
}
function hourToMinute(hour) {
    let arr = hour.split(":");
    return Number(arr[0] * 60) + Number(arr[1]);
}
function isMorning(time) {
    let timeStart = new Date('2000-01-01T09:00').toISOString().split('T')[1];
    timeStart = hourToMinute(timeStart);
    let timeEnd = new Date('2000-01-01T12:00').toISOString().split('T')[1];
    timeEnd = hourToMinute(timeEnd);
    time = hourToMinute(time.toISOString().split('T')[1]);
    if (timeStart < time && time < timeEnd) {
        return true;
    }
    return false;
}
function isEvening(time) {
    let timeStart = new Date('2000-01-01T20:00').toISOString().split('T')[1];
    timeStart = hourToMinute(timeStart);
    let timeEnd = new Date('2000-01-01T23:00').toISOString().split('T')[1];
    timeEnd = hourToMinute(timeEnd);
    time = hourToMinute(time.toISOString().split('T')[1]);
    if (timeStart < time && time < timeEnd) {
        return true;
    }
    return false;
}

document.querySelector('.add-event').addEventListener('change', (e) => {

    let day = document.querySelector(".datepicker").value;
    let hoursNumber = document.querySelector('.hours-selected').value;
    let countExcurs = document.querySelector(".people-amount").value;
    let optionOne = false;
    let optionTwo = false;
    let isThisDayOff = false;
    let isItMorning = false;
    let isItEvening = false;
    let nadbavka = 0;
    let sum = 0;

    if (e.target.classList.contains('datepicker')) {
        isThisDayOff = isHoliday(new Date(`${day}`))
        console.log(day)
        console.log(isThisDayOff)
    } else if (e.target.classList.contains('excursion-start')) {
        let date = document.querySelector(".datepicker").value;
        let selectedTime = e.target.value;
        let currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let selectedTimeObj = new Date(`2000-01-01T${selectedTime}`);
        isItEvening = isEvening(selectedTimeObj);
        isItMorning = isMorning(selectedTimeObj);
        console.log(isItEvening);
        let currentTimeObj = new Date(`2000-01-01T${currentTime}`);

        let currentDate = new Date().toISOString().split('T')[0];

        if (currentDate == date && currentTimeObj > selectedTimeObj) {
            let timeDifference = (hourToMinute(currentTimeObj
                .toISOString().split('T')[1]) - hourToMinute(selectedTimeObj
                    .toISOString().split('T')[1]));

            if (timeDifference > 30 && timeDifference <= 60) {
                optionOne = true;
                console.log("Условие выполнено");
            } else {
                console.log("Время меньше чем текущей времени или условие не выполнено");
            }
        }


    } else if (e.target.classList.contains('hours-selected')) {

        console.log(hoursNumber)
    } else if (e.target.classList.contains('people-amount')) {
        let optionChecked = document.querySelector(".option-name").checked;
        console.log(optionChecked)
        if (optionChecked) {
            nadbavka += e.target.value * 500;
        }
        else { 
            console.log(optionChecked)
        }
        countExcurs = e.target.value;
    } else if (e.target.classList.contains('option-name')) {
        let event = e.target.checked;
        let count = document.querySelector(".people-amount").value;

        if (event) {
            nadbavka += count * 500;
        } else {
            nadbavka = 0;
        }
    }
    let holidate = isThisDayOff ? 1.5 : 1;
    sum = calculatePrice(globalPrice, Number(hoursNumber), holidate, isItMorning, isItEvening, Number(countExcurs), nadbavka);
    // sum = gui
    changePrice(sum, nadbavka);
})
// ------------------------------------------------ЗАГРУЗКА----------------------------------------------------------- 
window.onload = function () {
    getMainTable();
    conditionOfModalForm();
};
