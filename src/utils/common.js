import {useRouter} from "vue-router";

const router = useRouter();

export default {
  toTab: (route)=> {
    console.log(router);
    router.push({name: route})
  }
}


