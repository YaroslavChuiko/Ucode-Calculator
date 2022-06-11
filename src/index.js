import { createRoot } from 'react-dom/client';
//https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#updates-to-client-rendering-apis
import App from './components/App';
import './styles/index.scss';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<h1>Hello</h1>);
