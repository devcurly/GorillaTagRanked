// Mock data for players and tournaments
// const mockPlayers = [
   // { id: 1, name: "GorillaMaster", runtime: "01:45", tagCount: 78, rp: 1750, rank: "Master" },
// ];

const mockTournaments = [
    {
        id: 1,
        title: "Summer Championship 2025",
        date: "June 15-20, 2025",
        prize: "$5,000",
        status: "upcoming",
        description: "The biggest summer tournament with special challenges!",
        registrationOpen: true
    },
    {
        id: 2,
        title: "Weekly Challenge Cup",
        date: "May 10, 2025",
        prize: "$500",
        status: "upcoming",
        description: "Weekly competition for all rank tiers",
        registrationOpen: true
    },
    {
        id: 3,
        title: "Pro Invitational",
        date: "May 25, 2025",
        prize: "$2,000",
        status: "upcoming",
        description: "Invitation-only tournament for Diamond+ players",
        registrationOpen: false
    },
    {
        id: 4,
        title: "Newcomer's Tournament",
        date: "May 18, 2025",
        prize: "$300",
        status: "upcoming",
        description: "Special event for Bronze and Silver players",
        registrationOpen: true
    },
    {
        id: 5,
        title: "Spring Showdown 2025",
        date: "April 10-12, 2025",
        prize: "$3,000",
        status: "past",
        description: "Seasonal tournament with unique challenges",
        winner: "GorillaMaster"
    },
    {
        id: 6,
        title: "Tag Team Challenge",
        date: "March 28, 2025",
        prize: "$1,500",
        status: "past",
        description: "2v2 team tournament with special rules",
        winner: "TreeClimber & VRMonke"
    }
];

// Variables for pagination and filtering
let currentPage = 1;
const playersPerPage = 10;
let filteredPlayers = [...mockPlayers];
let currentSort = "rank";
let currentSortDirection = "desc";

// Function to initialize the rankings table
function initRankings() {
    // Set up event listeners
    document.getElementById('playerSearch').addEventListener('input', function() {
        filterPlayersBySearch(this.value);
    });

    document.getElementById('sortBy').addEventListener('change', function() {
        currentSort = this.value;
        sortPlayers(currentSort, currentSortDirection);
        renderPlayers();
    });

    document.getElementById('prevPage').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderPlayers();
        }
    });

    document.getElementById('nextPage').addEventListener('click', function() {
        const maxPage = Math.ceil(filteredPlayers.length / playersPerPage);
        if (currentPage < maxPage) {
            currentPage++;
            renderPlayers();
        }
    });

    // Initial render
    sortPlayers(currentSort, currentSortDirection);
    renderPlayers();
}

// Function to filter players based on search input
function filterPlayersBySearch(searchTerm) {
    searchTerm = searchTerm.toLowerCase();

    filteredPlayers = mockPlayers.filter(player => {
        return player.name.toLowerCase().includes(searchTerm) ||
            player.rank.toLowerCase().includes(searchTerm);
    });

    currentPage = 1;
    renderPlayers();
}

// Function to sort players
function sortPlayers(sortBy, direction) {
    filteredPlayers.sort((a, b) => {
        let comparison = 0;
        switch(sortBy) {
            case 'rank':
                // Convert rank to numeric value for sorting
                const rankValues = {
                    'Master': 6,
                    'Diamond': 5,
                    'Platinum': 4,
                    'Gold': 3,
                    'Silver': 2,
                    'Bronze': 1
                };
                comparison = rankValues[b.rank] - rankValues[a.rank];
                break;
            case 'rp':
                comparison = b.rp - a.rp;
                break;
            case 'tagCount':
                comparison = b.tagCount - a.tagCount;
                break;
            case 'runtime':
                // Convert runtime to seconds for comparison
                const getSeconds = (time) => {
                    const [minutes, seconds] = time.split(':').map(Number);
                    return minutes * 60 + seconds;
                };
                comparison = getSeconds(a.runtime) - getSeconds(b.runtime);
                break;
            default:
                comparison = b.rp - a.rp;
        }

        return direction === 'asc' ? -comparison : comparison;
    });
}

