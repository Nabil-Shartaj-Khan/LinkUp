import "./Notification.css"
const Notification = () => {
    return (
        <div className="notification-container">
            <h3 className="text-white ms-4 mt-3 fw-bold fs-1">My <span className="text-info">alerts</span></h3>
            <div className="noti-container">
                <ul style={{ listStyle: "none" }}>
                    <li><span className="text-warning">Nabil Shartaj Khan</span> Liked your post.</li>
                    <li><span className="text-warning">Nabil Shartaj Khan </span> commented on your post.</li>
                    <li>Welcome to Linkup mate!</li>
                </ul>
            </div>
        </div>
    );
}

export default Notification;