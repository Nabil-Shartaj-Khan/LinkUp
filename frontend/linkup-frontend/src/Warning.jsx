import { Link } from "react-router-dom";
import "./App.css"
const Warning = () => {
    return (
        <div className="not-found">
            <div className="found-text">
                <h1 className="display-1 text-danger">Login/Register required</h1>
                <p className="not-text fw-bold fs-3 my-4">Don't miss out on the fun! Join us now and enjoy all the features!</p>

                <Link to={"/login"} className="btn btn-primary py-3 mt-4">Login/Register</Link>

            </div>

        </div>
    );
}

export default Warning;