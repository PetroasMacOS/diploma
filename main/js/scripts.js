// Функция ymaps.ready() будет вызвана, когда
// загрузятся все компоненты API, а также когда будет готово DOM-дерево.
ymaps.ready(init)

let = center = [47.22208, 39.720353]

function init() {
	// Создание карты.
	var myMap = new ymaps.Map('map', {
		// Координаты центра карты.
		// Порядок по умолчанию: «широта, долгота».
		center: center,
		// Уровень масштабирования от 0 (весь мир) до 19.
		zoom: 13,
		// Подключение маршрутов
		controls: ['routePanelControl'],
	})

	myMap.controls.remove('geolocationControl') // удаляем геолокацию
	myMap.controls.remove('searchControl') // удаляем поиск
	myMap.controls.remove('trafficControl') // удаляем контроль трафика
	myMap.controls.remove('typeSelector') // удаляем тип
	myMap.controls.remove('fullscreenControl') // удаляем кнопку перехода в полноэкранный режим
	//myMap.controls.remove('zoomControl')  удаляем контрол зуммирования (опционально)
	myMap.controls.remove('rulerControl') // удаляем контрол правил
	//myMap.behaviors.disable(['scrollZoom'])  отключаем скролл карты (опционально)

	//Объявление маркера с координатами
	let placemark = new ymaps.Placemark(
		[47.239355, 39.74957],
		{
			// данные балуна
			balloonContentHeader: 'хедер балуна',
			balloonContentBody: 'тело балуна',
			balloonContentFooter: 'футер балуна',
		},
		{
			// кастомный маркер
			iconLayout: 'default#image',
			iconImageHref: 'img/balloon.ico',
			iconImageSize: [34, 51],
			iconImageOffset: [-17, -51],
		}
	)

	//Объявление маркера с координатами 2
	let placemark2 = new ymaps.Placemark(
		[47.198399, 39.625334],
		{
			// данные балуна
			balloonContent: `
			
			<div class="balloon">
				<h1 class="balloon__header">Газпром</h1>
				<div class="balloon__address">
					<div class="balloon__address_mark">
						<span class="ballon__address_svg inline-image">
							<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path fill-rule="evenodd" clip-rule="evenodd" d="M3 11a9 9 0 0 0 5.018 8.073c1.945 1.01 3.115 2.067 3.512 3.168a.5.5 0 0 0 .94 0c.397-1.101 1.567-2.157 3.512-3.168A9 9 0 1 0 3 11zm9 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="currentColor"></path>
							</svg>
						</span>
					</div>
					<div class="balloon__address_label">
						Адрес
					</div>	
				</div>
				<div class="balloon__address_details">
						Ростовская область, г. Ростов-на-Дону, Каширская улица, 8Д
					</div> 
				<div class="balloon__contacts">
					<span class="inline-image _loaded icon" aria-hidden="true" role="button" tabindex="-1" style="font-size: 0px; line-height: 0;">
						<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path d="M20.186 19.742c1.15-1.15.883-2.424.404-2.707-.336-.198-4.749-2.684-4.749-2.684-.344-.216-.686-.106-.893.142l-.005-.004-1.626 1.625a.674.674 0 0 1-.824.1 14.052 14.052 0 0 1-2.632-2.075 14.054 14.054 0 0 1-2.074-2.632.674.674 0 0 1 .1-.824L9.51 9.057l-.004-.005c.243-.203.361-.544.143-.893 0 0-2.487-4.413-2.685-4.75-.283-.478-1.556-.745-2.707.405-2.566 2.568-1.081 8.207 3.32 12.608 4.398 4.399 10.04 5.887 12.608 3.32z" fill="currentColor">
						</path>
						</svg>
					</span>
					<a href="tel:+88002006828">8 (800) 200-68-28</a>
				</div>
				<div class="balloon__timetable">Круглосуточно
				</div>
			</div>
			`,
		},
		{
			// кастомный маркер
			iconLayout: 'default#image',
			iconImageHref: 'img/balloon.ico',
			iconImageSize: [34, 51],
			iconImageOffset: [-17, -51],
		}
	)

	//Добавление метки на карту
	myMap.geoObjects.add(placemark)
	myMap.geoObjects.add(placemark2)

	let control = myMap.controls.get('routePanelControl')
	let city = 'Ростов-на-Дону'

	// Определение геолокации в переменной
	// let location = ymaps.geolocation.get()

	// location.then(function (res) {
	// 	let locationText = res.geoObjects.get(0).properties.get('text')
	// 	console.log(locationText)

	// Построение маршрута
	// 	control.routePanel.state.set({
	// 		type: 'masstransit',
	// 		fromEnabled: false,
	// 		from: locationText,
	// 		toEnabled: true,
	// 		to: `${city}, Портовая улица, 223`,
	// 	})
	// })

	const options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0,
	}

	function success(pos) {
		const crd = pos.coords

		console.log(`Latitude : ${crd.latitude}`)
		console.log(`Longitude: ${crd.longitude}`)

		let reverseGeocoder = ymaps.geocode([crd.latitude, crd.longitude])
		let locationText = null
		reverseGeocoder.then(function (res) {
			locationText = res.geoObjects.get(0).properties.get('text')
			console.log(locationText)

			control.routePanel.state.set({
				type: 'masstransit',
				fromEnabled: false,
				from: locationText,
				toEnabled: true,
				to: `${city}, Невский проспект 146`,
			})
		})

		console.log(locationText)

		control.routePanel.options.set({
			types: {
				masstransit: true,
				pedestrian: true,
				taxi: true,
			},
		})
	}

	function error(err) {
		console.warn(`ERROR(${err.code}): ${err.message}`)
	}

	navigator.geolocation.getCurrentPosition(success, error, options)
}
