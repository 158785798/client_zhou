import router from "../router/index.js";

const to_tab =  async (to, query) => {
  await router.push({name: to, query: query})
}


export  {
  to_tab,

}