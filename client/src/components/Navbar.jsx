import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{ padding: '1rem', background: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Link to="/" style={{ color: '#fff', marginRight: '1rem' }}>MTG Trader</Link>
        {user && <Link to="/collection" style={{ color: '#fff' }}>My Binder</Link>}
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: '1rem' }}>{user.name}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', marginRight: '1rem' }}>Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
