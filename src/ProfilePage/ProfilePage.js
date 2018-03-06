import React from 'react';
import {ProgressBar} from 'react-materialize'
import './ProfilePage.css';

// const barStyle = {
//         height: '24px',
//         width: ((props.user.wins) ? Math.floor(((props.user.wins) / (props.user.losses + props.user.wins) ) * 100): 0) + '%'
// }
const ProfilePage = (props) => {
    return (
        <div>
            <h1>{props.user.name}</h1>
            <h4>Winrate: {(props.user.wins) ? Math.floor(((props.user.wins) / (props.user.losses + props.user.wins) ) * 100): 0}%</h4>
            <div className="progress">
                <ProgressBar 
                    progress={(props.user.wins) ? Math.floor(((props.user.wins) / (props.user.losses + props.user.wins) ) * 100): 0}
                    color="yellow"
                />
            </div>
            <h4>Wins: {props.user.wins}</h4>
            <h4>Losses: {props.user.losses}</h4>
        </div>
    )
}

export default ProfilePage;