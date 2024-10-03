document.addEventListener('DOMContentLoaded', () => {

  const handleResponse = (response) => {
    if (!response.ok) {
      return response.json().then((err) => {
        throw err;
      });
    }
    return response.json();
  };

  const displayErrors = (errors) => {
    console.error('An error occurred:', errors);
    alert('An error occurred. Please check the console for details.');
  };

  let selectedMobileTariffIds = [];
  let selectedTVTariffIds = [];

  const loadCities = () => {
    fetch('/api/cities/')
      .then(handleResponse)
      .then((cities) => {
        const citySelect = document.getElementById('city-select');
        // citySelect.innerHTML = '<option value="">All Cities</option>';
        cities.forEach((city) => {
          const option = document.createElement('option');
          option.value = city.id;
          option.textContent = city.name;
          citySelect.appendChild(option);
        });
      //   if (navigator.geolocation) {
      //     navigator.geolocation.getCurrentPosition(
      //         function(position) {
      //             const lat = position.coords.latitude;
      //             const lon = position.coords.longitude;
      //             console.log(lat, lon)
      //             data = {lat: lat, lon: lon}
      //             fetch(`/gps-check/`, {
      //               method: 'POST',
      //               headers: {
      //                 'Content-Type': 'application/json',
      //                 'X-CSRFToken': getCSRFToken(),
      //               },
      //               body: JSON.stringify(data)
                    
      //             })
      //             .then(response => response.json())
      //             .then((response) => {
      //               const citySelect = document.getElementById('city-select');
      //               console.log(response)
      //               console.log(citySelect)
      //               fetch('/api/cities/')
      //                 .then(handleResponse)
      //                 .then((cities) => {
      //                   cities.forEach((city) => {
      //                     if (city.name == response.address){
      //                       citySelect.value = city.id
      //                     }
      //                   });
      //                 })
      //                 .catch(displayErrors);
      //             })
      //         }
      //     );    
      // } else {
      //     alert('Геолокация не поддерживается вашим браузером.');
      // }
      })
      .catch(displayErrors);
  };

  /** Load Mobile Tariffs **/

  const loadMobileTariffs = (cityId = '', ordering = 'cost') => {
    let url = `/api/mobile-tariffs/?ordering=${ordering}`;
    if (cityId) url += `&city_id=${cityId}`;
    return fetch(url)
      .then(handleResponse)
      .then((data) => {
        const tariffList = document.getElementById('mobile-tariff-list');
        tariffList.innerHTML = '';
        data.forEach((tariff) => {
          const tariffBlock = document.createElement('div');
          tariffBlock.classList.add('provider');
          tariffBlock.classList.add('tariff-block');
          tariffBlock.dataset.id = tariff.id;
          tariffBlock.dataset.type = 'mobile';
          tariffBlock.innerHTML = `
            <h3>${tariff.name}</h3>
            <p><strong>Провайдер:</strong> ${tariff.provider}</p>
            <p><strong>Гигабайты:</strong> ${tariff.gb}</p>
            <p><strong>СМС:</strong> ${tariff.sms}</p>
            <p><strong>Минуты:</strong> ${tariff.min}</p>
            ${tariff.additional_info ? `<p><strong>Дополнительная информация:</strong> ${tariff.additional_info}</p>` : ''}
            <h2 class="price">${tariff.cost} Р</h2>
          `;
          tariffBlock.addEventListener('click', () => toggleSelection(tariffBlock, 'mobile'));
          // Highlight if previously selected
          if (selectedMobileTariffIds.includes(tariff.id.toString())) {
            tariffBlock.classList.add('selected');
            tariffBlock.style.borderColor = 'green';
          }
          tariffList.appendChild(tariffBlock);
        });
        const tariffMobileHeader = document.getElementById('mobile-tariff-header');
        if (tariffList.children.length > 0) {
            tariffMobileHeader.style.display = 'block';
        } else {
            tariffMobileHeader.style.display = 'none';
        }
      })
      .catch(displayErrors);
  };

  /** Load TV Tariffs **/

  const loadTVTariffs = (cityId = '', ordering = 'cost', sorting_type='') => {
    let url = `/api/tv-tariffs/?ordering=${ordering}`;
    if (cityId) url += `&city_id=${cityId}`;
    return fetch(url)
      .then(handleResponse)
      .then((data) => {
        
        const tariffTVList = document.getElementById('tv-tariff-list');
        const tariffHomenetList = document.getElementById('homenet-tariff-list');
        const tariffHomenetTVList = document.getElementById('homenet-tv-tariff-list');
        const tariffHomenetTVMobileList = document.getElementById('homenet-tv-mobile-tariff-list');

        if (sorting_type == ''){
          tariffTVList.innerHTML = '';
          tariffHomenetList.innerHTML = '';
          tariffHomenetTVList.innerHTML = '';
          tariffHomenetTVMobileList.innerHTML = '';
          data.forEach((tariff) => {
            const tariffBlock = document.createElement('div');
            tariffBlock.classList.add('provider');
            tariffBlock.classList.add('tariff-block');
            tariffBlock.dataset.id = tariff.id;
            tariffBlock.dataset.type = tariff.tariff_type.in_name;
            if (tariff.tariff_type.in_name == 'tv_tariff'){
              tariffBlock.innerHTML = `
                <h3>${tariff.name}</h3>
                <p><strong>Провайдер:</strong> ${tariff.provider}</p>
                <p><strong>Количество каналов:</strong> ${tariff.number_of_channels}</p>
                ${tariff.additional_info ? `<p><strong>Дополнительная информация:</strong> ${tariff.additional_info}</p>` : ''}
                <h2 class="price">${tariff.cost} Р</h2>
              `;
            } else if(tariff.tariff_type.in_name == 'homenet_tv_mobile_tariff'){
              tariffBlock.innerHTML = `
                <h3>${tariff.name}</h3>
                <p><strong>Провайдер:</strong> ${tariff.provider}</p>
                <p><strong>Гигабайты:</strong> ${tariff.gb}</p>
                <p><strong>СМС:</strong> ${tariff.sms}</p>
                <p><strong>Минуты:</strong> ${tariff.min}</p>
                <p><strong>Скорость в Мбит/с:</strong> ${tariff.speed}</p>
                <p><strong>Количество каналов:</strong> ${tariff.number_of_channels}</p>
                ${tariff.additional_info ? `<p><strong>Дополнительная информация:</strong> ${tariff.additional_info}</p>` : ''}
                <h2 class="price">${tariff.cost} Р</h2>
              `;
            } else if(tariff.tariff_type.in_name == 'homenet_tariff'){
              tariffBlock.innerHTML = `
                <h3>${tariff.name}</h3>
                <p><strong>Провайдер:</strong> ${tariff.provider}</p>
                <p><strong>Скорость в Мбит/с:</strong> ${tariff.speed}</p>
                ${tariff.additional_info ? `<p><strong>Дополнительная информация:</strong> ${tariff.additional_info}</p>` : ''}
                <h2 class="price">${tariff.cost} Р</h2>
              `;
            }
            else if(tariff.tariff_type.in_name == 'homenet_tv_tariff'){
              tariffBlock.innerHTML = `
                <h3>${tariff.name}</h3>
                <p><strong>Провайдер:</strong> ${tariff.provider}</p>
                <p><strong>Скорость в Мбит/с:</strong> ${tariff.speed}</p>
                <p><strong>Количество каналов:</strong> ${tariff.number_of_channels}</p>
                ${tariff.additional_info ? `<p><strong>Дополнительная информация:</strong> ${tariff.additional_info}</p>` : ''}
                <h2 class="price">${tariff.cost} Р</h2>
              `;
            }
            tariffBlock.addEventListener('click', () => toggleSelection(tariffBlock, 'tv'));
            // Highlight if previously selected
            if (selectedTVTariffIds.includes(tariff.id.toString())) {
              tariffBlock.classList.add('selected');
              tariffBlock.style.borderColor = 'green';
            }
  
            if (tariff.tariff_type.in_name == 'tv_tariff'){
              tariffTVList.appendChild(tariffBlock);
            } else if(tariff.tariff_type.in_name == 'homenet_tv_mobile_tariff'){
              tariffHomenetTVMobileList.appendChild(tariffBlock);
            } else if(tariff.tariff_type.in_name == 'homenet_tariff'){
              tariffHomenetList.appendChild(tariffBlock);
            } else if(tariff.tariff_type.in_name == 'homenet_tv_tariff'){
              tariffHomenetTVList.appendChild(tariffBlock);
            }
  
            const tariffTVHeader = document.getElementById('tv-tariff-header');
            const tariffHomenetHeader = document.getElementById('homenet-tariff-header');
            const tariffHomenetTVHeader = document.getElementById('homenet-tv-tariff-header');
            const tariffHomenetTVMobileHeader = document.getElementById('homenet-tv-mobile-tariff-header');

            if (tariffTVList.children.length > 0) {
              tariffTVHeader.style.display = 'block';
            } else {
              tariffTVHeader.style.display = 'none';
            }
  
            if (tariffHomenetList.children.length > 0) {
              tariffHomenetHeader.style.display = 'block';
              
            } else {
              tariffHomenetHeader.style.display = 'none';
              
            }
  
            if (tariffHomenetTVList.children.length > 0) {
              tariffHomenetTVHeader.style.display = 'block';
            } else {
              tariffHomenetTVHeader.style.display = 'none';
              
            }
            console.log(tariffHomenetTVMobileList.children.length)
              if (tariffHomenetTVMobileList.children.length > 0) {
                tariffHomenetTVMobileHeader.style.display = 'block';
            } else {
              tariffHomenetTVMobileHeader.style.display = 'none';
            }
            
          });
        } else if(sorting_type == 'tv'){
          tariffTVList.innerHTML = '';
          data.forEach((tariff) => {
            if (tariff.tariff_type.in_name == 'tv_tariff'){
            const tariffBlock = document.createElement('div');
            tariffBlock.classList.add('provider');
            tariffBlock.classList.add('tariff-block');
            tariffBlock.dataset.id = tariff.id;
            tariffBlock.dataset.type = tariff.tariff_type.in_name;
            tariffBlock.innerHTML = `
              <h3>${tariff.name}</h3>
              <p><strong>Провайдер:</strong> ${tariff.provider}</p>
              <p><strong>Количество каналов:</strong> ${tariff.number_of_channels}</p>
              ${tariff.additional_info ? `<p><strong>Дополнительная информация:</strong> ${tariff.additional_info}</p>` : ''}
              <h2 class="price">${tariff.cost} Р</h2>
            `;

            tariffBlock.addEventListener('click', () => toggleSelection(tariffBlock, 'tv'));
            // Highlight if previously selected
            if (selectedTVTariffIds.includes(tariff.id.toString())) {
              tariffBlock.classList.add('selected');
              tariffBlock.style.borderColor = 'green';
            }
  
            tariffTVList.appendChild(tariffBlock);
  
            const tariffTVHeader = document.getElementById('tv-tariff-header');

            if (tariffTVList.children.length > 0) {
              tariffTVHeader.style.display = 'block';
            } else {
              tariffTVHeader.style.display = 'none';
            }
            }
          });
        } else if(sorting_type == 'homenet'){
          tariffHomenetList.innerHTML = '';
          data.forEach((tariff) => {
            if(tariff.tariff_type.in_name == 'homenet_tariff'){
            const tariffBlock = document.createElement('div');
            tariffBlock.classList.add('provider');
            tariffBlock.classList.add('tariff-block');
            tariffBlock.dataset.id = tariff.id;
            tariffBlock.dataset.type = tariff.tariff_type.in_name;
            tariffBlock.innerHTML = `
              <h3>${tariff.name}</h3>
              <p><strong>Провайдер:</strong> ${tariff.provider}</p>
              <p><strong>Скорость в Мбит/с:</strong> ${tariff.speed}</p>
              ${tariff.additional_info ? `<p><strong>Дополнительная информация:</strong> ${tariff.additional_info}</p>` : ''}
              <h2 class="price">${tariff.cost} Р</h2>
            `;
            tariffBlock.addEventListener('click', () => toggleSelection(tariffBlock, 'tv'));
            // Highlight if previously selected
            if (selectedTVTariffIds.includes(tariff.id.toString())) {
              tariffBlock.classList.add('selected');
              tariffBlock.style.borderColor = 'green';
            }
            tariffHomenetList.appendChild(tariffBlock);
            const tariffHomenetHeader = document.getElementById('homenet-tariff-header');
  
            if (tariffHomenetList.children.length > 0) {
              tariffHomenetHeader.style.display = 'block';
            } else {
              tariffHomenetHeader.style.display = 'none';
            }   
        }});
        } else if(sorting_type == 'homenet-tv'){
          tariffHomenetTVList.innerHTML = '';
          data.forEach((tariff) => {
            if(tariff.tariff_type.in_name == 'homenet_tv_tariff'){
            const tariffBlock = document.createElement('div');
            tariffBlock.classList.add('provider');
            tariffBlock.classList.add('tariff-block');
            tariffBlock.dataset.id = tariff.id;
            tariffBlock.dataset.type = tariff.tariff_type.in_name;
            
              tariffBlock.innerHTML = `
                <h3>${tariff.name}</h3>
                <p><strong>Провайдер:</strong> ${tariff.provider}</p>
                <p><strong>Скорость в Мбит/с:</strong> ${tariff.speed}</p>
                <p><strong>Количество каналов:</strong> ${tariff.number_of_channels}</p>
                ${tariff.additional_info ? `<p><strong>Дополнительная информация:</strong> ${tariff.additional_info}</p>` : ''}
                <h2 class="price">${tariff.cost} Р</h2>
              `;
            tariffBlock.addEventListener('click', () => toggleSelection(tariffBlock, 'tv'));
            // Highlight if previously selected
            if (selectedTVTariffIds.includes(tariff.id.toString())) {
              tariffBlock.classList.add('selected');
              tariffBlock.style.borderColor = 'green';
            }
            tariffHomenetTVList.appendChild(tariffBlock);

            const tariffHomenetTVHeader = document.getElementById('homenet-tv-tariff-header')
            if (tariffHomenetTVList.children.length > 0) {
              tariffHomenetTVHeader.style.display = 'block';
            } else {
              tariffHomenetTVHeader.style.display = 'none';
            }
            
        }});
        } else if(sorting_type == 'homenet-tv-mobile'){
          tariffHomenetTVMobileList.innerHTML = '';
          data.forEach((tariff) => {
            if(tariff.tariff_type.in_name == 'homenet_tv_mobile_tariff'){
            const tariffBlock = document.createElement('div');
            tariffBlock.classList.add('provider');
            tariffBlock.classList.add('tariff-block');
            tariffBlock.dataset.id = tariff.id;
            tariffBlock.dataset.type = tariff.tariff_type.in_name;
            
              tariffBlock.innerHTML = `
                <h3>${tariff.name}</h3>
                <p><strong>Провайдер:</strong> ${tariff.provider}</p>
                <p><strong>Гигабайты:</strong> ${tariff.gb}</p>
                <p><strong>СМС:</strong> ${tariff.sms}</p>
                <p><strong>Минуты:</strong> ${tariff.min}</p>
                <p><strong>Скорость в Мбит/с:</strong> ${tariff.speed}</p>
                <p><strong>Количество канлов:</strong> ${tariff.number_of_channels}</p>
                ${tariff.additional_info ? `<p><strong>Дополнительная информация:</strong> ${tariff.additional_info}</p>` : ''}
                <h2 class="price">${tariff.cost} Р</h2>
              `;
            
            tariffBlock.addEventListener('click', () => toggleSelection(tariffBlock, 'tv'));
            // Highlight if previously selected
            if (selectedTVTariffIds.includes(tariff.id.toString())) {
              tariffBlock.classList.add('selected');
              tariffBlock.style.borderColor = 'green';
            }

            tariffHomenetTVMobileList.appendChild(tariffBlock);
            const tariffHomenetTVMobileHeader = document.getElementById('homenet-tv-mobile-tariff-header');
  
              if (tariffHomenetTVMobileList.children.length > 0) {
                tariffHomenetTVMobileHeader.style.display = 'block';
            } else {
              tariffHomenetTVMobileHeader.style.display = 'none';
            }           
        }});
        }
      })
      .catch(displayErrors);
  };

  /** Toggle Tariff Selection **/

  const toggleSelection = (tariffBlock, type) => {
    const id = tariffBlock.dataset.id;
    if (tariffBlock.classList.contains('selected')) {
      // Deselect
      tariffBlock.classList.remove('selected');
      tariffBlock.style.borderColor = '';
      if (type === 'mobile') {
        selectedMobileTariffIds = selectedMobileTariffIds.filter((tid) => tid !== id);
      } else if (type === 'tv') {
        selectedTVTariffIds = selectedTVTariffIds.filter((tid) => tid !== id);
      }
    } else {
      // Select
      tariffBlock.classList.add('selected');
      tariffBlock.style.borderColor = 'green';
      if (type === 'mobile') {
        selectedMobileTariffIds.push(id);
      } else if (type === 'tv') {
        selectedTVTariffIds.push(id);
      }
    }
  };
  const handleAskButtonClick = () => {
    const userInput = document.getElementById('user-input').value.trim();
    const userTextDisplay = document.getElementById('user-text-display');
    const backendResponseDisplay = document.getElementById('backend-response-display');
    const backendResponse = document.getElementById('backend-response');
  
    if (selectedMobileTariffIds.length === 0 && selectedTVTariffIds.length === 0) {
      alert('Please select at least one tariff.');
      return;
    }
  
    if (userInput === '') {
      alert('Please enter some text.');
      return;
    }
  
    // Display User Text
    userTextDisplay.innerHTML = `<strong>Ваш запрос:</strong> ${userInput}`;
  
    // Prepare Data to Send
    const data = {
      selected_mobile_tariff_ids: selectedMobileTariffIds.map(id => parseInt(id)),
      selected_tv_tariff_ids: selectedTVTariffIds.map(id => parseInt(id)),
      user_text: userInput,
    };
  
    // Send Data to Backend and get processing ID
    fetch('/process-selection/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then((response) => {
        if (response.id) {
          const processingId = {id: response.id};
          console.log(response.id);
          // Poll for status periodically
          const checkStatusInterval = setInterval(() => {
            fetch(`/check-status/${response.id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
              },
              
            })
            .then(response => response.json())
            .then((statusResponse) => {
              if (statusResponse.status === 'ready') {
                clearInterval(checkStatusInterval); // Stop polling when data is ready
                backendResponse.innerHTML = '';
                if (statusResponse.custom_text) {
                  backendResponse.innerHTML += `<p><strong>GigaChat:</strong> ${statusResponse.custom_text}</p>`;
                }
                const tariffsBlock = document.createElement('div');
                tariffsBlock.classList.add('container-tar2')
                if (statusResponse.tariffs && statusResponse.tariffs.length > 0) {
                  statusResponse.tariffs.forEach((tariff) => {
                    const tariffBlock = document.createElement('div');
                    tariffBlock.classList.add('tariff-block');
                    tariffBlock.classList.add('provider');
                    tariffBlock.innerHTML = `
                      <h3>${tariff.name}</h3>
                      <p><strong>Провайдер:</strong> ${tariff.provider}</p>
                      ${tariff.gb ? `<p><strong>Гигабайты:</strong> ${tariff.gb}</p>` : ''}
                      ${tariff.sms ? `<p><strong>СМС:</strong> ${tariff.sms}</p>` : ''}
                      ${tariff.min ? `<p><strong>Минуты:</strong> ${tariff.min}</p>` : ''}
                      ${tariff.speed ? `<p><strong>Скорость в Мбит/с:</strong> ${tariff.speed}</p>` : ''}
                      ${tariff.number_of_channels ? `<p><strong>Количество каналов:</strong> ${tariff.number_of_channels}</p>` : ''}
                      ${tariff.additional_info ? `<p><strong>Дополнительная информация:</strong> ${tariff.additional_info}</p>` : ''}
                      <h2 class="price">${tariff.cost} Р</h2>
                    `;
                    tariffsBlock.appendChild(tariffBlock);
                  });
                }
                backendResponseDisplay.appendChild(tariffsBlock);
              }
            })
            .catch(displayErrors);
          }, 2000); // Check every 5 seconds
        } else {
          alert('Failed to process request. Please try again.');
        }
      })
      .catch(displayErrors);
  };
  

  /** Get CSRF Token **/

  function getCSRFToken() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const trimmedCookie = cookie.trim();
        if (trimmedCookie.startsWith('csrftoken=')) {
          cookieValue = decodeURIComponent(trimmedCookie.substring('csrftoken='.length));
          break;
        }
      }
    }
    return cookieValue;
  }

  function gpsCity(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          function(position) {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              console.log(lat, lon)
              data = {lat: lat, lon: lon}
              fetch(`/gps-check/`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify(data)
                
              })
              .then(response => response.json())
              .then((response) => {
                const citySelect = document.getElementById('city-select');
                console.log(response)
                console.log(citySelect)
                fetch('/api/cities/')
                  .then(handleResponse)
                  .then((cities) => {
                    cities.forEach((city) => {
                      if (city.name == response.address){
                        citySelect.value = city.id
                      }
                    });
                    const cityId = document.getElementById('city-select').value;
                    const mobileOrdering = document.getElementById('mobile-sort-options').value;
                    const tvOrdering = document.getElementById('tv-sort-options').value;
                    console.log(cityId)
                    loadMobileTariffs(cityId, mobileOrdering);
                    loadTVTariffs(cityId, tvOrdering);
                  })
                  .catch(displayErrors);
              })
          }
      );    
  } else {
      alert('Геолокация не поддерживается вашим браузером.');
  }
  }
  /** Event Listeners **/

  const setupEventListeners = () => {
    document.getElementById('city-select').addEventListener('change', () => {
      const cityId = document.getElementById('city-select').value;
      const mobileOrdering = document.getElementById('mobile-sort-options').value;
      const tvOrdering = document.getElementById('tv-sort-options').value;
      loadMobileTariffs(cityId, mobileOrdering);
      loadTVTariffs(cityId, tvOrdering);
    });

    document.getElementById('mobile-sort-options').addEventListener('change', () => {
      const ordering = document.getElementById('mobile-sort-options').value;
      const cityId = document.getElementById('city-select').value;
      loadMobileTariffs(cityId, ordering);
    });

    document.getElementById('tv-sort-options').addEventListener('change', () => {
      const ordering = document.getElementById('tv-sort-options').value;
      const cityId = document.getElementById('city-select').value;
      loadTVTariffs(cityId, ordering, 'tv');
    });

    document.getElementById('homenet-sort-options').addEventListener('change', () => {
      const ordering = document.getElementById('homenet-sort-options').value;
      const cityId = document.getElementById('city-select').value;
      loadTVTariffs(cityId, ordering, 'homenet');
    });
  
    document.getElementById('homenet-tv-sort-options').addEventListener('change', () => {
      const ordering = document.getElementById('homenet-tv-sort-options').value;
      const cityId = document.getElementById('city-select').value;
      loadTVTariffs(cityId, ordering, 'homenet-tv');
    });

    document.getElementById('homenet-tv-mobile-sort-options').addEventListener('change', () => {
      const ordering = document.getElementById('homenet-tv-mobile-sort-options').value;
      const cityId = document.getElementById('city-select').value;
      loadTVTariffs(cityId, ordering, 'homenet-tv-mobile');
    });
    document.getElementById('ask-button').addEventListener('click', handleAskButtonClick);
  };

  /** Initial Load **/
  loadCities();
  setupEventListeners();
  const cityId = document.getElementById('city-select').value;
  const mobileOrdering = document.getElementById('mobile-sort-options').value;
  const tvOrdering = document.getElementById('tv-sort-options').value;
  console.log(cityId)
  loadMobileTariffs(cityId, mobileOrdering);
  loadTVTariffs(cityId, tvOrdering);
  // gpsCity();

});