// Function to render players table
function renderPlayers() {
    const tableBody = document.getElementById('rankingsBody');
    if (!tableBody) return; // Safety check

    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * playersPerPage;
    const endIndex = Math.min(startIndex + playersPerPage, filteredPlayers.length);
    const playersToShow = filteredPlayers.slice(startIndex, endIndex);

    playersToShow.forEach((player, index) => {
        const row = document.createElement('tr');

        // Add class based on rank for potential styling
        row.classList.add(player.rank.toLowerCase());

        // Create cells
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${player.name}</td>
            <td>${player.rp}</td>
            <td>${player.tagCount}</td>
            <td>${player.runtime}</td>
        `;

        tableBody.appendChild(row);
    });

    // Update pagination display
    const currentPageEl = document.getElementById('currentPage');
    if (currentPageEl) {
        currentPageEl.textContent = `Page ${currentPage} of ${Math.max(1, Math.ceil(filteredPlayers.length / playersPerPage))}`;
    }

    // Update button states
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage >= Math.ceil(filteredPlayers.length / playersPerPage);
}

// Function to initialize tournaments
function initTournaments() {
    const tournamentsContainer = document.getElementById('tournamentsContainer');
    if (!tournamentsContainer) return; // Safety check

    // Initial render of upcoming tournaments (default view)
    filterTournaments('upcoming');
}

// Function to filter tournaments
function filterTournaments(status) {
    const tournamentsContainer = document.getElementById('tournamentsContainer');
    if (!tournamentsContainer) return; // Safety check

    tournamentsContainer.innerHTML = '';

    const filteredTournaments = mockTournaments.filter(tournament => tournament.status === status);

    if (filteredTournaments.length === 0) {
        tournamentsContainer.innerHTML = `<p class="no-tournaments">No ${status} tournaments found.</p>`;
        return;
    }

    filteredTournaments.forEach(tournament => {
        const tournamentCard = document.createElement('div');
        tournamentCard.classList.add('tournament-card');

        let cardContent = `
            <img src="/api/placeholder/300/150" alt="${tournament.title}" class="card-image">
            <div class="card-content">
                <h4 class="tournament-title">${tournament.title}</h4>
                <p class="tournament-date">${tournament.date}</p>
                <p class="tournament-prize">Prize Pool: ${tournament.prize}</p>
                <div class="card-actions">
        `;

        if (tournament.status === 'upcoming' && tournament.registrationOpen) {
            cardContent += `<button class="register-btn">Register</button>`;
        } else if (tournament.status === 'upcoming' && !tournament.registrationOpen) {
            cardContent += `<button class="register-btn" disabled>Invite Only</button>`;
        } else if (tournament.status === 'past') {
            cardContent += `<span>Winner: ${tournament.winner}</span>`;
        } else if (tournament.status === 'ongoing') {
            cardContent += `<button class="register-btn">Watch Live</button>`;
        }

        cardContent += `
                    <a href="#" class="details-link">View Details</a>
                </div>
            </div>
        `;

        tournamentCard.innerHTML = cardContent;
        tournamentsContainer.appendChild(tournamentCard);
    });
}

// Execute on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');

    // Check which page we're on and initialize accordingly
    if (document.getElementById('rankingsTable')) {
        console.log('Initializing rankings page');
        initRankings();
    }

    if (document.getElementById('tournamentsContainer')) {
        console.log('Initializing tournaments page');
        initTournaments();
    }

    // Initialize filter buttons if they exist
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        console.log('Setting up filter buttons');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                filterTournaments(filter);

                // Update active button
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
    }

    // Force initial render for rankings page
    if (document.getElementById('rankingsBody')) {
        console.log('Forcing initial player rendering');
        filteredPlayers = [...mockPlayers]; // Reset filtered players
        sortPlayers(currentSort, currentSortDirection);
        renderPlayers();
    }
});


