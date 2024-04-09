import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Profile.css";

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProfileData(response.data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
                setError('Error fetching profile data. Please try again.');
            }
        };;

        fetchProfileData();
    }, []);

    if (error) {
        return <div className="error-message text-white fs-1 text-center my-5 ">{error}</div>;
    }

    if (!profileData) {
        return <div className="loading-message text-white fs-1 text-center my-5">Loading profile data...</div>;
    }

    return (
        <div className="profile-box text-white">
            <div className="name-box d-flex justify-content-between">
                <div>
                    <h2 className="display-5 fw-bold text-info my-3">{profileData.username}</h2>
                    <span className="fs-4"><b>Total friends:</b> {profileData.total_friends}</span><br></br>
                    <span className="fs-4"><b>Joined on:</b> {new Date(profileData.registration_date).toLocaleDateString()}</span>
                </div>
                <div>
                    <button className="edit-btn btn btn-primary py-3 px-4 fs-5">Edit profile</button>
                </div>
            </div>
            <div className="info-container d-flex justify-content-evenly">
                <div className="contact-info border border-3 border-secondary">
                    <h1 className="fw-bold">Contact Information</h1>
                    <span><b>Email: </b>{profileData.email}</span><br />
                    <span><b>Phone: </b>{profileData.phone}</span>
                </div>
                <div className="personal-info border border-3 border-secondary">
                    <h1 className="fw-bold">Personal Information</h1>
                    <span><b>Gender: </b>{profileData.gender}</span><br />
                    <span><b>Country: </b>{profileData.country}</span><br />
                </div>
                <div className="account-status border border-3 border-secondary">
                    <h1 className="fw-bold">Account status</h1>
                    {profileData.active_status === 1 ? <p className="text-success fs-2 text-center">Active</p> : <p className="text-danger fs-2 text-center">Inactive</p>}
                </div>
            </div>
        </div >
    );
};

export default Profile;
