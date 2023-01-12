import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import useLoggedin from "../hooks/useLoggedin";

export default function Navbar() {

    const loggedin = useLoggedin()

    return (
        <Nav
            activeKey="/home"
        >
            <Nav.Item>
                <Nav.Link>
                    <Link to="/">Home</Link>
                </Nav.Link>
            </Nav.Item>
            {loggedin && (
                <>
                    <Nav.Item>
                        <Nav.Link>
                            <Link to="/favorites">Favorite Books</Link>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link onClick={
                            () => {
                                localStorage.removeItem("token")
                                window.location.href = "/login"
                            }
                        }>Log out</Nav.Link>
                    </Nav.Item>
                </>
            )
            }
            {!loggedin && (
                <>
                    <Nav.Item>
                        <Nav.Link>
                            <Link to="/login">Login</Link>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link>
                            <Link to="/singup">Singup</Link>
                        </Nav.Link>
                    </Nav.Item>
                </>
            )}
        </Nav>
    )
}