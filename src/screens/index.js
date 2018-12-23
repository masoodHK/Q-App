import { 
    createAppContainer, 
    createStackNavigator, 
} from 'react-navigation';

import Login from './Login'
import MainScreen from './MainScreen'
import TokenPage from './TokenPage';
import CompanyForm from './CompanyForm'

const stackNavigator = createStackNavigator({
    Login: Login,
    Main: MainScreen,
    Company: CompanyForm,
    Tokens: TokenPage
}, {
    headerMode: "none"
})

export default createAppContainer(stackNavigator);