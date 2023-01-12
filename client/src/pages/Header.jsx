import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Header() {


    return (
        <div className="w-full bg-gray-100 mb-8">
            <div className="container text-center py-4">
                <Link to="/">Search Book</Link>
            </div>
            <div className="flex justify-center">
                <Navbar />
            </div>
        </div>
    )
}