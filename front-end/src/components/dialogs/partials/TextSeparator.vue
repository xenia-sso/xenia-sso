<template>
  <div class="row items-center">
    <div class="col row items-center">
      <div class="full-width bg-grey-8 separator"></div>
    </div>
    <div class="col-auto q-px-md">
      <slot></slot>
    </div>
    <div class="col row items-center">
      <div class="full-width bg-grey-8 separator"></div>
    </div>
  </div>
</template>

<style scoped>
.separator {
  height: 1px;
}
</style>
