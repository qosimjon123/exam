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
//-------------------------------------------------Добавление Записей----------------------------------------------------------

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
    let result = [];
    for (let i = 0 ; i < data.length; i++ ) {
        if(result.length == 5) {
            parse.push(result);
            result = [];
        }
        else {
            result.push(data[i])
        }
    }
    
}
let currentPage = 0;
let pagBtns = document.querySelector('.pagination-btn');
pagBtns.addEventListener('click')
function paginationBtnActived () {

}
//-------------------------------------------------Добавление Записей----------------------------------------------------------

function getMainTable() {
    // Поменяй ссылку на свою
    let url = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=${apiKey}`;
    getRequestMainTable(url, 'GET')
        .then((data) => {
            return data.json()
        })
        .then(data => { parseData(data); addHint(data); 
            //getMainObject(data); 
            saveToSessionStorage(data) }
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
        fillTable(data);
    }
    else {
        let newData = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].name == inputValue) {
                newData.push(data[i]);
            }
        }
        if (newData.length == 0) {
            console.error("По вашему запросу ничего не найдено. Плак-плак");
            let activateMsg = document.querySelector(".alert-msg")
            activateMsg.classList.remove("d-none");
            setTimeout(() => activateMsg.classList.add("d-none"), 2000)
        }
        else {
            fillTable(newData);
        }
    }
}

filterBtn.addEventListener('click', searchFromBtn)
function addHint(data) {
    let getData = document.querySelector('#routes-list');
    for (let i = 0; i < data.length; i++) {
        let string = document.createElement('option');
        string.textContent = data[i].name;
        getData.append(string);
    }
}
// ------------------------------------------------ЗАГРУЗКА----------------------------------------------------------- 
window.onload = function () {
    getMainTable();

};
