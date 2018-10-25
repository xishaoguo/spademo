import {sync} from "./components/sync/index";
import(/* webpackChunkName:"async-banner" */"./components/banner/index").then(_=>{
    _.default.init();
});
sync();