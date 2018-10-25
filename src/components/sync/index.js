import css from "./sync.css";
import {isArray} from "lodash-es";
const isArrayfn = (agrs)=>{
    console.log(isArray(agrs));
}
document.getElementById("app").innerHTML=`<h1 class = "${css.test}">你妹的呀</h1>`;
const sync = () =>{
    console.log("sync");
    fetch("/api/test")
    .then(response=>response.json())
    .then(data=>{
        console.log("fethc结果:"+data.message);
        console.log("更新？");
    })
    .catch(err=>{
        console.log("嘟嘟嘟。。。请稍候");
        navigator.sendBeacon("远程错误地址"+err);
    });
}
export {
    sync,
    isArrayfn
}