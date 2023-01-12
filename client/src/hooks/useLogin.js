import axios from "axios";
import { useEffect, useState } from "react";

export default function useLogin() {
    const [login, setLogin] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setLogin(true);
            setUser(token);
        }
    }, []);

    const onLogin = async (email, password, callback, onError) => {
        try {
            const { data } = await axios.post("/user/login", {
                email,
                password
            });
            if (!data.token) {
                throw new Error("No token");
                return
            }

            localStorage.setItem("token", data.token);
            setLogin(true);
            setUser(data.token);
            callback();
        } catch (error) {
            setError(error.response.data);
            onError();
        }
    };

    return { login, user, error, onLogin };
}
