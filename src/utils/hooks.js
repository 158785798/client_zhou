import {computed} from 'vue'
import {useStore, mapState, mapMutations, createNamespacedHelpers, mapActions} from 'vuex'


const checkType = (data) => {
  return Object.prototype.toString.call(data)
}

const useState = (module, data) => {
  const store = useStore();
  const state = {};
  let mapperFn = mapState;
  if (checkType(module) === "[object String]" && module.length > 0) {
    mapperFn = createNamespacedHelpers(module).mapState
  }
  const fns = mapperFn(data);
  Object.keys(fns).forEach(key => {
    const fn = fns[key].bind({$store: store});
    state[key] = computed(fn)
  })
  return state
}

const useMutations = (module, data) => {
  const store = useStore();
  const mutations = {};
  let serializer = mapMutations;
  if (checkType(module) === "[object String]" && module.length > 0) {
    serializer = createNamespacedHelpers(module).mapMutations
  }
  const fns = serializer(data);
  Object.keys(fns).forEach(key => {
    mutations[key] = fns[key].bind({$store: store})
  })
  return mutations
}

const useActions = (module, data) => {
  const store = useStore();
  const actions = {};
  let serializer = mapActions;
  if (checkType(module) === "[object String]" && module.length > 0) {
    serializer = createNamespacedHelpers(module).mapActions
  }
  const fns = serializer(data);

  Object.keys(fns).forEach(fnKey => {
    actions[fnKey] = fns[fnKey].bind({$store: store})
  })
  return actions
}

export {
  useState,
  useMutations,
  useActions,
}

