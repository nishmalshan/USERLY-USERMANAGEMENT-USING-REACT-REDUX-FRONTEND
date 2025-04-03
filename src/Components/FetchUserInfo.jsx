import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUserStatus } from '../redux/actions/authActions';
import { useNavigate } from 'react-router-dom';


function FetchUserInfo() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    useEffect(() => {
      dispatch(fetchUserStatus(navigate));
    }, [dispatch, navigate]);
  
    return null;
}

export default FetchUserInfo