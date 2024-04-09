import "./Welcome.css";
import linkup from "../../assets/linkup.jpg";
import { Link } from "react-router-dom";

const Welcome = () => {
    return (
        <div className="welcome-section">
            <div className="d-flex justify-content-between">
                <div className="text-container">
                    <h1>Link<span className="text-info">up</span></h1>
                    <p className="fs-3">Bringing connections closer, effortlessly</p>
                    <span className="text-info fw-bold fs-5">Anytime, anywhere!</span>
                    <div className="pt-5 mt-3">
                        <Link to={"/login"} className="btn btn-primary px-4 py-3 me-4 fs-4">Get started</Link>
                    </div>

                </div>
                <div className="image-container">
                    <img src={linkup} className="linkup-image" alt="Linkup Image" />
                </div>

            </div>

        </div>
    );
}

export default Welcome;
