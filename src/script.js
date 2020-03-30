"use strict";

//Элементы страницы

const formSearch = document.querySelector(".form-search"),
    inputCitiesFrom = formSearch.querySelector(".input__cities-from"),
    dropdownCitiesFrom = formSearch.querySelector(".dropdown__cities-from"),
    inputCitiesTo = formSearch.querySelector(".input__cities-to"),
    dropdownCitiesTo = formSearch.querySelector(".dropdown__cities-to"),
    inputDateDepart = formSearch.querySelector(".input__date-depart");

//Данные
const citiesApi = "http://api.travelpayouts.com/data/ru/cities.json",
    proxy = "https://cors-anywhere.herokuapp.com/",
    API_KEY = "f7a3c36923af8b4859f9b0e4030a9fe6",
    calendar = "http://min-prices.aviasales.ru/calendar_preload";
    //citiesApi = "dataBase/cities.json"

let city = [];

//ФУНКЦИИ

const getData = (url, callback) => {
    const request = new XMLHttpRequest();

    request.open("GET", url);
    
    request.addEventListener("readystatechange", () => {
        if (request.readyState !== 4) return;

        if (request.status === 200) {
            callback(request.response);
        } else {
            console.error(request.status);
        }
    });

    request.send();
};

//Функция отбора городов по вводимомой строке в инпут

const showCity = (input, list) => {
    list.textContent = "";

    if (input.value !== "") {   
        const filterCity = city.filter((item) => {
                const fixedItem = item.name.toLowerCase();
                return fixedItem.includes(input.value.toLowerCase());
        });

        filterCity.forEach((item) => {
            const li = document.createElement("li");
            li.classList.add("dropdown__city");
            li.textContent = item.name;
            list.append(li);
        });
    }
};

//Функция по присваиванию города из списка в инпут

const selectCity = (event, input, list) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === "li") {
        input.value = target.textContent;
        list.textContent = "";
    }
};

const renderCheapDay = (cheapTicket) => {
    console.log(cheapTicket);
};

const renderCheapYear = (cheapTickets) => {
    console.log(cheapTickets);
};

const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices;

    const cheapTicketDay = cheapTicketYear.filter((item) => {
        return item.depart_date === date;
    });

    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicketYear);
};

//Обработчики событий

inputCitiesFrom.addEventListener("input", () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener("input", () => {
    showCity(inputCitiesTo, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener("click", (event) => {
    selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener("click", (event) => {
    selectCity(event, inputCitiesTo, dropdownCitiesTo);
});

formSearch.addEventListener("submit", (event) => {
    event.preventDefault();

    const cityFrom = city.find((item) => {
        return inputCitiesFrom.value === item.name;
    });
    const cityTo = city.find((item) => {
        return inputCitiesTo.value === item.name;
    });

    const formData = {
        from: cityFrom.code,
        to: cityTo.code,
        when: inputDateDepart.value,
    };

    const requestData = `?depart_date=${formData.when}&origin=${formData.from}&destination=${formData.to}&one_way=true&toke=${API_KEY}`;
    
    getData(proxy + calendar + requestData, (data) => {
        renderCheap(data, formData.when);
    });
});


//Вызовы функций
getData(proxy + citiesApi, (data) => {
    city = JSON.parse(data).filter((item) => {
        return item.name;
    });
});