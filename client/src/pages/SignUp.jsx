
import { Helmet } from "react-helmet"
import { useState } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from "axios";


export default function SingUp() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState('')


    const handleRegister = (e) => {
        e.preventDefault()
        axios.post('user/register', {
            email,
            password
        }).then((res) => {
            if (res.status === 200) {
                window.location.href = "/"
                localStorage.setItem("token", res.data.token)
            } else {
                console.log('err', res.data);
            }
        }).catch((err) => {
            setError(err.response.data.message)
            console.log('err', err);
        })
    }


    return (
        <div className="w-full my-8">
            <Helmet>
                <title>Sing up</title>
            </Helmet>
            <div className="container">
                <div className="w-full md:w-3/4 lg:w-2/4 xl:w-1/4 mx-auto">
                    <h1 className="mb-4">Sing up</h1>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }
                                }
                                type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }
                                }
                                type="password" placeholder="Password" />
                        </Form.Group>
                        {error != '' && (
                            <div className="w-full my-2">
                                <span className="text-red-600">
                                    {error}
                                </span>
                            </div>
                        )}
                        <Button variant="primary" type="submit" onClick={handleRegister}>
                            Sign up
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    )
}