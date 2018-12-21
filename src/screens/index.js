import { 
    createAppContainer, 
    createStackNavigator, 
    createMaterialTopTabNavigator 
} from 'react-navigation';

import Login from './Login'
import MainScreen from './MainScreen'

const stackNavigator = createStackNavigator({
    Login: Login,
    Main: MainScreen
}, {
    headerMode: "none"
})

export default createAppContainer(stackNavigator);