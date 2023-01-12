import useLogin from "../hooks/useLogin"
import { Helmet } from "react-helmet"
import { useEffect, useState } from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import useLoggedin from "../hooks/useLoggedin";

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(false)

    const { onLogin } = useLogin()

    const loggedin = useLoggedin()

    useEffect(() => {
        if (loggedin) {
            window.location.href = "/"
        }
    }, [loggedin])

    const handleLogin = (e) => {
        e.preventDefault()
        onLogin(email, password, () => {
            window.location.href = "/"
        }, () => {
            setError(true)
        })
    }


    return (
        <div className="w-full my-8">
            <Helmet>
                <title>Login</title>
            </Helmet>
            <div className="container">
                <div className="w-full md:w-3/4 lg:w-2/4 xl:w-1/4 mx-auto">
                    <h1 className="mb-4">Login</h1>
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

                        <Button variant="primary" type="submit" onClick={handleLogin}>
                            Login
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    )
}