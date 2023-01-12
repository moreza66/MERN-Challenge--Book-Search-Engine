import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import getToken from '../hooks/getToken'

export default function FavoriteBooks() {


    const token = getToken()

    const [books, setBooks] = useState([])
    const [getBooks, setGetBooks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        try {
            axios.get("/user/favorites", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then((res) => {
                if (res.data.favorites.length > 0) {
                    setBooks(res.data.favorites)
                }
                setLoading(false)
            })
        } catch (err) {
            console.log(err);
        }
    }, [])

    useEffect(() => {
        console.log(books);
        books && books.map((book) => {
            axios.get(`https://www.googleapis.com/books/v1/volumes/${book.bookID}`).then((res) => {
                setGetBooks(getBooks => [...getBooks, res.data])
            }).catch((err) => {
                console.log(err);
            })
        }
        )
    }, [books])

    return (
        <div className="w-4/6 bg-white shadow-md rounded-md mx-auto p-4">
            <h1>Manage Books</h1>
            <div className="grid grid-cols-3 gap-4 mt-4">
                {getBooks && getBooks.map((book) => (
                    <div
                        key={book.id}
                        className="w-full my-2">
                        <div className="w-full">
                            <img
                                src={book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : ''}
                                alt={book.volumeInfo.title}
                                className="w-full object-cover rounded-md" />
                        </div>
                        <div className="w-full flex flex-col p-2">
                            <span>Title: {book.volumeInfo.title}</span>
                            <span className="mt-4">Author: {book.volumeInfo.authors ? book.volumeInfo.authors[0] : ''}</span>
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
                                onClick={(e) => {
                                    axios.post('/user/removeFavorite/' + book.id, {}, {
                                        headers: {
                                            Authorization: `Bearer ${token}`
                                        }
                                    }).then(res => {
                                        e.target.innerText = "Removed from favorites"
                                        setGetBooks(getBooks.filter(b => b.id !== book.id))
                                    }).catch(err => {
                                        e.target.innerText = "Error"
                                    })
                                }}
                            >
                                Remove from favorites
                            </button>
                        </div>
                    </div>
                ))}
                {loading && <div>Loading...</div>}

                {books.length === 0 && !loading && <div>No books found</div>}
            </div>
        </div>
    )
}