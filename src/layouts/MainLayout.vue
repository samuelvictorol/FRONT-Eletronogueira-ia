<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="bg-secondary text-white" height-hint="98">
      <q-toolbar class="text-white">
        <q-toolbar-title>
          <q-avatar>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWkoE4wphrr3rmiQjB_WamkBHm2CQ4POAbnQ&s">
          </q-avatar>
          EletroNogueira I.A
        </q-toolbar-title>

        <q-btn dense flat  icon="menu" color="white" size="lg" @click="toggleRightDrawer" />
      </q-toolbar>

      <q-tabs align="center" class="text-secondary bg-primary">
        <q-route-tab to="/ia" label="Conversas" />
        <q-route-tab to="/ia/qr" label="QrCode" />
      </q-tabs>
    </q-header>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const rightDrawerOpen = ref(false)

    return {
      rightDrawerOpen,
      toggleRightDrawer () {
        rightDrawerOpen.value = !rightDrawerOpen.value
      }
    }
  }
}
</script>