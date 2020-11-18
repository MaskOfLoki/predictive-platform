import m from 'mithril';
import {CouponsComponent} from './coupons.component';
import {UserRowComponent} from './user-row/user-row.component';
import {PaginationComponent} from './pagination/pagination.component';
import {configService} from '../../../../../services/ConfigService';
import {ToggleComponent} from '../../../../toggle/toggle.component';
import {Feature} from '../../../../../../../../../common';

export function template(ctrl: CouponsComponent) {
    const allLeaderboardEntries = configService.features[Feature.allLeaderboardEntries];
    return (
        <div class='gc-coupons-popup'>
            <div class='header'>
                <div class='left'>
                    COUPONS
                </div>
                <div class='right'>
                    <div class='button'
                         onclick={ctrl.buttonCloseHandler.bind(ctrl)}>X
                    </div>
                </div>
            </div>
            <div class='content'>
                <div class='group-left'>
                    <div class='group-coupons'>
                        {ctrl.coupons.map(coupon =>
                            <div class={`group-coupon${ctrl.selectedCoupon === coupon ? ' selected' : ''}`}
                                 onclick={ctrl.couponSelectHandler.bind(ctrl, coupon)}>
                                <div class='image'
                                     style={{backgroundImage: `url(${coupon.image.url})`}}/>
                                <div class='name'>{coupon.name}</div>
                            </div>)}
                    </div>
                    <div class='group-random-award'>
                        <div class='random-toggle'>
                            <ToggleComponent
                                label='RANDOM AWARDING'
                                selected={ctrl.randomAwards}
                                onchange={value => ctrl.randomAwards = value}/>
                        </div>
                        <div class={`amount-input ${ctrl.randomAwards ? '' : 'disabled'}`}>
                            <label>AMOUNT</label>
                            <input
                                class='gc-input'
                                type='number'
                                onchange={ctrl.onRandomAmountChange.bind(ctrl)}
                                value={ctrl.randomAwardAmount}/>
                        </div>
                    </div>
                </div>
                <div class='group-right'>
                    <div class='group-controls'>
                        <div class='gc-button button-select'
                             onclick={ctrl.buttonSelectHandler.bind(ctrl)}>
                            {ctrl.selectedUsers.length === ctrl.allUsers.length ? 'DESELECT ALL' : 'SELECT ALL'}
                        </div>
                        {allLeaderboardEntries && <div class='gc-button button-select'
                                                       onclick={ctrl.buttonSelectScoredHandler.bind(ctrl)}>
                            SELECT W/ SCORES
                        </div>}
                        {allLeaderboardEntries && <div class='gc-button button-select'
                                                       onclick={ctrl.buttonSelectUnscoredHandler.bind(ctrl)}>
                            SELECT WO/ SCORES
                        </div>}
                        <div class='gc-button'
                             onclick={() => {
                                 ctrl.reset();
                                 ctrl.refresh();
                             }}>
                            REFRESH
                        </div>
                        <PaginationComponent current={ctrl.leadersResponse.current}
                                             total={ctrl.leadersResponse.total}
                                             pageSize={ctrl.leadersResponse.pageSize}
                                             onchange={ctrl.paginationChangeHandler.bind(ctrl)}/>
                        {ctrl.selectedUsers.length > 0 &&
                        <div class='message' onclick={ctrl.messageHandler.bind(ctrl)}/>}
                        {ctrl.selectedUsers.length > 0 && configService.email &&
                        <div class='email-message' onclick={ctrl.emailHandler.bind(ctrl)}/>}
                    </div>
                    <div class='grid-users'>
                        <div class='grid-header'>
                            <div class='cell place'>
                                Place
                            </div>
                            <div class='cell'>
                                Username
                            </div>
                            <div class='cell points'>
                                Points
                            </div>
                            <div class='cell'>
                                Phone Number
                            </div>
                            <div class='cell'>
                                Email
                            </div>
                            <div class='cell coupon'>
                                Coupon Status
                            </div>
                        </div>
                        {ctrl.users.map(user =>
                            <UserRowComponent user={user}
                                              selected={ctrl.selectedUsers.findIndex(u => u.uid === user.uid) !== -1}
                                              onchange={ctrl.userSelectChangeHandler.bind(ctrl)}/>)}
                    </div>
                </div>

            </div>
            <div class='buttons'>
                <div class='button'
                     onclick={ctrl.buttonAwardHandler.bind(ctrl)}>
                    AWARD SELECTED
                </div>
                <div class='line'/>
                <div class='button'
                     onclick={ctrl.buttonAwardLosersHandler.bind(ctrl)}>
                    AWARD LOSERS
                </div>
            </div>
        </div>
    );
}
