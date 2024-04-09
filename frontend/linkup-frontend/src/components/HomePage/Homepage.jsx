import { Link } from "react-router-dom";
import "./Homepage.css"
const Homepage = () => {
    const username = localStorage.getItem('username');
    return (
        <div>
            <div className="box-container d-flex justify-content-center text-white text-center">
                <Link to="/profile" style={{ textDecoration: 'none' }}><li>Profile</li></Link>
                <Link to="/messages" style={{ textDecoration: 'none' }}><li>Messages</li></Link>
                <Link to="/friends" style={{ textDecoration: 'none' }}><li>Friends</li></Link>
                <Link to="/create-post" style={{ textDecoration: 'none' }}><li>Create Post</li></Link>
                <Link to="/notifications" style={{ textDecoration: 'none' }}><li>Notification</li></Link>
            </div>

            <h1 className="text-center my-5 text-warning">Good evening, <span className="fw-bold text-success">{username}!</span></h1>
            <section className="post-section">
                <div className="container">
                    <div className="post-box">
                        <h4 className="fw-bold text-white" >Nabil Shartaj Khan</h4>
                        <span className="fw-bold text-info">05-03-2024 at 03:00 PM</span>
                        <p className="fs-5 mt-4 border border-1 border-secondary p-5 text-white">My first post in my own built app. Great start eh? 😋</p>
                        <div className="button-box text-center mt-4">
                            <button className="btn btn-primary py-2 px-4 me-5 fw-bold">Like</button>
                            <button className="btn btn-primary py-2 px-4 me-5 fw-bold">Comment</button>
                            <button className="btn btn-primary py-2 px-4 me-5 fw-bold">Share</button>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Homepage;