const loadHomeTypes = () => {
    fetch('/api/home-types/')
      .then(handleResponse)
      .then(home_types => {
        const cityList = document.getElementById('home-type-list');
        home_type_List.innerHTML = '';
        home_types.forEach(home_type => {
          const home_type_Block = `
            <div class="city-block" data-id="${home_type.id}">
              <p>${home_type.name}</p>
              <p>${home_type.in_name}</p>
              <button class="edit-city-btn">Edit</button>
              <button class="delete-city-btn">Delete</button>
            </div>
          `;
          home_type_List.innerHTML += home_type_Block;
        });
        addHomeTypeEventListeners();
        populateCitySelectOptions();
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

  const handleDeleteCity = (e) => {
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