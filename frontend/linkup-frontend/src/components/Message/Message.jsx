import "./Message.css"
const Message = () => {
    return (
        <div className="message-box">
            <h3 className="text-white ms-4 mt-3 fw-bold fs-1 mb-4">My <span className="text-info">chats</span></h3>
            <div className="display-chats">
                <div className="chat-list">
                    <ul style={{ listStyleType: "none" }} className="text-white">
                        <li>Nabil Shartaj Khan</li>
                        <li>Washiun Nabi Khan</li>
                        <li>Lionel Messi</li>
                        <li>Zlatan Ibrahimovic</li>
                    </ul>
                </div>
                <div className="message-show">
                    <div className="container">
                        <h1 className="text-white text-center fw-bold">Nabil Shartaj Khan</h1>
                        <div className="message-here">
                            {/* display message here */}
                        </div>
                        <input className="message-input"></input> <button className="btn btn-info">Send Message</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Message;