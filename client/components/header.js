import {h} from 'preact';

const Header = props =>
  <header>
    <h1 class="title">{props.modelName}</h1>
    <h3 class="subtitle">Bundle: Canonical Distribution of Kubernetes</h3>
  </header>;

export default Header;
