
let store = new Vuex.Store({
    state: { 
        currentView: 'login-page',
        name: '',
        username: '',
        phone: '',
        token:'',
        profilePic:'',
        email:''
     },
    mutations: { 
        changeCurrentView(state, input){
            this.state.currentView = input;
        },
        setToken(state,input){
            this.state.token = input;
            localStorage.setItem('ct_token',input);
        },
        setName(state,input){
            this.state.name = input;
            localStorage.setItem('ct_name',input);
        },
        setUsername(state,input){
            this.state.username = input;
            localStorage.setItem('ct_username',input);
        },
        setEmail(state, input){
            this.state.email = input;
            localStorage.setItem('ct_email',input);
        },
        setPhone(state, input){
            this.state.phone = input;
            localStorage.setItem('ct_phone',input);
        },
        setProfilePic(state, input){
            this.state.profilePic = input;
            localStorage.setItem('ct_pp',input);
        },
        setLogout(state){
            this.token = '';
            // this.email = '';
            this.name = '';
            this.username = '',
            this.profilePic = '',
            localStorage.removeItem('ct_token');
            localStorage.removeItem('ct_email');
            localStorage.removeItem('ct_phone');
            localStorage.removeItem('ct_name');
            localStorage.removeItem('ct_username');
            localStorage.removeItem('ct_pp');
            this.currentView = 'login-page';
        },
    },
});

export default store;