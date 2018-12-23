import { 
    createAppContainer, 
    createStackNavigator,
    createBottomTabNavigator
} from 'react-navigation';

import Login from './Login'
import MainScreen from './MainScreen'
import TokenPage from './TokenPage';
import CompanyForm from './CompanyForm'
import BoughtTokens from './BoughtTokens'
import TokenSearch from './TokenSearch'

const mainNavigator = createBottomTabNavigator({
    Main: BoughtTokens,
    Search: TokenSearch
})

const stackNavigator = createStackNavigator({
    Login: Login,
    Main: MainScreen,
    Company: CompanyForm,
    Tokens: TokenPage,
    Individual: mainNavigator
}, {
    headerMode: "none"
})

export default createAppContainer(stackNavigator);