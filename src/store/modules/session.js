export const session = {
  namespaced: true,
  state: {
    globalTip: {
      show: false,
      text: null
    },
    dialog: {
      show: false,
      obj_id: null,
      text: null
    },
    imagePreview: {
      show: false,
      index: 0,
      item: null,
      images: null,
    },
    cropper: {
      show: false,
      index: null,
      name: null,
      flag: null,
      origin_b64: null,
      imgB64: null,
    },
    fans: {
      index: 0,
      loading: true,
      value: [],
      show: false
    },
    cur_userInfo: null,
    cur_blog_id: null,
    blogs: [],
    blogImages: []
  },
  mutations: {
    set_bio(state, payload){
      state.cur_userInfo.bio = payload
    },
    set_cur_user_info(state, payload){
      state.cur_userInfo = payload
    },
    update_cur_userInfo(state, payload){
      if (payload){
        state.cur_userInfo.be_fans ++
      }else{
        state.cur_userInfo.be_fans --
      }
    },
    concat_fans(state, payload) {
      state.fans.value = state.fans.value.concat(payload)
      state.fans.loading = false
    },
    remove_fans(state, payload){
      state.fans.value = state.fans.value.filter(item => item.id !== payload)
    },
    clear_fans(state, payload){
      state.fans.value = []
    },
    show_fans(state, payload) {
      state.fans.loading = true
      state.fans.index = payload.index
      state.fans.show = payload.show
      if (payload.show) {
        document.getElementById('app').style.overflow = 'hidden'
      } else {
        state.fans.value = []
        document.getElementById('app').style.overflow = 'auto'
      }
    },
    concat_blogs(state, payload) {
      state.blogs = state.blogs.concat(payload)
    },
    unshift_blog(state, payload) {
      state.blogs.unshift(payload)
    },
    remove_blog(state, payload) {
      state.blogs = state.blogs.filter(item => item.id !== state.dialog.obj_id)
      state.dialog.show = false
    },
    clear_blogs(state, payload) {
      state.blogs = []
    },
    push_blog_images(state, payload) {
      state.blogImages.push(payload)
    },
    concat_blog_images(state, payload) {
      state.blogImages[state.blogImages.length - 1] = payload
    },
    remove_blog_image(state, payload) {
      state.blogImages.splice(payload, 1)
    },
    replace_blog_image(state, payload) {
      state.blogImages[state.cropper.index].imgB64 = payload
      state.blogImages[state.cropper.index].copper = true
    },
    clear_blog_images(state, payload) {
      state.blogImages = []
    },

    set_blog_id(state, payload) {
      if (state.cur_blog_id === payload) {
        state.cur_blog_id = null
      } else {
        state.cur_blog_id = payload
      }

    },
    to_cur(state, payload) {
      state.imagePreview.index = payload
      state.imagePreview.item = state.imagePreview.images[payload]
    },
    show_image_preview(state, payload) {
      state.imagePreview.index = payload.index
      state.imagePreview.images = payload.images
      state.imagePreview.item = payload.images[payload.index]
      state.imagePreview.show = true

    },
    show_global_tip(state, payload) {
      state.cur_blog_id = null
      const text = payload.text ? payload.text : payload
      state.globalTip.text = text
      state.globalTip.show = true
      const time = payload.time ? payload.time : 1500
      setTimeout(() => {
        state.globalTip.show = false
      }, time)
    },
    show_dialog(state, payload) {
      state.cur_blog_id = null
      state.dialog.text = payload.text
      state.dialog.obj_id = payload.obj_id
      state.dialog.show = true
    },
    show_cropper(state, payload) {
      state.cropper = payload
      state.cropper.show = true
    },
    close_mask(state, payload) {
      state.dialog.show = false
      state.imagePreview.show = false
    },
    close_cropper(state, payload) {
      state.cropper.show = false
    }

  }
}
