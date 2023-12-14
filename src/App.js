import logo from './logo.svg';
import './App.css';
import UserList from './components/UserList';
import MessageList from './components/MessageList';

function App() {
  return (
    <div>
      <h1>Application de Messagerie</h1>
      <UserList />
      <MessageList />
    </div>
  );
}


export default App;
