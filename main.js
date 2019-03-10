console.log('running')

const app = new Vue({
    el: '#app',
    data: {
        title: 'Sci-fi Movies to Watch',
        movies: [],
        apiURL: 'https://yts.am/api/v2/list_movies.json?genre=Sci-Fi&minimum_rating=8&sort_by=rating',
        page: 1,
        totalPages: 0,
        noMore: false
    },
    methods: {
        async getMovies() {
            const raw = await fetch(this.apiURL)
            const {
                data
            } = await raw.json()
            this.movies = data.movies
            const pagesQtd = data.movie_count / this.howManyMovies()
            if (JSON.stringify(pagesQtd).split('.')[1])
                this.totalPages = Math.floor(pagesQtd) + 1
            else
                this.totalPages = pagesQtd
        },
        howManyMovies() {
            const movieCardSize = 658.328
            const app = document.querySelector('#app')
            const limit = Math.floor(Math.floor(app.offsetWidth / movieCardSize)) + 1
            return limit < 2 ? 2 : limit
        },
        async getNextPage() {
            if (this.page == this.totalPages) return
            this.page++
            const raw = await fetch(`${this.apiURL}&page=${this.page}`)
            const {
                data
            } = await raw.json()

            data.movies.forEach(m => this.movies.push(m))
            localStorage.setItem('movies', JSON.stringify(this.movies))

            this.page = data.page_number
        },
        magnetURL({torrent_hash}){}
    },
    mounted() {
        this.apiURL += '&limit=' + this.howManyMovies()
        this.getMovies()
        const next = this.getNextPage
        const movies = document.querySelector('.movie-list')
        movies.addEventListener('scroll', (e) => {
            window.event = e
            if (movies.scrollWidth - movies.scrollLeft < movies.clientWidth + 1) {
                next()
            }
        });
    }
})