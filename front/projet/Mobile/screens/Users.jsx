import UserContext from '../components/UserContext';
import Home from '../screens/Home';
import { useNavigation } from '@react-navigation/native';
import { AsyncStorage } from 'react-native';

const Users = () => {

    const user = "John Doe";

    return (
        <UserContext.Provider value={user}>
        <Home />
        </UserContext.Provider>
    );
}

export default Users;