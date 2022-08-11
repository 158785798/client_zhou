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
    cur_blog_id: null,
    blogs: [],
  },
  mutations: {
    concat_blogs(state, payload) {
      state.blogs = state.blogs.concat(payload)
    },
    clear_blogs(state, payload) {
      state.blogs = []
    },
    remove_blog(state, payload) {
      state.blogs = state.blogs.filter(item => item.id !== state.dialog.obj_id)
      state.dialog.show = false
    },
    set_blog_id(state, payload){
      state.cur_blog_id = payload
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
      state.globalTip.text = payload
      state.globalTip.show = true
      setTimeout(() => {
        state.globalTip.show = false
      }, 1500)
    },
    show_dialog(state, payload) {
      state.dialog.text = payload.text
      state.dialog.obj_id = payload.obj_id
      state.dialog.show = true
    },
    close_mask(state, payload) {
      state.dialog.show = false
      state.imagePreview.show = false
    }
  }
}
