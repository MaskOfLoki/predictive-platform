import m from 'mithril';
import {PrizeHoldersComponent, PrizeHolderType} from './prize-holders.component';
import {PrizeHolderComponent} from './prize-holder/prize-holder.component';

export function template(ctrl: PrizeHoldersComponent) {
    const data = [];

    if (ctrl.game) {
        data.push({
            type: PrizeHolderType.EVENT,
            sessionId: ctrl.game.sessionId,
            name: ctrl.game.event.id,
        });

        ctrl.game.event.data.forEach(questionSet =>
            data.push({
                type: PrizeHolderType.SET,
                sessionId: ctrl.game.sessionId,
                name: questionSet.name,
            }));
    }

    return (
        <div class='gc-prize-holders'>
            <PrizeHolderComponent type={PrizeHolderType.OVERALL}/>
            {data.map(item =>
                <PrizeHolderComponent type={item.type}
                                      sessionId={item.sessionId}
                                      name={item.name}/>)}
        </div>
    );
}
