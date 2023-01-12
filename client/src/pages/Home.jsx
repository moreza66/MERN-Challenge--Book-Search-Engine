import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Form from 'react-bootstrap/Form';
import axios from "axios";
import getToken from "../hooks/getToken";
import useLoggedin from "../hooks/useLoggedin";

export default function Home() {
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)
    const [books, setBooks] = useState([])



    const loggedin = useLoggedin()

    const token = getToken()

    const handleSearch = (e) => {
        e.preventDefault()
        setLoading(true)
        axios.get('https://www.googleapis.com/books/v1/volumes/?q=' + search).then(res => {
            setBooks(res.data.items)
            setLoading(false)
        })
    }

    return (
        <>
            <div className="container">
                {loggedin ? (
                    <div className="w-4/6 bg-white shadow-md rounded-md mx-auto p-4">
                        <h1>Search Book</h1>
                        <Form onSubmit={handleSearch}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control
                                    type="text"
                                    placeholder="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                        {loading && (
                            <p>Loading...</p>
                        )}
                        <div className="grid grid-cols-3 gap-4">
                            {books && books.map((book) => (
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
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                                            onClick={(e) => {
                                                axios.post('/user/addFavorite/' + book.id, {}, {
                                                    headers: {
                                                        Authorization: `Bearer ${token}`
                                                    }
                                                }).then(res => {
                                                    e.target.innerText = "Added to favorites"
                                                }).catch(err => {
                                                    e.target.innerText = "Already added to favorites"
                                                })
                                            }}
                                        >Add to favorites</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>
                        You are not logged in. Please <Link to="/login">login</Link>
                    </p>
                )}
            </div>
        </>
    )
}