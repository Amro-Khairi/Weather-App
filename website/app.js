/* Global Variables */
const APIKey = `&appid=d04a5081ea37ad1af6f18115cdb282dc`;

//Selecting DOM elements 
const generateBtn = document.getElementById('generate');
const dateUI = document.getElementById('date');
const tempUI = document.getElementById('temp');
const contentUI = document.getElementById('content');
const wrongZip = document.getElementById('wrong-zip'); //A text that shows in case of entering wrong ZipCode
const wrongName = document.getElementById('wrong-name'); //A text that shows in case of entering wrong Ciry Name
let zipClass = document.getElementById('holderZip').classList; //It's a div that holds the zip code input & zip code label & text that shows in case of wrong entry
let nameClass = document.getElementById('holderName').classList;//It's a div that holds the city name input & city name label & text that shows in case of wrong entry
let countryClass = document.querySelector('.countries').classList;//It's a select tag that has all the country names and codes


//Function to select location based on Zipcode or City name, and it is activated in HTML select tag.
const locationMethod = () => {
    const methodSelected = document.getElementById('location-method').options[document.getElementById('location-method').selectedIndex].value;
    if (methodSelected === 'zipCode') {
        zipClass.add('display');
        zipClass.remove('disappear');
        nameClass.add('disappear');
        nameClass.remove('display');
        countryClass.add('display');
    } else if (methodSelected === 'cityName') {
        zipClass.remove('display');
        zipClass.add('disappear');
        nameClass.remove('disappear');
        nameClass.add('display');
        countryClass.add('display');
    }
}

// Create a new date instance dynamically with JS
let today = new Date();
let todayDate = today.getDate() +'/'+ (today.getMonth() + 1) +'/'+ today.getFullYear();

//GET request to handle ZipCode or City Name:
const getData = async (baseURL, zipOrName, APIKey) => {
    const response = await fetch (baseURL+zipOrName+APIKey);
    if (response.status >= 400 && response.status < 500 && zipClass[0] === 'display') {
        wrongZip.style.display = 'block';
        wrongZip.textContent = 'Please, Enter a valid Zipcode';
    }else if (response.status >= 400 && response.status < 500 && nameClass[0] === 'display') {
        wrongName.style.display = 'block';
        wrongName.textContent = 'Please, Enter a valid City Name';
    }else {
        wrongName.style.display = 'none';
        wrongZip.style.display = 'none';
        try {
            const newData = await response.json(); 
            return newData;
        }catch(err) {
            console.log('Error', err);
        }    
    }
}

//POST request:
const postData = async (url = '', data = {}) => {
    const response = await fetch (url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}

/*
*First method to excute what's needed
*/

//Function to dynamically update the UI:
const updatingUI = async () => {
    const response = await fetch('/weather');
    try {
        const newData = await response.json();
        dateUI.innerHTML = 'Today\'s Date is ' + todayDate;
        tempUI.innerHTML = `Temp is ${Math.round(newData.temperature)} °${choosingUnits()[2]}`;
        contentUI.innerHTML = 'Your feeling: ' + newData['user-response'];
    }catch(err) {
        console.log('Error', err);
    }
}

//Function for choosing the measuring units, and it will get invoked also in HTML
const choosingUnits = () => {
    let units = document.getElementById('units').options[document.getElementById('units').selectedIndex].value;
    let unitsName = document.getElementById('units').options[document.getElementById('units').selectedIndex].text;
    let baseURL = `https://api.openweathermap.org/data/2.5/weather?&units=${units}`;
    return [baseURL, units, unitsName];
}

//Function to handle the submit button
const onBtnSubmit = () => {
    const countryCode = document.getElementById('countries').options[document.getElementById('countries').selectedIndex].value.toLowerCase();
    const feel = document.getElementById('feelings').value;
    if (zipClass[0] === 'display') {
        const zipCode = document.getElementById('zip').value;
        const fullCode ='&zip=' + zipCode + ',' + countryCode;
        getData(choosingUnits()[0], fullCode, APIKey)
        .then(async (data) => {
            await postData('/weather', {temperature: data.main.temp, date: todayDate, userResponse: feel})
            try {
                updatingUI();
            }catch(err) {
                console.log('Error', err);
            }
        })        
    } else if (nameClass[0] === 'display'){
        let cityName = document.getElementById('name').value.toLowerCase();
        const fullName ='&q=' + cityName + ',' + countryCode;
        getData(choosingUnits()[0], fullName, APIKey) //Note for me, Here I must use the (), to get the function return, if I don't use, I am just typing the function itself
        .then(async (data) => {
            await postData('/weather', {temperature: data.main.temp, date: todayDate, userResponse: feel})
            try {
                updatingUI();
            }catch(err) {
                console.log('Error', err);
            }
        })        
    }
}

//Events
generateBtn.addEventListener('click', onBtnSubmit);
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        onBtnSubmit();
    }

})
/*
*Second method to excute what's needed (Doesn't require a GET route)
*/
/*
const updatingUI = (data) => {
    dateUI.innerHTML = todayDate;
    tempUI.innerHTML = Math.round(data.temperature) + ' degrees fahrenheit';
    contentUI.innerHTML = data['user-response'];

}

//Events
generateBtn.addEventListener('click', () => {
    const zipCode = document.getElementById('zip').value;
    const feel = document.getElementById('feelings').value;
    getData(baseURL, zipCode, APIKey)
    .then((data) => {
        return postData('/weather', {temperature: data.main.temp, date: todayDate, userResponse: feel})
    })
    .then((newData) => {
        updatingUI(newData);
    })
});

*/

