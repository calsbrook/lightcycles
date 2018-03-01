import React from 'react';
import './ProfilePage.css';

const ProfilePage = (props) => {
    return (
        <div>
            <h1>{props.user.name}</h1>
            <h4>Winrate: {(props.user.wins) ? Math.floor(((props.user.wins) / (props.user.losses + props.user.wins) ) * 100): 0}%</h4>
            <h4>Wins: {props.user.wins}</h4>
            <h4>Losses: {props.user.losses}</h4>
            <h4>Color: {props.user.color}</h4>
        </div>
    )
}

export default ProfilePage;