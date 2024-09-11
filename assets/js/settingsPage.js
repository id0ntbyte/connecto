import Store from "./store.js"


export default{
    data(){
        return{
            bgColor: '#FFFFFF',
            bgPic: '',
            linkBG: '#FFFFFF',
            linkTextColor: '#000000',
            linkBorderColor: '#000000',
            HoverlinkBG: '#000000',
            HoverlinkTextColor: '#FFFFFF',
            HoverlinkBorderColor: '#FFFFFF',
            headerTextColor: '#000000',
            headerTextBG: '#FFFFFF',
            linkIndex: 1,
            foundLinks:[],
            updateTitle:'',
            updateURL:'',
            updateID:'',
            showAddNewLink:false,
            showPageSettings:false,
            showUserSettings:false,
            linkBGHover:false,
            linkTextHover:false,
            linkBorderHover:false,
            showEditTheLink:false,
            sortableList: undefined,
            showEmailUpdate:false,
            showPasswordUpdate:false,
        }
    },
    methods:{
        checkError(response){
            if (response.code == 'logged_out'){
                localStorage.removeItem('ct_token');
                Store.commit('changeCurrentView','login-page');
                new Notyf().error('Please Login');
                return;
            }
            new Notyf().error(response.err);
        },
        async callAPI(file, data, type="json"){
            let req = undefined;
            if (type == 'json'){
                req = await fetch(file,{
                    method:'POST',
                    body: JSON.stringify(data)
                });
            } else if (type == 'file'){
                req = await fetch(file,{
                    method:'POST',
                    body: data,
                });
            }
            let resp = await req.json();
            return resp;
        },
        showPasswordChangeDiv(){
            this.showEmailUpdate = false;
            this.showPasswordUpdate = !this.showPasswordUpdate
        },
        showEmailChangeDiv(){
            this.showPasswordUpdate = false;
            this.showEmailUpdate = !this.showEmailUpdate
        },
        uploadBackgroundImage(){
            // console.log('uploading new background image');
        },
        async updatePageInformation(){
            let data = {'token':Store.state.token,'action':'updateUserPageSettings','bgColor':this.bgColor,'linkBG':this.linkBG,'linkText':this.linkTextColor,'linkBorder':this.linkBorderColor,'headerColor':this.headerTextColor,'headerBG':this.headerTextBG,'hoverBG':this.HoverlinkBG,'hoverText':this.HoverlinkTextColor,'hoverBorder':this.HoverlinkBorderColor};
            let resp = await this.callAPI('/api',data);
            if (resp.msg == 'ok'){
                new Notyf().success('Successfully Updated All Settings');
                return;
            } else {
                this.checkError(resp);
                return;
            }
        },
        async addTheNewLinkToList(){
            let title = document.querySelector('#new-link-title').value.trim();
            let url = document.querySelector('#new-link-url').value.trim();
            if (title == ''){
                new Notyf().error('Please Enter Valid Title');
                return;
            }
            if (url == '' || this.isValidURL(url) == false){
                new Notyf().error('Please Enter Valid URL');
                return;
            }
            let data = {'token':Store.state.token,'action':'addNewLink','title':title,'url':url};
            let resp = await this.callAPI('/api',data);
            if (resp.msg == 'ok'){
                new Notyf().success('New Link Added');
                this.foundLinks.push({'id':resp.id,'link_title':title,'link_url':url});
                document.querySelector('#new-link-title').value = '';
                document.querySelector('#new-link-url').value = '';
                // document.querySelector('#new-link-img').value = '';
                let _this = this;
                setTimeout(function(){
                    _this.sortableList = sortable('.sortable', {
                        placeholderClass: 'is-drop-target'
                    });
                    _this.sortableList[0].addEventListener('sortupdate', function(e) {
                        // console.log(e.detail.origin.items);
                        _this.updateOrder(e.detail.origin.items);
                    });
                },500);
                return;
            } else {
                this.checkError(resp);
                // new Notyf().error(resp.err);
                return;
            }

        },
        isValidURL(text) {
            try {
                new URL(text);
                return true;
            } catch (error) {
                return false;
            }
        },
        showTheEditDiv(id){
            if (id == this.updateID){
                this.updateTitle = '';
                this.updateURL = '';
                this.updateID = '';
                this.showEditTheLink = false;
                return;
            } else { 
                let data = this.foundLinks.filter((item) => item.id === id);
                data = data[0];
                this.showEditTheLink = true;
                this.updateTitle = data['link_title'];
                this.updateURL = data['link_url'];
                this.updateID = id;
            }
        },  
        async removeTheLink(id){
            if (!confirm('Are you sure you want to remove this link?')){return;}
            let data = {'token':Store.state.token,'action':'removeTheLink','id':id};
            let resp = await this.callAPI('/api',data);
            if (resp.msg == 'ok'){
                this.foundLinks = this.foundLinks.filter((item) => item.id !== id);
                this.showEditTheLink = false;
                new Notyf().success('Link Has Been Removed');
                return;
            } else {
                this.checkError(resp);
                return;
            }
        },
        async updateTheLinkInformation(){
            if (this.updateID == ''){
                new Notyf().error('No Link Found For ID');
                return;
            }
            if (this.updateTitle == ''){
                new Notyf().error('Please enter a title');
                return;
            }
            if (this.updateURL == '' || this.isValidURL(this.updateURL) == false){
                new Notyf().error('Please enter valid url');
                return;
            }
            let data = {'token':Store.state.token,'action':'updateLinkInformation','id':this.updateID,'link':this.updateURL,'title':this.updateTitle};
            let resp = await this.callAPI('/api',data);
            let tmp = [];
            if (resp.msg == 'ok'){
                for(let item of this.foundLinks){
                    if (item.id == this.updateID){
                        item['link_url'] = this.updateURL;
                        item['link_title'] = this.updateTitle;
                        break;
                    }
                }
                this.updateURL = '';
                this.updateID = '';
                this.updateTitle = '';
                this.showEditTheLink = false;
                new Notyf().success('Successfully Updated Item');
                return;
            } else {
                this.checkError(resp);
                return;
            }
        },
        // previewImage(event) {
        //     const fileInput = event.target;
        //     const imagePreview = document.getElementById("image-preview");

        //     if (fileInput.files && fileInput.files[0]) {
        //         const reader = new FileReader();

        //         reader.onload = function (e) {
        //             const image = new Image();
        //             image.src = e.target.result;

        //             image.onload = function () {
        //                 imagePreview.innerHTML = "";
        //                 imagePreview.appendChild(image);
        //             };
        //         };

        //         reader.readAsDataURL(fileInput.files[0]);
        //     }
        // },
        openTheLink(url){
            window.open(url,'_blank');
        },
        doLogout(){
            Store.commit('setLogout');
            Store.commit('changeCurrentView','login-page');
        },
        async updateOrder(items){
            let order = [];
            let key = 1;
            for(let item of items){
                order.push([item.id.replace('fl_',''),key]);
                key++;
            }
            let data = {'token':Store.state.token,'action':'updateItemOrder','order':order}
            let resp = await this.callAPI('/api',data);
        },
        async updateProfilePic(event){
            if (!confirm('Are you sure you want to update your profile pic?')){return;}
            const fileInput = document.getElementById('profile-upload-btn');
            if (fileInput.files.length === 0) {
                new Notyf().error('No Image Chosen');
                return;
            }
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            formData.append('action','updateProfilePic');
            formData.append('token',Store.state.token);
            let resp = await this.callAPI('/api',formData,'file');
            if (resp.msg == 'ok'){
                new Notyf().success('Profile Picture Updated');
                Store.commit('setProfilePic',resp.img);
                return;
            } else {
                this.checkError(resp);
            }
        },
        async setNewPassword(){
            let old = document.querySelector('#set-new-password-old').value.trim();
            let pass = document.querySelector('#set-new-password').value.trim();
            let confirm = document.querySelector('#set-new-password-confirm').value.trim();
            if (old == '' || pass == '' || confirm == ''){
                new Notyf().error('Make sure you have entered the old password and have chosen a new password');
                return;
            }
            if (old == pass){
                new Notyf().error('Old and new password cannot be the same');
                return;
            }
            if (pass != confirm){
                new Notyf().error('Passwords do not match, please check the new password and confirmation and try again');
                return;
            }
            if (!this.isValidPassword(pass)){
                new Notyf().error({'message':'Password should have at least 1 digit and 1 uppercase letter and be at least 8 digits','duration':5000});
                return;
            }

            let data = {'token':Store.state.token,'action':'updateUserPassword','old':old,'pass':pass};
            let resp = await this.callAPI('/api',data);
            if (resp.msg == 'ok'){
                new Notyf().success('Password Successfully Updated');
                this.showPasswordUpdate = false;
                return;
            } else {
                this.checkError(resp);
            }
        },
        async setNewEmailAddress(){
            if (!confirm('Are you sure you want to update your email?')){return;}
            let email = document.querySelector('#set-new-email').value.trim();
            if (email == ''){
                new Notyf().error('Please enter a new email');
                return;
            }
            if (!this.isValidEmail(email)){
                new Notyf().error('Please enter a valid email address');
                return;
            }
            let data = {'token':Store.state.token,'action':'updateUserEmailAddress','email':email};
            let resp = await this.callAPI('/api',data);
            if (resp.msg == 'ok'){
                Store.commit('setEmail',email);
                this.showEmailUpdate = false;
                new Notyf().success('Email Successfully Updated');
                return;
            } else {
                this.checkError(resp);
            }
        },
        isValidEmail(email) {
            // Regular expression to validate the email
            const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            return regex.test(email);
        },
        isValidPassword(password) {
            if (password.length < 8) {
                return false;
            }
            const hasDigit = /[0-9]/.test(password);
            const hasUppercase = /[A-Z]/.test(password);
            return hasDigit && hasUppercase;
        }
    },
    computed:{
        usersName(){return Store.state.name;},
        getUsername(){return Store.state.username;},
        getPhone(){return Store.state.phone;},
        showAddNewLinkBtnText(){return this.showAddNewLink == false ? "<i class='fa fa-2x fa-plus'></i>" : "<i class='fa fa-2x fa-times'></i>"},
        getProfileImage(){return Store.state.profilePic == '' ? false:Store.state.profilePic;}
    },
    created(){

    },
    async mounted(){
        let _this = this;
        let data = {'token':Store.state.token,'action':'getLinkInformation'};
        let resp = await _this.callAPI('/api',data);
        if (resp.msg == 'ok'){
            let settings = JSON.parse(resp.data['page_settings']);
            if (settings['bg'] != '' && settings['bg'] != undefined){
                _this.bgColor = settings['bg'];
            }
            if (settings['linkBG'] != '' && settings['linkBG'] != undefined){
                _this.linkBG = settings['linkBG'];
            }
            if (settings['linkText'] != '' && settings['linkText'] != undefined){
                _this.linkTextColor = settings['linkText'];
            }
            if (settings['linkBorder'] != '' && settings['linkBorder'] != undefined){
                _this.linkBorderColor = settings['linkBorder'];
            }
            if (settings['linkBGHover'] != '' && settings['linkBGHover'] != undefined){
                _this.HoverlinkBG = settings['linkBGHover'];
            }
            if (settings['linkTextHover'] != '' && settings['linkTextHover'] != undefined){
                _this.HoverlinkTextColor = settings['linkTextHover'];
            }
            if (settings['linkBorderHover'] != '' && settings['linkBorderHover'] != undefined){
                _this.HoverlinkBorderColor = settings['linkBorderHover'];
            }
            if (settings['userTitleColor'] != '' && settings['userTitleColor'] != undefined){
                _this.headerTextColor = settings['userTitleColor'];
            }
            if (settings['userTitleBG'] != '' && settings['userTitleBG'] != undefined){
                _this.headerTextBG = settings['userTitleBG'];
            }
            _this.foundLinks = [...resp.links];
            setTimeout(function(){
                _this.sortableList = sortable('.sortable', {
                    placeholderClass: 'is-drop-target'
                });
                _this.sortableList[0].addEventListener('sortupdate', function(e) {
                    _this.updateOrder(e.detail.origin.items);
                });
            },1000);
        } else {
            this.checkError(resp);
        }

    },
    template:`
        <div>
            <component is="style" scoped>
                .color-picker-btn{
                    width: 50px;
                    padding: .2rem;
                    background-color: white;
                    display: block;
                    border-radius: 0 .375rem .375rem 0;
                    height:2.5rem;
                }
                .new-link-inputs{
                    padding: 0.8rem 1rem;
                    border: none;
                    border-bottom:1px solid gray;
                }
                .new-link-inputs:focus{
                    outline:none !important;
                    border-bottom:2px solid black;
                }
                .found-links{
                    border:3px solid {{linkBorderColor}};
                    color:{{linkTextColor}};
                    background-color:{{linkBG}};
                }
                .found-links:hover{
                    border:3px solid {{HoverlinkBorderColor}};
                    color:{{HoverlinkTextColor}};
                    background-color:{{HoverlinkBG}};
                }
                .is-drop-target{
                    border:2px solid black !important;
                    padding:2rem 3rem;
                    width:80%;
                    margin:0 auto;
                    border-radius:25px;
                    margin-bottom:1rem;
                }
                .show-pointer{
                    cursor:pointer;
                }
                .show-grabber{
                    cursor:pointer;
                }
                .h--60{
                    height:60px !important;
                }
                .max-250{
                    max-width:250px !important;
                }
                #user-image-preview{
                    border-radius:50%;
                    transition: opacity 0.3s ease;
                    width:200px;
                    height:200px;
                    object-fit:cover;
                }
                #user-image-preview:hover{
                    opacity: 0.5;
                    cursor:pointer;
                    
                }
                .user-profile-pic-div{
                    border-right: 2px solid lightgray;
                }
                @media (max-width: 768px) {
                    .user-profile-pic-div{
                        border-right: none;
                    }   
                }
            </component>
            <div class="row">
                <div class="text-center h2 my-5">
                    {{usersName}}'s Page
                </div>
            </div>
            <div class="row">
                <div class="col-12 d-flex justify-content-center align-items-center mb-3">
                    <button title="Edit Page Settings" @click="showPageSettings = !showPageSettings; showAddNewLink = false; showUserSettings = false;" class="btn"><i class="fa fa-2x fa-gears"></i></button>
                    <button @click="showAddNewLink = !showAddNewLink;showPageSettings = false; showUserSettings = false;" class="btn ms-5" v-html="showAddNewLinkBtnText"></button>
                    <button title="Edit User Information" @click="showUserSettings = !showUserSettings; showPageSettings = false; showAddNewLink = false;" class="btn ms-5"><i class="fa fa-2x fa-user"></i></button>
                    <button @click="doLogout" class="btn ms-5"><i class="fa fa-2x fa-right-from-bracket"></i></button>
                </div>
            </div>
            <transition enter-active-class="animate__animated animate__faster animate__fadeIn" leave-active-class="animate__animated animate__faster animate__fadeOut">
                <div v-if="showPageSettings">
                    <div class="col-12 shadow p-5 rounded-5 mb-5">
                        <div class="row">
                            <div class="col-md-6 col-12 mb-5">
                                <div class="row">
                                    <div class="col-12 text-center mb-3 h4">
                                        Page Settings
                                    </div>
                                    <div class="col-8 offset-2">
                                        <div class="mb-2">
                                            <label class="form-label">Background Color</label>
                                            <div class="input-group">
                                                <input placeholder="Background Color" v-model="bgColor" type="text" class="form-control" id="background-text" aria-describedby="background-color-picker">
                                                <input type="color" v-model="bgColor" class="color-picker-btn" id="background-color-picker">
                                            </div>
                                        </div>
                                        <div class="mb-2">
                                            <label class="form-label">Header Color</label>
                                            <div class="input-group">
                                                <input placeholder="Header Color" v-model="headerTextColor" type="text" class="form-control" id="header-text-color" aria-describedby="header-color-picker">
                                                <input type="color" v-model="headerTextColor" class="color-picker-btn" id="header-color-picker">
                                            </div>
                                        </div>
                                        <div class="mb-2">
                                            <label class="form-label">Header Background</label>
                                            <div class="input-group">
                                                <input placeholder="Header Color" v-model="headerTextBG" type="text" class="form-control" id="header-bg-color" aria-describedby="header-bg-color-picker">
                                                <input type="color" v-model="headerTextBG" class="color-picker-btn" id="header-bg-color-picker">
                                            </div>
                                        </div>
                                        <!-- <div class="mb-2">
                                            <label class="form-label">Background Image</label>
                                            <div class="input-group">
                                                <input placeholder="Background Image" type="file" class="form-control" id="background-image" aria-describedby="background-image-upload">
                                                <button @click="uploadBackgroundImage" class="btn btn-outline-dark">Upload</button>
                                            </div>
                                        </div> -->
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 col-12">
                                <div class="row">
                                    <div class="col-12 text-center mb-3 h4">
                                        Link Settings
                                    </div>
                                    <div class="col-8 offset-2">
                                        <div class="mb-3">
                                            <label class="form-label">Background <button @click="linkBGHover = !linkBGHover" class="ms-3 btn" :class="[linkBGHover ? 'btn-secondary':'btn-outline-secondary']">Hover</button></label>
                                            <div class="input-group" v-if="!linkBGHover">
                                                <input placeholder="Background" v-model="linkBG" type="text" class="form-control" id="link-bg" aria-describedby="link-bg-picker">
                                                <input type="color" v-model="linkBG" class="color-picker-btn" id="link-bg-picker">
                                            </div>
                                            <div class="input-group" v-if="linkBGHover">
                                                <input placeholder="Background On Hover" v-model="HoverlinkBG" type="text" class="form-control" id="link-bg-hover" aria-describedby="link-bg-hover-picker">
                                                <input type="color" v-model="HoverlinkBG" class="color-picker-btn" id="link-bg-hover-picker">
                                            </div>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Text Color <button @click="linkTextHover = !linkTextHover" class="ms-3 btn" :class="[linkTextHover ? 'btn-secondary':'btn-outline-secondary']">Hover</button></label>
                                            <div class="input-group" v-if="!linkTextHover">
                                                <input placeholder="Text Color" v-model="linkTextColor" type="text" class="form-control" id="link-text-color" aria-describedby="link-text-color-picker">
                                                <input type="color" v-model="linkTextColor" class="color-picker-btn" id="link-text-color-picker">
                                            </div>
                                            <div class="input-group" v-if="linkTextHover">
                                                <input placeholder="Text Color" v-model="HoverlinkTextColor" type="text" class="form-control" id="link-text-color-hover" aria-describedby="link-text-color-picker-hover">
                                                <input type="color" v-model="HoverlinkTextColor" class="color-picker-btn" id="link-text-color-picker-hover">
                                            </div>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label">Border Color <button @click="linkBorderHover = !linkBorderHover" class="ms-3 btn" :class="[linkBorderHover ? 'btn-secondary':'btn-outline-secondary']">Hover</button></label>
                                            <div class="input-group" v-if="!linkBorderHover">
                                                <input placeholder="Border Color" v-model="linkBorderColor" type="text" class="form-control" id="link-border-color" aria-describedby="link-border-color-picker">
                                                <input type="color" v-model="linkBorderColor" class="color-picker-btn" id="link-border-color-picker">
                                            </div>
                                            <div class="input-group" v-if="linkBorderHover">
                                                <input placeholder="Border Color" v-model="HoverlinkBorderColor" type="text" class="form-control" id="link-border-color-hover" aria-describedby="link-border-color-picker-hover">
                                                <input type="color" v-model="HoverlinkBorderColor" class="color-picker-btn" id="link-border-color-picker-hover">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 offset-md-4 col-8 offset-2 text-center mt-5">
                                <button @click="updatePageInformation" class="btn btn-outline-success w-100">Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
            <transition enter-active-class="animate__animated animate__faster animate__fadeIn" leave-active-class="animate__animated animate__faster animate__fadeOut">
                <div class="col-12 border shadow px-5 py-5 rounded-5 my-5" v-if="showAddNewLink">
                    <div class="row">
                        <div class="col-3 border-end" v-if="1==0">
                            <!-- <input type="file" class="d-none" id="new-upload-btn" accept="image/*" @change="previewImage(event)"> -->
                            <label for="new-upload-btn" class="btn btn-outline-primary p-2">Select Image</label>
                            <!-- <img class="img-thumbnail d-none" id="image-preview" src="#"> -->
                        </div>
                        <div class="col-12 text-center h3 mb-3">Add New Link</div>
                        <div class="col-md-10 col-12">
                            <div class="row">
                                <div class="col-12">
                                    <input type="text" class="new-link-inputs w-100 mb-3" id="new-link-title" placeholder="Title">
                                </div>
                                <div class="col-12">
                                    <input type="text" class="new-link-inputs w-100 mb-3" id="new-link-url" placeholder="URL: https://google.com">
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-2">
                            <button class="btn btn-outline-success w-100 h-100" @click="addTheNewLinkToList">Add</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition enter-active-class="animate__animated animate__faster animate__fadeIn" leave-active-class="animate__animated animate__faster animate__fadeOut">
                <div class="col-12 border shadow px-5 py-5 rounded-5 my-5" v-if="showUserSettings">
                    <div class="row">
                        <div class="col-12 text-center h3 mb-5">Update User Information</div>
                        <div class="col-12 col-md-6 user-profile-pic-div">
                            <div class="row">
                                <div class="col-12 text-center">
                                    <span :style="{fontSize: '12px'}">Click Here To Change Profile Pic</span>
                                </div>
                                <div class="col-12 d-flex justify-content-center align-items-center">
                                    <input type="file" class="d-none" id="profile-upload-btn" accept="image/*" @change="updateProfilePic(event)">
                                    <label for="profile-upload-btn" class="show-grabber h-100 btn btn-outline-primary p-2 d-flex align-items-center" v-if="getProfileImage == false">Select Image</label>
                                    <label for="profile-upload-btn" class="h-100" v-else><img class="img-thumbnail" id="user-image-preview" :src="getProfileImage"></label>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-12 d-flex align-items-center mt-md-0 mt-5">
                            <div class="row">
                                <div class="col-12 text-center mb-3">
                                    <span><b>Name:</b> {{usersName}}</span>
                                </div>
                                <div class="col-12 text-center mb-3">
                                    <span><b>Phone:</b> {{getPhone}}</span>
                                </div>
                                <div class="col-12 text-center">
                                    <span><b>Username:</b> {{getUsername}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-12 mt-5" v-if="1==0">
                            <div class="row">
                                <div class="col-12 text-center">
                                    <button class="w-100 btn btn-outline-secondary max-250 mb-3" @click="showPasswordChangeDiv">Update Password</button>
                                </div>
                                <div class="col-12 text-center">
                                    <button class="w-100 btn btn-outline-secondary max-250" @click="showEmailChangeDiv">Update Email</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-8 offset-md-2 mt-5" v-if="showEmailUpdate">
                            <div clas="row">
                                <div class="col-12 mb-3">
                                    <input class="form-control w-100" type="text" id="set-new-email" placeholder="john@example.com">
                                </div>
                                <div class="col-12">
                                    <button class="btn btn-outline-success w-100" @click="setNewEmailAddress">Update</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-12  col-md-8 offset-md-2 mt-5" v-if="showPasswordUpdate">
                            <div clas="row">
                                <div class="col-12 mb-3">
                                    <input class="form-control w-100" type="password" id="set-new-password-old" placeholder="Old Password">
                                </div>
                                <div class="col-12 mb-3">
                                    <input class="form-control w-100" type="password" id="set-new-password" placeholder="New Password">
                                </div>
                                <div class="col-12 mb-3">
                                    <input class="form-control w-100" type="password" id="set-new-password-confirm" placeholder="Confirm Password">
                                </div>
                                <div class="col-12 ">
                                    <button class="btn btn-outline-success w-100" @click="setNewPassword">Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="row mb-5">
                <div class="col-12 shadow rounded-5 px-2 pt-3 pb-5" :style="{backgroundColor: bgColor }">
                    <div class="row">
                        <div class="col-12 text-center h4 my-5 pt-4">Links</div>
                        <div class="col-12 text-center h4 mb-5 show-pointer" :style="{color: headerTextColor}" @click="openTheLink('/'+getUsername)">@{{getUsername}}</div>
                        <!-- <div class="col-10 offset-1 px-2 py-3 rounded-5 mb-3" v-for="link in foundLinks" v-if="foundLinks.length > 0" :style="{backgroundColor: linkBG, border: '3px solid '+linkBorderColor}"> -->
                        <div class="sortable">
                            <div class="found-links col-10 offset-1 px-2 py-3 rounded-5 mb-3" :id="'fl_'+link.id" v-for="link in foundLinks" v-if="foundLinks.length > 0" @click="showTheEditDiv(link.id)">
                                <div class="row">
                                    <div class="col-10 text-center d-flex align-items-center justify-content-center">
                                        <!-- <span :style="{color: linkTextColor}">{{link.title}}</span> -->
                                        <span>{{link['link_title']}}</span>
                                    </div>
                                    <div class="col-2 text-center d-flex align-items-center justify-content-center">
                                        <button class="btn" @click.stop.prevent="removeTheLink(link['id'])"><i class="fa fa-trash"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <transition enter-active-class="animate__animated animate__faster animate__fadeIn" leave-active-class="animate__animated animate__faster animate__fadeOut">
                    <div class="position-relative col-12 border shadow px-5 py-5 rounded-5 my-5" v-if="showEditTheLink">
                        <div class="row">
                            <div class="col-md-10 col-12">
                                <div class="row">
                                    <div class="col-12 text-center h3 mb-3">Edit Link Information</div>
                                    <div class="col-12">
                                        <input type="text" class="new-link-inputs w-100 mb-3" placeholder="Title" v-model="updateTitle">
                                    </div>
                                    <div class="col-12">
                                        <input type="text" class="new-link-inputs w-100 mb-3" placeholder="URL: https://google.com" v-model="updateURL">
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-md-2">
                                <button class="btn btn-outline-success w-100 h-100" @click="updateTheLinkInformation">Update</button>
                            </div>
                        </div>
                        <button class="btn position-absolute text-danger fs-2" :style="{top:'1rem',left:'1rem'}" @click="showEditTheLink = false">X</button>
                    </div>
                </transition>
            </div>
        </div>
    `
}