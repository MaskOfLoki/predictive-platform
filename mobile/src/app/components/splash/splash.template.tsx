import { SplashComponent } from './splash.component';
import m from 'mithril';
import { configService } from '../../services/config';

export function template(ctrl: SplashComponent) {
  return (
    <div class='splash-screen' style={{ backgroundColor: configService.colors.tertiary }}>
      <div class='logo' style={configService.logoStyle} />
    </div>
  );
}
