fetch('load_items.php')
    .then(res => res.json())
    .then(data => {
        const tbody = document.querySelector('#itemsTable tbody');
        const searchInput = document.getElementById('searchInput');
        const pagination = document.getElementById('pagination');

        const itemsPerPage = 10;
        let currentPage = 1;
        let filteredRows = [];


function createRow(key, item) {
    const row = document.createElement('tr');
     // Obrazek przedmiotu ładowany z folderu ox_inventory/web/images, podmień jak trzeba
    row.innerHTML = `
        <td>
            <img src="ox_inventory/web/images/${key}.png" alt="${item.label}"
                 onerror="this.src='error.png'" 
                 style="max-width: 40px; max-height: 40px;">
        </td>
        <td class="item-name">${item.label || key}</td>
        <td>${item.description || 'Brak opisu'}</td>
        <td>${item.weight !== undefined ? item.weight : '–'}</td>
        <td>${item.stack !== undefined ? (item.stack ? '✅' : '❌') : '–'}</td>
        <td class="text-muted">${key}</td>
    `;
    return row;
}



        function filterRows(searchTerm = '') {
            searchTerm = searchTerm.toLowerCase();
            filteredRows = [];

            for (const [key, item] of Object.entries(data)) {
                const name = (item.label || key).toLowerCase();
                if (name.includes(searchTerm)) {
                    const row = createRow(key, item);
                    filteredRows.push(row);
                }
            }

            currentPage = 1;
            renderPage();
            renderPagination();
        }


        function renderPage() {
            tbody.innerHTML = '';

            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;

            const pageItems = filteredRows.slice(start, end);
            pageItems.forEach(row => tbody.appendChild(row));
        }


        function renderPagination() {
            pagination.innerHTML = '';
            const totalPages = Math.ceil(filteredRows.length / itemsPerPage);

            if (totalPages <= 1) return;

            for (let i = 1; i <= totalPages; i++) {
                const li = document.createElement('li');
                li.className = 'page-item' + (i === currentPage ? ' active' : '');
                li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
                li.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPage = i;
                    renderPage();
                    renderPagination();
                });
                pagination.appendChild(li);
            }
        }

  
        searchInput.addEventListener('input', () => {
            filterRows(searchInput.value);
        });


        filterRows(); 
    })
    .catch(error => {
        console.error('Błąd podczas ładowania danych:', error);
    });
