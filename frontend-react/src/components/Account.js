import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Account = () => {
    const [userRoleId, setUserRoleId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // get user role id
        const userRoleId = localStorage.getItem('user_role_id');
        setUserRoleId(userRoleId);

        if (!userRoleId) {
            // if no role found, not logged in so navigate to login
            navigate('/login');
        } else {
            // mapping user role to account page
            switch (userRoleId) {
                // patient
                case '1':
                    navigate('/patient_account');
                    break;
                //  medical staff
                case '2':
                    navigate('/staff_account');
                    break;
                // admin
                case '3':
                    navigate('/admin_account');
                    break;
                // default to home if any issues
                default:
                    navigate('/home');
                    break;
            }
        }
    }, [navigate]);

    return null;
};

export default Account;
