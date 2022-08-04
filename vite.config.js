import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default env => {

  return defineConfig({

    plugins: [
      vue(),
    ],
    define: {
      'process.env': {}
    },
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      open: true,
      host: '127.0.0.1',
      port: 8081,
      // proxy: {
      //   '^/api': {
      //     // target: 'http://127.0.0.1:8096', //本地
      //     target: 'http://8.141.150.118:8096/', //线上
      //     changeOrigin: true,
      //   },
      // },
    },
    esbuild: false,
    build: {

      terserOptions: {

        compress: {
          keep_infinity: true,
          // 删除console
          drop_console: true,
        },
      },
      // 禁用该功能可能会提高大型项目的构建性能
      brotliSize: false,
      rollupOptions: {
        output: {

          // 拆分单独模块
          manualChunks: {
            'element-plus': ['element-plus'],
          },
        },
      },
    },
  })
}
