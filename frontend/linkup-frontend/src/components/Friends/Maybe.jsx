import "./Friends.css"
const Maybe = () => {
    return (
        <div className="friends-container text-white">
            <h3 className="text-white ms-4 mt-3 fw-bold fs-1">People perhaps <span className="text-info"> you know about</span></h3>
            <div className="friends-list  mt-5 d-flex justify-content-evenly">
                <div className="friends-info ">
                    <h2 className="text-info fw-bold">Washiun Nabi Khan</h2>
                    <h5>joined since: 15/04/2023</h5>
                </div>
                <div>
                    <button className="btn btn-primary me-4 fs-5 px-3">Add friend</button>
                    <button className="btn btn-danger fs-5 px-3">Remove from list</button>
                </div>
            </div>
        </div >
    );
}

export default Maybe;
