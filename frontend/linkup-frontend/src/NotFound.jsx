import { Link } from "react-router-dom";
import "./App.css"
const NotFound = () => {
    return (
        <div className="not-found">
            <div className="found-text">
                <h1 className="display-1 text-danger">Page not found!</h1>
                <p className="not-text">It's possible that the link is broken or the link isn't correct. Please check the link and try again!</p>
                <Link to={"/"} className="btn btn-primary py-3 mt-4">Return to homepage</Link>

            </div>

        </div>
    );
}

export default NotFound;