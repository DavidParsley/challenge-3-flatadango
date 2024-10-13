fetch("http://localhost:3000/films")
  .then((res) => res.json())
  .then((films) => {
    const leftMenu = document.getElementById("films");
    for (let film of films) {
      leftMenu.innerHTML += `
        <li class="film item" data-id="${film.id}">
          <h3 class="fw-bold border-bottom">${film.title}</h3>
          <button onclick="deleteMovie('${film.id}')" class="btn">Delete</button>
        </li>`;
    }

    const firstMovie = films[0];
    filmsInformation(firstMovie);
  });

function filmsInformation(film) {
  const filmTitle = document.querySelector('#title');
  const runTime = document.querySelector('#runtime');
  const showInfo = document.querySelector('#film-info');
  const showTime = document.querySelector('#showtime');
  const remainingTickets = document.querySelector('#ticket-num');
  const buyTicket = document.getElementById("buy-ticket");
  const filmPoster = document.querySelector('#poster');

  filmTitle.textContent = film.title;
  runTime.textContent = `${film.runtime} Minutes`;
  showInfo.textContent = film.description; 
  showTime.textContent = film.showtime;
  filmPoster.src = film.poster;

  const unsoldTickets = film.capacity - film.tickets_sold;
  remainingTickets.textContent = `${unsoldTickets} `;

  if (unsoldTickets > 0) {
    buyTicket.innerText = `Buy Ticket (${unsoldTickets})`; 
    buyTicket.onclick = () => buyingTicket(film.id, unsoldTickets); 
  } else {
    buyTicket.innerText = `Sold Out`; 
    buyTicket.disabled = true; 
  }
}

function buyingTicket(filmId, unsoldTickets) {
  console.log(`Buying ticket for film ID: ${filmId}, Remaining tickets: ${unsoldTickets}`);
  if (unsoldTickets > 0) {
    fetch(`http://localhost:3000/films/${filmId}`)
      .then((res) => res.json())
      .then(film => {
        const newTicketNum = film.tickets_sold + 1;

        fetch(`http://localhost:3000/films/${filmId}`, {
          method: "PATCH",
          body: JSON.stringify({ tickets_sold: newTicketNum }),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(() => {
          return fetch('http://localhost:3000/tickets', {
            method: 'POST',
            body: JSON.stringify({
              film_id: filmId,
              number_of_tickets: 1,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }).then(() => {
          filmsInformation(film);
        });
      });
  }
}

function deleteMovie(id) {
  fetch(`http://localhost:3000/films/${id}`, {
    method: 'DELETE',
  })
  .then(() => {
    const movieID = document.querySelector(`li[data-id='${id}']`);
    if (movieID) {
      movieID.remove();
    }
  });
}


  








