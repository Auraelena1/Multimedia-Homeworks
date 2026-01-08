let allAlbums = []; 

document.addEventListener("DOMContentLoaded", () => {
    fetch('library.json')
        .then(response => response.json())
        .then(data => {
            allAlbums = data;
            renderAlbums(allAlbums);
        })
        .catch(error => console.error('Error loading library:', error));

    document.getElementById('searchInput').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = allAlbums.filter(album => 
            album.artist.toLowerCase().includes(searchTerm) || 
            album.album.toLowerCase().includes(searchTerm)
        );
        renderAlbums(filtered);
    });
});


function renderAlbums(albums) {
    const grid = document.getElementById("album-grid");
    grid.innerHTML = ""; 

    if (albums.length === 0) {
        grid.innerHTML = '<p class="text-center text-muted">No albums found.</p>';
        return;
    }

    albums.forEach(album => {
        const col = document.createElement("div");
        col.className = "col-xl-2 col-md-3 col-sm-6 col-12";

        
        const imagePath = `assets/img/${album.thumbnail}`;

        col.innerHTML = `
            <div class="card h-100 shadow-sm custom-card">
                <img src="${imagePath}" class="card-img-top" alt="${album.album}" onerror="this.src='https://placehold.co/300?text=No+Image'">
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title fw-bold text-truncate" title="${album.artist}">${album.artist}</h6>
                    <p class="card-text text-muted small text-truncate" title="${album.album}">${album.album}</p>
                </div>
                <div class="card-footer bg-transparent border-top-0 p-3">
                    <button class="btn btn-outline-primary w-100 btn-sm" onclick="openModal(${album.id})">
                        View Tracklist
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(col);
    });
}


function openModal(albumId) {
    const album = allAlbums.find(a => a.id === albumId);
    if (!album) return;

    
    document.getElementById('modalTitle').textContent = `${album.artist} - ${album.album}`;

    
    let totalSeconds = 0;
    let minTrack = album.tracklist[0];
    let maxTrack = album.tracklist[0];

    album.tracklist.forEach(track => {
        const seconds = parseTime(track.trackLength);
        totalSeconds += seconds;

        if (parseTime(track.trackLength) < parseTime(minTrack.trackLength)) minTrack = track;
        if (parseTime(track.trackLength) > parseTime(maxTrack.trackLength)) maxTrack = track;
    });

    const avgSeconds = totalSeconds / album.tracklist.length;

  
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="alert alert-light border mb-3">
            <div class="row text-center">
                <div class="col-4">
                    <strong>Total Tracks</strong><br>${album.tracklist.length}
                </div>
                <div class="col-4">
                    <strong>Duration</strong><br>${formatTime(totalSeconds)}
                </div>
                <div class="col-4">
                    <strong>Avg Length</strong><br>${formatTime(avgSeconds)}
                </div>
            </div>
            <hr>
            <small class="d-block text-muted">Longest: ${maxTrack.title} (${maxTrack.trackLength})</small>
            <small class="d-block text-muted">Shortest: ${minTrack.title} (${minTrack.trackLength})</small>
        </div>

        <div class="table-responsive">
            <table class="table table-hover table-sm">
                <thead class="table-light">
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th class="text-end">Length</th>
                    </tr>
                </thead>
                <tbody>
                    ${album.tracklist.map(track => `
                        <tr>
                            <td>${track.number}</td>
                            <td>
                                <a href="${track.url}" target="_blank" class="text-decoration-none fw-bold text-dark">
                                    ${track.title} 🎵
                                </a>
                            </td>
                            <td class="text-end font-monospace">${track.trackLength}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    
    const playBtn = document.getElementById('modalPlayBtn');
    if (album.tracklist.length > 0) {
        playBtn.href = album.tracklist[0].url;
        playBtn.style.display = 'inline-block';
    } else {
        playBtn.style.display = 'none';
    }

    const myModal = new bootstrap.Modal(document.getElementById('albumModal'));
    myModal.show();
}

function parseTime(timeStr) {
    const parts = timeStr.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}


function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}