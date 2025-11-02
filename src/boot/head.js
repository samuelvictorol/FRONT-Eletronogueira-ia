// src/boot/head.js
import { createHead } from '@unhead/vue'

export default ({ app }) => {
  const head = createHead()
  app.use(head)
}
