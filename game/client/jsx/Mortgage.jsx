import React from 'react';
import {gameService} from "./services/GameService";

const Mortgage = (props) => {

    const mortgageValue = Math.floor(props.property.price / 2);
    const tenPercent = Math.ceil(mortgageValue * 0.1);
    const mortgageBuyout = mortgageValue + tenPercent;

    const canMortgage = gameService.canMortgage(props.property, props.game);
    const isOwner = props.property.owner === gameService.currentPlayer;

    const toggleMortgage = () => gameService.toggleMortgageProperty(props.property, props.type)

    return (<div>
        <hr/>
        <div>
            Mortgage <small><a href="https://monopoly.fandom.com/wiki/Mortgage" target="_blank">(rules)</a></small>:
        </div>
        <div>
            Mortgage value: ${mortgageValue}
        </div>
        <div>
            To unmortgage pay: ${mortgageBuyout}
        </div>
        <div>
            To transfer mortgage: ${tenPercent}
        </div>
        {canMortgage && <div>
            <label>
                <input type="checkbox" checked={props.property.mortgaged} onChange={toggleMortgage}/>
                Mortgage property
            </label>
        </div>}

        {!canMortgage && isOwner && <div>
            <small><em>You can only mortgage if there are no remaining houses or hotel on any properties of this
                color</em></small>
        </div>}
    </div>)

}

export default Mortgage;