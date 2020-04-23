import Vue from 'vue'
import { JSEncrypt } from 'jsencrypt'

//获取公钥
Vue.prototype.$getKey = async function () {
    try {
        let key = await this.$http.get("/api/user/key");
        return key.data
    } catch (error) {
        console.error(error);
    }
}

//加密方法 公钥
Vue.prototype.$getSecret = function (password, key) {
    let encrypt = new JSEncrypt()
    encrypt.setPublicKey(key);
    let data = encrypt.encrypt(password);
    return data
}

//解密方法 私钥
Vue.prototype.$setSecret = function (password, key) {
    let encrypt = new JSEncrypt()
    encrypt.setPublicKey(key)
    let data = encrypt.decrypt(password)
    return data
}

