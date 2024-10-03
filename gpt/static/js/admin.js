document.addEventListener('DOMContentLoaded', () => {
  const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

  /** Utility Functions **/

  // Fetch CSRF token from cookies (if needed)
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

  // Handle fetch response
  const handleResponse = (response) => {
    if (!response.ok) {
      return response.json().then(err => { throw err; });
    }
    return response.json();
  };

  // Display errors
  const displayErrors = (errors) => {
    alert('An error occurred: ' + JSON.stringify(errors));
  };

  /** Load Cities **/

  const loadCities = () => {
    fetch('/api/cities/')
      .then(handleResponse)
      .then(cities => {
        const cityList = document.getElementById('city-list');
        cityList.innerHTML = '';
        cities.forEach(city => {
          const cityBlock = `
            <div class="city-block" data-id="${city.id}">
              <p>${city.name}</p>
              <button class="edit-city-btn">Edit</button>
              <button class="delete-city-btn">Delete</button>
            </div>
          `;
          cityList.innerHTML += cityBlock;
        });
        addCityEventListeners();
        populateCitySelectOptions();
      })
      .catch(displayErrors);
  };

  /** CRUD Operations for Cities **/

  const addCityEventListeners = () => {
    document.querySelectorAll('.edit-city-btn').forEach(button => {
      button.addEventListener('click', handleEditCity);
    });
    document.querySelectorAll('.delete-city-btn').forEach(button => {
      button.addEventListener('click', handleDeleteCity);
    });
  };

  const handleEditCity = (e) => {
    const cityBlock = e.target.closest('.city-block');
    const id = cityBlock.dataset.id;
    fetch(`/api/cities/${id}/`)
      .then(handleResponse)
      .then(city => {
        const form = document.getElementById('city-form-element');
        form['id'].value = city.id;
        form['name'].value = city.name;
        document.getElementById('city-form-title').innerText = 'Edit City';
        document.getElementById('city-form').style.display = 'block';
      })
      .catch(displayErrors);
  };

  const handleDeleteCity = (e) => {
    const cityBlock = e.target.closest('.city-block');
    const id = cityBlock.dataset.id;
    fetch(`/api/cities/${id}/`, {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': csrfToken,
      },
    })
    .then(response => {
      if (response.ok) {
        loadCities();
      } else {
        return response.json().then(err => { throw err; });
      }
    })
    .catch(displayErrors);
  };

  document.getElementById('add-city-btn').addEventListener('click', () => {
    const form = document.getElementById('city-form-element');
    form.reset();
    form['id'].value = '';
    document.getElementById('city-form-title').innerText = 'Add City';
    document.getElementById('city-form').style.display = 'block';
  });

  document.querySelectorAll('.cancel-btn').forEach(button => {
    button.addEventListener('click', () => {
      button.closest('div').style.display = 'none';
    });
  });

  document.getElementById('city-form-element').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const id = form['id'].value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/cities/${id}/` : '/api/cities/';
    const data = {
      name: form['name'].value,
    };

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify(data),
    })
    .then(handleResponse)
    .then(() => {
      document.getElementById('city-form').style.display = 'none';
      loadCities();
    })
    .catch(displayErrors);
  });

  /** Populate City Options in Tariff Forms **/

  const populateCitySelectOptions = () => {
    fetch('/api/cities/')
      .then(handleResponse)
      .then(cities => {
        const mobileCitySelect = document.querySelector('#mobile-tariff-form-element [name=city_id]');
        const tvCitySelect = document.querySelector('#tv-tariff-form-element [name=city_id]');
        mobileCitySelect.innerHTML = '';
        tvCitySelect.innerHTML = '';
        cities.forEach(city => {
          const option = document.createElement('option');
          option.value = city.id;
          option.textContent = city.name;
          mobileCitySelect.appendChild(option.cloneNode(true));
          tvCitySelect.appendChild(option);
        });
      })
      .catch(displayErrors);
  };


  const loadHomeTypes = () => {
    fetch('/api/home-types/')
      .then(handleResponse)
      .then(home_types => {
        const home_type_List = document.getElementById('home-type-list');
        home_type_List.innerHTML = '';
        home_types.forEach(home_type => {
          const home_type_Block = `
            <div class="home-type-block" data-id="${home_type.id}">
              <p>${home_type.name}</p>
              <p>${home_type.in_name}</p>
              <button class="edit-home-type-btn">Edit</button>
              <button class="delete-home-type-btn">Delete</button>
            </div>
          `;
          home_type_List.innerHTML += home_type_Block;
        });
        addHomeTypeEventListeners();
        populateHomeTypeSelectOptions();
        // populateCitySelectOptions();
      })
      .catch(displayErrors);
  };

  /** CRUD Operations for Cities **/

  const addHomeTypeEventListeners = () => {
    document.querySelectorAll('.edit-home-type-btn').forEach(button => {
      button.addEventListener('click', handleEditHomeType);
    });
    document.querySelectorAll('.delete-home-type-btn').forEach(button => {
      button.addEventListener('click', handleDeleteHomeType);
    });
  };

  const handleEditHomeType = (e) => {
    const cityBlock = e.target.closest('.home-type-block');
    const id = cityBlock.dataset.id;
    fetch(`/api/home-types/${id}/`)
      .then(handleResponse)
      .then(city => {
        const form = document.getElementById('home-type-form-element');
        form['id'].value = city.id;
        form['name'].value = city.name;
        form['in_name'].value = city.in_name;
        document.getElementById('home-type-form-title').innerText = 'Edit Home Type';
        document.getElementById('home-type-form').style.display = 'block';
      })
      .catch(displayErrors);
  };

  const handleDeleteHomeType = (e) => {
    const cityBlock = e.target.closest('.home-type-block');
    const id = cityBlock.dataset.id;
    fetch(`/api/home-types/${id}/`, {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': csrfToken,
      },
    })
    .then(response => {
      if (response.ok) {
        loadHomeTypes();
      } else {
        return response.json().then(err => { throw err; });
      }
    })
    .catch(displayErrors);
  };

  document.getElementById('add-home-type-btn').addEventListener('click', () => {
    const form = document.getElementById('home-type-form-element');
    form.reset();
    form['id'].value = '';
    document.getElementById('home-type-form-title').innerText = 'Add Home Type';
    document.getElementById('home-type-form').style.display = 'block';
  });

  document.querySelectorAll('.cancel-btn').forEach(button => {
    button.addEventListener('click', () => {
      button.closest('div').style.display = 'none';
    });
  });

  document.getElementById('home-type-form-element').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const id = form['id'].value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/home-types/${id}/` : '/api/home-types/';
    const data = {
      name: form['name'].value,
      in_name: form['in_name'].value,
    };

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify(data),
    })
    .then(handleResponse)
    .then(() => {
      document.getElementById('home-type-form').style.display = 'none';
      loadHomeTypes();
    })
    .catch(displayErrors);
  });

  const populateHomeTypeSelectOptions = () => {
    fetch('/api/home-types/')
      .then(handleResponse)
      .then(home_types => {
        const tvCitySelect = document.querySelector('#tv-tariff-form-element [name=home_type_id]');
        tvCitySelect.innerHTML = '';
        home_types.forEach(home_type => {
          const option = document.createElement('option');
          option.value = home_type.id;
          option.textContent = home_type.name;
          tvCitySelect.appendChild(option);
        });
      })
      .catch(displayErrors);
  };
  /** Populate City Options in Tariff Forms **/

  /** Load Mobile Tariffs **/

  const loadMobileTariffs = () => {
    fetch('/api/mobile-tariffs/')
      .then(handleResponse)
      .then(tariffs => {
        const tariffList = document.getElementById('mobile-tariff-list');
        tariffList.innerHTML = '';
        tariffs.forEach(tariff => {
          const tariffBlock = `
            <div class="tariff-block" data-id="${tariff.id}">
              <h3>${tariff.name}</h3>
              <p>Provider: ${tariff.provider}</p>
              <p>GB: ${tariff.gb}</p>
              <p>SMS: ${tariff.sms}</p>
              <p>Min: ${tariff.min}</p>
              <p>Cost: $${tariff.cost}</p>
              <p>City: ${tariff.city.name}</p>
              <p>${tariff.additional_info}</p>
              <button class="edit-mobile-tariff-btn">Edit</button>
              <button class="delete-mobile-tariff-btn">Delete</button>
            </div>
          `;
          tariffList.innerHTML += tariffBlock;
        });
        addMobileTariffEventListeners();
      })
      .catch(displayErrors);
  };

  /** CRUD Operations for Mobile Tariffs **/

  const addMobileTariffEventListeners = () => {
    document.querySelectorAll('.edit-mobile-tariff-btn').forEach(button => {
      button.addEventListener('click', handleEditMobileTariff);
    });
    document.querySelectorAll('.delete-mobile-tariff-btn').forEach(button => {
      button.addEventListener('click', handleDeleteMobileTariff);
    });
  };

  const handleEditMobileTariff = (e) => {
    const tariffBlock = e.target.closest('.tariff-block');
    const id = tariffBlock.dataset.id;
    fetch(`/api/mobile-tariffs/${id}/`)
      .then(handleResponse)
      .then(tariff => {
        const form = document.getElementById('mobile-tariff-form-element');
        form['id'].value = tariff.id;
        form['name'].value = tariff.name;
        form['provider'].value = tariff.provider;
        form['gb'].value = tariff.gb;
        form['sms'].value = tariff.sms;
        form['min'].value = tariff.min;
        form['cost'].value = tariff.cost;
        form['city_id'].value = tariff.city.id;
        form['additional_info'].value = tariff.additional_info;
        document.getElementById('mobile-tariff-form-title').innerText = 'Edit Mobile Tariff';
        document.getElementById('mobile-tariff-form').style.display = 'block';
      })
      .catch(displayErrors);
  };

  const handleDeleteMobileTariff = (e) => {
    const tariffBlock = e.target.closest('.tariff-block');
    const id = tariffBlock.dataset.id;
    fetch(`/api/mobile-tariffs/${id}/`, {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': csrfToken,
      },
    })
    .then(response => {
      if (response.ok) {
        loadMobileTariffs();
      } else {
        return response.json().then(err => { throw err; });
      }
    })
    .catch(displayErrors);
  };

  document.getElementById('add-mobile-tariff-btn').addEventListener('click', () => {
    const form = document.getElementById('mobile-tariff-form-element');
    form.reset();
    form['id'].value = '';
    document.getElementById('mobile-tariff-form-title').innerText = 'Add Mobile Tariff';
    document.getElementById('mobile-tariff-form').style.display = 'block';
  });

  document.getElementById('mobile-tariff-form-element').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const id = form['id'].value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/mobile-tariffs/${id}/` : '/api/mobile-tariffs/';
    const data = {
      name: form['name'].value,
      provider: form['provider'].value,
      gb: form['gb'].value,
      sms: form['sms'].value,
      min: form['min'].value,
      cost: form['cost'].value,
      city_id: form['city_id'].value,
      additional_info: form['additional_info'].value,
    };

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify(data),
    })
    .then(handleResponse)
    .then(() => {
      document.getElementById('mobile-tariff-form').style.display = 'none';
      loadMobileTariffs();
    })
    .catch(displayErrors);
  });

  /** Load TV Tariffs **/

  const loadTVTariffs = () => {
    fetch('/api/tv-tariffs/')
      .then(handleResponse)
      .then(tariffs => {
        const tariffList = document.getElementById('tv-tariff-list');
        tariffList.innerHTML = '';
        tariffs.forEach(tariff => {
          const tariffBlock = `
            <div class="tariff-block" data-id="${tariff.id}">
              <h3>${tariff.name}</h3>
              <p>Provider: ${tariff.provider}</p>
              <p>Speed: ${tariff.speed}</p>
              <p>GB: ${tariff.gb}</p>
              <p>SMS: ${tariff.sms}</p>
              <p>Min: ${tariff.min}</p>
              <p>Number of Channels: ${tariff.number_of_channels}</p>
              <p>Cost: $${tariff.cost}</p>
              <p>City: ${tariff.city.name}</p>
              <p>Tariff: ${tariff.tariff_type.name}</p>
              <p>${tariff.additional_info}</p>
              <button class="edit-tv-tariff-btn">Edit</button>
              <button class="delete-tv-tariff-btn">Delete</button>
            </div>
          `;
          tariffList.innerHTML += tariffBlock;
        });
        addTVTariffEventListeners();
      })
      .catch(displayErrors);
  };

  /** CRUD Operations for TV Tariffs **/

  const addTVTariffEventListeners = () => {
    document.querySelectorAll('.edit-tv-tariff-btn').forEach(button => {
      button.addEventListener('click', handleEditTVTariff);
    });
    document.querySelectorAll('.delete-tv-tariff-btn').forEach(button => {
      button.addEventListener('click', handleDeleteTVTariff);
    });
  };

  const handleEditTVTariff = (e) => {
    const tariffBlock = e.target.closest('.tariff-block');
    const id = tariffBlock.dataset.id;
    fetch(`/api/tv-tariffs/${id}/`)
      .then(handleResponse)
      .then(tariff => {
        const form = document.getElementById('tv-tariff-form-element');
        form['id'].value = tariff.id;
        form['name'].value = tariff.name;
        form['provider'].value = tariff.provider;
        form['speed'].value = tariff.speed;
        form['gb'].value = tariff.gb;
        form['sms'].value = tariff.sms;
        form['min'].value = tariff.min;
        form['number_of_channels'].value = tariff.number_of_channels;
        form['cost'].value = tariff.cost;
        form['city_id'].value = tariff.city.id;
        form['home_type_id'].value = tariff.tariff_type.id;
        form['additional_info'].value = tariff.additional_info;
        document.getElementById('tv-tariff-form-title').innerText = 'Edit TV Tariff';
        document.getElementById('tv-tariff-form').style.display = 'block';
      })
      .catch(displayErrors);
  };

  const handleDeleteTVTariff = (e) => {
    const tariffBlock = e.target.closest('.tariff-block');
    const id = tariffBlock.dataset.id;
    fetch(`/api/tv-tariffs/${id}/`, {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': csrfToken,
      },
    })
    .then(response => {
      if (response.ok) {
        loadTVTariffs();
      } else {
        return response.json().then(err => { throw err; });
      }
    })
    .catch(displayErrors);
  };

  document.getElementById('add-tv-tariff-btn').addEventListener('click', () => {
    const form = document.getElementById('tv-tariff-form-element');
    form.reset();
    form['id'].value = '';
    document.getElementById('tv-tariff-form-title').innerText = 'Add TV Tariff';
    document.getElementById('tv-tariff-form').style.display = 'block';
  });

  document.getElementById('tv-tariff-form-element').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const id = form['id'].value;
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/tv-tariffs/${id}/` : '/api/tv-tariffs/';
    const data = {
      name: form['name'].value,
      provider: form['provider'].value,
      speed: form['speed'].value,
      sms: form['sms'].value,
      gb: form['gb'].value,
      min: form['min'].value,
      number_of_channels: form['number_of_channels'].value,
      cost: form['cost'].value,
      city_id: form['city_id'].value,
      tariff_type_id: form['home_type_id'].value,
      additional_info: form['additional_info'].value,
    };

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify(data),
    })
    .then(handleResponse)
    .then(() => {
      document.getElementById('tv-tariff-form').style.display = 'none';
      loadTVTariffs();
    })
    .catch(displayErrors);
  });

  /** Initial Load **/

  loadCities();
  loadHomeTypes();
  loadMobileTariffs();
  loadTVTariffs();
});