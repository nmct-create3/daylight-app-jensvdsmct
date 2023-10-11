const updateSun = (percentage) => {
	const sun = document.querySelector('.js-sun');
	sun.style.left = `${percentage}%`;

	if (percentage <= 50) {
		sun.style.bottom = `${percentage * 2}%`;
	}
	else {
		sun.style.bottom = `${(100 - percentage) * 2}%`;
	}

};

let placeSunAndStartMoving = (totalMinutes, sunrise) => {

	const sun = document.querySelector('.js-sun');

	const now = new Date();
	var minutes = (now - sunrise) / 1000 / 60;

	sun.setAttribute('data-time', now.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' }));
	const percentage = (minutes / totalMinutes) * 100;

	updateSun(percentage);

	document.querySelector('body').classList.add('is-loaded');

	const minutesLeft = document.querySelector('.js-time-left');
	minutesLeft.innerHTML = Math.round(totalMinutes - minutes);

	if (minutes < 0 || minutes > totalMinutes) {
		document.querySelector('body').classList.add('is-night');
	} else {
		document.querySelector('body').classList.remove('is-night');
	}

	setInterval(() => {
		const now = new Date();

		sun.setAttribute('data-time', now.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' }));

		if (minutes < 0 || minutes > totalMinutes) {
			document.querySelector('body').classList.add('is-night');
		} else {
			document.querySelector('body').classList.remove('is-night');
		}

		updateSun((minutes / totalMinutes) * 100);
		minutesLeft.innerHTML = Math.round(totalMinutes - minutes);
		minutes++;
	}, 60000);
};

let showResult = queryResponse => {
	locationElement = document.querySelector('.js-location');
	locationElement.innerHTML = `${queryResponse.city.name}, ${queryResponse.city.country}`;

	sunrise = new Date(
		queryResponse.city.sunrise * 1000 - queryResponse.city.timezone,
	);

	sunset = new Date(
		queryResponse.city.sunset * 1000 - queryResponse.city.timezone,
	);

	sunriseElement = document.querySelector('.js-sunrise');
	sunsetElement = document.querySelector('.js-sunset');

	sunriseElement.innerHTML = sunrise.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' });
	sunsetElement.innerHTML = sunset.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' });

	let sunsetInMinutes = sunset.getHours() * 60 + sunset.getMinutes();
	let sunriseInMinutes = sunrise.getHours() * 60 + sunrise.getMinutes();
	let timebetween = (sunsetInMinutes - sunriseInMinutes);

	placeSunAndStartMoving(timebetween, sunrise);
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = async (lat, lon) => {
	const weatherInfo = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=ec55f252c842596b2d2a31231de4a94d&units=metric&lang=nl&cnt=1`,
	).then((response) => response.json());

	showResult(weatherInfo);
};

document.addEventListener('DOMContentLoaded', function () {
	getAPI(50.8027841, 3.2097454);
});
