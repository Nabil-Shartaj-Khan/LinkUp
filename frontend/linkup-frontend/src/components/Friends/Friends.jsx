import "./Friends.css"
import { Link } from 'react-router-dom';
const Friends = () => {
    return (
        <div className="friends-container text-white">
            <div className="d-flex justify-content-around">
                <h3 className="text-white ms-4 mt-3 fw-bold fs-1">My Cherished <span className="text-info"> companions</span></h3>
                <Link to={"/maybe_friends"} className="btn btn-success">Probable friends</Link>
            </div>
            <div className="friends-list  mt-5 d-flex justify-content-evenly">
                <div className="friends-info ">
                    <h2 className="text-info fw-bold">Washiun Nabi Khan</h2>
                    <h5>Friends since: 15/04/2023</h5>
                </div>
                <div>
                    <button className="btn btn-primary me-4 fs-5 px-3">Message</button>
                    <button className="btn btn-danger fs-5 px-3">Unfriend</button>
                </div>
            </div>
        </div >
    );
}

export default Friends;
