import React from 'react';
export default function Users() {
    const renderUser = user => {
        return (
            <li key={user._id} className="list__item user">
                <h3 className="user__name">{user.name}</h3>
                <p className="user__points">{user.points}</p>
            </li>
        );
    };
    return (
        <ul className="list">
            {(users && users.length > 0) ? (
                users.map(user => renderUser(user))
            ) : (
                    <p>No users found</p>
                )}
        </ul>
    );
}