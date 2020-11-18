import './styles.scss';

const canUseScreen = navigator.userAgent.toLowerCase().includes('android');
const isMobile = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
let currentOrientation;
let init = false;
let backdrop: HTMLElement;

export class PleaseRotate {
    public static start(opts?: IPleaseRotateOptions) {
        if (!document.body) {
            window.addEventListener('load', PleaseRotate.start.bind(null, opts), false);
            return;
        }

        if (opts) {
            Object.assign(options, opts);
        }

        // createStyleSheet();
        createElements();

        if (canUseScreen) {
            checkOrientationChangeScreen();
            screen.orientation.addEventListener('change', checkOrientationChangeScreen, false);
        } else {
            checkOrientationChange();
            window.addEventListener('resize', checkOrientationChange, false);
        }
    }
}

const options: IPleaseRotateOptions = {
    forcePortrait: true,
    message: 'Please Rotate Your Device',
    onlyMobile: false,
    zIndex: 1000,
};

function createElements() {
    backdrop = document.createElement('div');
    const container = document.createElement('div');
    const message = document.createElement('div');

    backdrop.setAttribute('id', 'pleaserotate-backdrop');
    container.setAttribute('id', 'pleaserotate-container');
    message.setAttribute('id', 'pleaserotate-message');

    backdrop.appendChild(container);
    container.appendChild(createPhoneSVG());

    container.appendChild(message);
    message.appendChild(document.createTextNode(options.message));
}

function createPhoneSVG() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
    svg.setAttribute('id', 'pleaserotate-graphic');
    svg.setAttribute('viewBox', '0 0 250 250');

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('id', 'pleaserotate-graphic-path');

    if (options.forcePortrait) {
        group.setAttribute('transform', 'rotate(-90 125 125)');
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d',
        // tslint:disable-next-line:max-line-length
        'M190.5,221.3c0,8.3-6.8,15-15,15H80.2c-8.3,0-15-6.8-15-15V28.7c0-8.3,6.8-15,15-15h95.3c8.3,0,15,6.8,15,15V221.3z' +
        // tslint:disable-next-line:max-line-length
        'M74.4,33.5l-0.1,139.2c0,8.3,0,17.9,0,21.5c0,3.6,0,6.9,0,7.3c0,0.5,0.2,0.8,0.4,0.8s7.2,0,15.4,0h75.6c8.3,0,15.1,0,15.2,0' +
        // tslint:disable-next-line:max-line-length
        's0.2-6.8,0.2-15V33.5c0-2.6-1-5-2.6-6.5c-1.3-1.3-3-2.1-4.9-2.1H81.9c-2.7,0-5,1.6-6.3,4C74.9,30.2,74.4,31.8,74.4,33.5z' +
        'M127.7,207c-5.4,0-9.8,5.1-9.8,11.3s4.4,11.3,9.8,11.3s9.8-5.1,9.8-11.3S133.2,207,127.7,207z');
    svg.appendChild(group);
    group.appendChild(path);

    return svg;
}

function checkOrientationChange() {
    if (!isMobile && options.onlyMobile) {
        if (!init) {
            init = true;
            setVisibility(false);
        }
        return;
    }

    if (currentOrientation !== isPortrait()) {
        currentOrientation = isPortrait();
        orientationChanged();
    }
}

function setVisibility(visible: boolean) {
    if (!backdrop) {
        return;
    }

    if (visible) {
        if (!backdrop.parentElement) {
            document.body.appendChild(backdrop);
        }
    } else if (backdrop.parentElement) {
        document.body.removeChild(backdrop);
    }
}

function orientationChanged() {
    const triggerOn = currentOrientation && !options.forcePortrait || !currentOrientation && options.forcePortrait;
    setVisibility(triggerOn);
}

function checkOrientationChangeScreen() {
    const type: string = screen.orientation.type;

    if (!isMobile && options.onlyMobile) {
        if (!init) {
            init = true;
            setVisibility(false);
        }
        return;
    }

    const result = type.includes('portrait') || type === 'natural';

    if (currentOrientation !== result) {
        currentOrientation = result;
        orientationChanged();
    }
}

function isPortrait(): boolean {
    return window.innerWidth < window.innerHeight;
}

interface IPleaseRotateOptions {
    message?: string;
    forcePortrait?: boolean;
    onlyMobile?: boolean;
    zIndex?: number;
}
