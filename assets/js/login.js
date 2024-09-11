import Store from './store.js'

export default{
    data(){
        return{
            showPart:1, // Show Sign In View
            signInCode:'',
            phone:'',
        }
    },
    methods:{
        //Helper Function For Calling The API
        async callAPI(file,data){
            let req = await fetch(file,{
                method:'POST',
                body: JSON.stringify(data)
            });
            let resp = await req.json();
            return resp;
        },
        async signin(){ //Sign In Function
            //Check phone number
            if (this.phone == ''){
                new Notyf().error('Please enter valid phone number');
                return;
            }
            //Send Request
            let data = {'action':'signin','phone':this.phone};
            let resp = await this.callAPI('/auth',data);
            if (resp.msg == 'ok'){ //On Success
                // For Testing Purposes -- Remove When Deployed
                new Notyf().success({'message':'Please use '+resp.auth+' to sign in -- Test Mode Activated',duration:5000});
                this.signInCode = resp.code;
                this.showPart = 2;
            } else {
                new Notyf().error(resp.err);
            }
        },
        // Verify Sign In Code
        async verifySignIn(){
            let code = document.querySelector('#code-input').value.trim();
            // Local Check If Code Is Valid
            if (code.length != 6){
                new Notyf().error('Code Is Incorrect');
                return;
            }
            let data = {'action':'verifySignIn','code':this.signInCode,'verify':code,'phone':this.phone};
            let resp = await this.callAPI('/auth',data);
            if (resp.msg == 'ok'){
                new Notyf().success('Successfully Signed In');
                // Set Local Session Data
                Store.commit('setName',resp.name);
                Store.commit('setToken',resp.token);
                Store.commit('setPhone',resp.phone);
                Store.commit('setUsername',resp.username);
                Store.commit('setProfilePic',resp.pp);
                Store.commit('changeCurrentView','settings-page');
            } else {
                new Notyf().error(resp.err);
            }
        },
    },  
    template:`
        <div class="mt--100">
            <component is="style" scoped>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Poppins', sans-serif
                }

                .container {
                    margin: 50px auto;
                }

                .body {
                    position: relative;
                    width: 95%;
                    height: 500px;
                    margin: 20px auto;
                    border: 1px solid #dddd;
                    border-radius: 18px;
                    overflow: hidden;
                    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
                }

                .box-1 img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .box-2 {
                    padding: 10px;
                }

                .box-1,
                .box-2 {
                    width: 50%;
                }

                .h-1 {
                    font-size: 24px;
                    font-weight: 700;
                }

                .text-muted {
                    font-size: 14px;
                }

                .container .box {
                    width: 100px;
                    height: 100px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid transparent;
                    text-decoration: none;
                    color: #615f5fdd;
                }

                .box:active,
                .box:visited {
                    border: 2px solid #0d6efd;
                }

                .box:hover {
                    border: 2px solid #0d6efd;
                }
                
                /*
                .btn.btn-primary {
                    background-color: transparent;
                    color: #ee82ee;
                    border: 0px;
                    padding: 0;
                    font-size: 14px;
                }

                .btn.btn-outline-primary {
                    background-color: transparent;
                    color: #ee82ee;
                    border-color: #ee82ee;
                }

                .btn.btn-outline-primary:hover {
                    background-color: #ee82ee;
                    color: white;
                }
                */

                .btn.btn-primary .fas.fa-chevron-right {
                    font-size: 12px;
                }

                .footer .p-color {
                    color: #0d6efd;
                }

                .footer.text-muted {
                    font-size: 10px;
                }

                .group-text-start{
                    background-color:white !important;
                    border-radius: 25px 0px 0px 25px !important;
                }

                .group-text-end{
                    border-radius: 0px 25px 25px 0px !important;
                }

                .form-control{
                    border-left:0;
                    padding:0.75rem 0;
                    border-radius: 0px 25px 25px 0px;
                }

                @media (max-width:767px) {
                    body {
                        padding: 10px;
                    }

                    .body {
                        width: 100%;
                        height: 100%;
                    }

                    .box-1 {
                        width: 100%;
                    }

                    .box-2 {
                        width: 100%;
                        height: 440px;
                    }
                }
            </component>
            <div class="container">
            <div class="d-flex align-items-center">
            <div class="body d-md-flex align-items-center justify-content-between">
                <div class="box-1 d-none d-md-block">
                    <img src="https://imgur.com/iFTYAKb.png" class="" alt="">
                </div>
                <div class=" box-2 d-flex flex-column h-100 p-3" v-if="showPart == 1">
                    <div class="mt-2">
                        <p class="mb-1 h-1">Sign In</p>
                        <p class="text-muted mb-2">Please Enter Your Phone Number</p>
                        <div class="d-flex flex-column mt-4">
                            <div class="row">
                                <div class="col-12 text-center mb-2">
                                    <div class="input-group">
                                        <span class="input-group-text group-text-start" id="phone"><i class="fa fa-phone"></i></span>
                                        <input id="phone-input" v-model="phone" type="text" class="form-control" placeholder="Phone" aria-label="Phone" aria-describedby="phone">
                                    </div>
                                </div>
                                <div class="col-12 text-center">
                                    <button class="btn btn-outline-primary w-100 rounded-5" @click="signin">Enter</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-auto">
                        <p class="footer text-muted mb-0 mt-md-0 mt-4">By register you agree with our
                            <span class="p-color me-1">terms and conditions</span>and
                            <span class="p-color ms-1">privacy policy</span>
                        </p>
                    </div>
                </div>
                <div class=" box-2 d-flex flex-column h-100 p-3" v-if="showPart == 2">
                    <div class="mt-2">
                        <p class="mb-1 h-1">Verify Login</p>
                        <p class="text-muted mb-2">Please enter varification code</p>
                        <div class="d-flex flex-column mt-4">
                            <div class="row">
                                <div class="col-12 text-center mb-2">
                                    <div class="input-group mb-2">
                                        <span class="input-group-text group-text-start" id="code"><i class="fa fa-key"></i></span>
                                        <input id="code-input" type="text" class="form-control" placeholder="Verification Code" aria-label="Code" aria-describedby="code">
                                    </div>
                                    <div class="col-12 text-center">
                                        <button class="btn btn-outline-primary w-100 rounded-5" @click="verifySignIn">Submit</button>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-3" v-if="1==0">
                                <div class="btn btn-primary" @click="showPart = 1">Back To Sign In<span class="fas fa-chevron-right ms-1"></span></div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-auto">
                        <p class="footer text-muted mb-0 mt-md-0 mt-4">By register you agree with our
                            <span class="p-color me-1">terms and conditions</span>and
                            <span class="p-color ms-1">privacy policy</span>
                        </p>
                    </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    `
}