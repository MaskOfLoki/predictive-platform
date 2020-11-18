import m from 'mithril';
import {MobilePreviewComponent} from './mobile-preview.component';
import {MobileHeaderComponent} from './mobile-header/mobile-header.component';
import {TOSPageComponent} from './tos-page/tos-page.component';
import {RankScreenComponent} from './rank-screen/rank-screen.component';
import {HomeScreenComponent} from './home-screen/home-screen.component';
import {PlayScreenComponent} from './play-screen/play-screen.component';

export function template(ctrl: MobilePreviewComponent) {
    const style: any = {};

    if (ctrl.config.background) {
        style.backgroundImage = `url(${ctrl.config.background.url})`;
    } else {
        style.backgroundColor = ctrl.config.colors.tertiary;
    }

    return (<div class='gc-mobile-preview'>
        <div class='mobile-preview-group-tabs'>
            <div class={`tab${ctrl.selectedTab === 0 ? ' active' : ''}`} onclick={() => ctrl.selectedTab = 0}>
                HOME
            </div>
            <div class={`tab${ctrl.selectedTab === 3 ? ' active' : ''}`} onclick={() => ctrl.selectedTab = 3}>
                TOS
            </div>
            <div class={`tab${ctrl.selectedTab === 1 ? ' active' : ''}`} onclick={() => ctrl.selectedTab = 1}>
                PLAY
            </div>
            <div class={`tab${ctrl.selectedTab === 2 ? ' active' : ''}`} onclick={() => ctrl.selectedTab = 2}>
                RANK
            </div>
        </div>
        <div class='mobile-screen-container'>
            <div class='mobile-screen' style={style}>
                <MobileHeaderComponent config={ctrl.config} selectedTab={ctrl.selectedTab}/>
                <div class='mobile-subscreen'>
                    {ctrl.selectedTab === 0 && <HomeScreenComponent config={ctrl.config}/>}
                    {ctrl.selectedTab === 1 && <PlayScreenComponent config={ctrl.config}/>}
                    {ctrl.selectedTab === 2 && <RankScreenComponent config={ctrl.config}/>}
                    {ctrl.selectedTab === 3 && <TOSPageComponent config={ctrl.config}/>}
                </div>
            </div>
        </div>
    </div>);
}
