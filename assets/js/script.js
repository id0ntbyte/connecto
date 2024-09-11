
import Store from "./store.js"
import SettingsPage from "./settingsPage.js";
import LoginPage from "./login.js"


const app = Vue.createApp({
    data(){
        return{
            updateComponent:1,
        }
    },
    methods:{
        
    },
    created(){
        let username = localStorage.getItem('ct_username');
        let token = localStorage.getItem('ct_token');
        let phone = localStorage.getItem('ct_phone');
        let name = localStorage.getItem('ct_name');
        let profilePic = localStorage.getItem('ct_pp');
        if (Store.state.token != ''){
            Store.commit('changeCurrentView','settings-page');
            return;
        }
        if (token != '' && token != null && token != 'null' && token != undefined){
        Store.commit('setToken',token);
        Store.commit('setName',name);
        Store.commit('setPhone',phone);
        Store.commit('setUsername',username);
        Store.commit('setProfilePic',profilePic);
        Store.commit('changeCurrentView','settings-page');
            return;
        }
        Store.commit('changeCurrentView','login-page');
    },
    computed:{
        currentView(){return Store.state.currentView;}
    },
    template:`
    <component is="style" scoped>
        .fade-enter-active, .fade-leave-active {
            transition: opacity 0.5s;
        }
        .fade-enter, .fade-leave-to {
            opacity: 0;
        }
    </component>
    <transition name="fade" mode="out-in">
        <component :is="currentView" :key="updateComponent"></component>
    </transition>
    `
});

app.component('settings-page',SettingsPage);
app.component('login-page',LoginPage);


app.mount('#app');
