<template>
  <div id="findpassword" v-title data-title="找回密码" @keydown.enter="findpassword('userForm')">
  
    <base-header></base-header>
    <div id="background"></div>
    <div class="me-findpassword-box me-findpassword-box-radius" :style="backgroundDiv">
      <el-form ref="userForm" :model="userForm" :rules="rules">
        <el-form-item prop="account">
          <el-input placeholder="邮箱" v-model="userForm.account" ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input placeholder="密码" type="password" v-model="userForm.password"></el-input>
        </el-form-item>

        <el-form-item prop="cpwd">
          <el-input placeholder="确认密码" type="password" v-model="userForm.cpwd"></el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-input placeholder="验证码" v-model="userForm.code"></el-input>
        </el-form-item>

        <template v-if="!sentCapcha">
          <el-form-item size="small" class="me-findpassword-button">
						
					<el-button type="primary" @click="requ_ecode(formValidate.mail)">{{codeContent}}</el-button>
          </el-form-item>
        </template>

      </el-form>

      <div class="me-findpassword-design">
        <p>
        <span class="me-findpassword-design-pure-text">遇到问题？</span>
          <strong>
            <router-link to="/" class="me-findpassword-design-color">回首页</router-link>
          </strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import BaseHeader from "@/components/BaseHeader";

export default {
  name: "findpassword",
  data() {
    return {
       codeContent:'获取验证码',
       codeCanclick:true,
       totalTime: 60,
       backgroundDiv: {
        // backgroundImage:
        // "url('https://i.pinimg.com/564x/f7/41/5d/f7415de43c5039a131feedfa42e8b019.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100%"
      },
      userForm: {
		account: "",
		code: "",
        password: "",
        cpwd: ""
      },
      rules: {
        account: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
        	{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                ],
        code: [
         { required: true, message: '验证码不能为空', trigger: 'blur' }
                ],        
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
        ],
        cpwd: [
         { required: true, message: '确认密码不能为空', trigger: 'blur' }, {
                        validator:(rule,value,callback)=>{
                            if(value===''){
                                callback(new Error('请再次输入密码'))
                            }
                            else if(value!==this.formValidate.password){
                                callback(new Error('两次输入密码不一致'))
                            }else{
                                callback()
                            }
                        },trigger:'blur'}
                    ]
      }
    };
  },
  methods: {
	getCapcha() {
      if (this.userForm.account.length === 11) {
        console.log("Getting capcha of " + this.userForm.account);
        getCapcha(this.userForm.account).then(data => {
          this.rightCapcha = data.data.obj;
          console.log("Right capcha is " + this.rightCapcha);
          this.sentCapcha = true;
        });
      } else {
        this.$message({
          message: "请先填写正确的邮箱",
          type: "error",
          showClose: true
        });
      }
    },
        handleSubmit (name,f) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('提交成功!')
                        let params = {'username':f.name,'email':f.mail,'password':f.password,'email_code':f.code}
                        this.$http.post(this.GLOBAL.domain + "/api/v1/register",params,{
                            headers:{
                                'Content-Type':"application/json",
                            }
                        }).then(function(res){
                            console.log(res);
                            var s = JSON.parse(res.body);
                            if(s["state"]=="fail"){
                                alert(s["reason"])
                            }
                            else {
                                alert("注册成功！");
                                this.$router.push({
                                    path: '/'
                                })
                            }
                        },function (res) {
                            console.log(res)
                        });
                    } else {
                        this.$Message.error('表单验证失败!')
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields()
            },
            requ_ecode(mail){
                if(mail==='' || !this.codeCanclick) return;
                console.log(mail);
                var re=/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                if(re.test(mail)) {
                    let params = {"email": mail};
                    //let params = {"email":this.formValidate.mail};
                    this.$http.post(this.GLOBAL.domain + "/api/v1/email_code", params, {
                        headers: {
                            'Content-Type': "application/json",
                        }
                    }).then(function (res) {
                        console.log(res);
                        this.$Message.success('发送成功!');
                        this.codeCanclick = false;
                        this.codeContent = this.totalTime + 's后可重新发送';
                        let clock = window.setInterval(() => {
                            this.totalTime--;
                            this.codeContent = this.totalTime + 's后重新发送';
                            if (this.totalTime < 0) {
                                window.clearInterval(clock);
                                this.codeContent = '重新发送验证码';
                                this.totalTime = 10;
                                this.codeCanclick = true
                            }
                        }, 1000)
                    }, function (res) {
                        console.log(res)
                        alert("发送验证码失败！")
                    });
                }
            }
  },
  components: {
    "base-header": BaseHeader
  }
};
</script>

<style scoped>
body {
  background: #00ccff;
}


.findpassword-title {
  padding-top: 20px;
  padding-bottom: 60px;
  letter-spacing: 35px;
  padding-left: 40px;
  text-align: center;
}

.me-video-player {
  background-color: transparent;
  width: 100%;
  height: 100%;
  object-fit: fill;
  display: block;
  position: absolute;
  left: 0;
  z-index: 0;
  top: 0;
}

.me-findpassword-box {
  position: absolute;
  width: 500px;
  height: 400px;
  background-color: white;
  margin-top: 150px;
  margin-left: -180px;
  left: 45%;
  padding: 30px;
}

.me-findpassword-box-radius {
  border-radius: 10px;
  box-shadow: 0px 0px 1px 1px rgba(161, 159, 159, 0.1);
}

.me-findpassword-box h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  vertical-align: middle;
}

.me-findpassword-design {
  text-align: center;
  font-family: "Open Sans", sans-serif;
  font-size: 12px;
  margin-top: 48px;
}

.me-findpassword-design-pure-text {
  opacity: 0.5;
}

.me-findpassword-design-color {
  transition: 0.1s;
  color: #00ccff !important;
  opacity: 0.5;
}

.me-findpassword-design-color:focus,
.me-findpassword-design-color:active,
.me-findpassword-design-color:hover {
  opacity: 1;
  text-decoration: none;
}

.me-findpassword-button {
  text-align: center;
}

.me-findpassword-button button {
  width: 100%;
}

.el-button {
  transition: 0.2s;
  background-color: rgb(16, 145, 231);
  border-color: rgba(120, 129, 129, 0.616);
}

.el-button--primary:hover,
.el-button--primary:active,
.el-button:focus {
  background-color: rgb(98, 198, 228);
  border-color: rgba(117, 197, 237, 1);
}

.el-form {
  margin-top: 20px;
}

.findpassword {
  width: 100%;
  height: 100%;
}

#background{
  background: url("../assets/img/login_background1.jpg") no-repeat;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-width: 1000px;
  z-index: -10;
  zoom: 1;
  background-color: #fff;
  background-repeat: no-repeat;
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-position: center 0;
}

</style>
