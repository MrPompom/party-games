<template>
    <div 
      class="card bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
      :class="[
        elevated ? 'shadow-lg' : 'shadow-md',
        clickable ? 'cursor-pointer' : '',
        customClass
      ]"
      @click="clickable ? $emit('click') : null"
    >
      <div v-if="$slots.image" class="card-image">
        <slot name="image"></slot>
      </div>
      
      <div v-if="$slots.icon" class="card-icon">
        <slot name="icon"></slot>
      </div>
      
      <div v-if="$slots.title" class="card-title">
        <slot name="title"></slot>
      </div>
      
      <div v-if="$slots.content" class="card-content">
        <slot name="content"></slot>
      </div>
      
      <div v-if="$slots.footer" class="card-footer">
        <slot name="footer"></slot>
      </div>
      
      <!-- Si aucun slot n'est fourni, utiliser le slot par défaut -->
      <slot></slot>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Card',
    props: {
      elevated: {
        type: Boolean,
        default: false
      },
      clickable: {
        type: Boolean,
        default: false
      },
      customClass: {
        type: String,
        default: ''
      }
    },
    emits: ['click']
  };
  </script>
  
  <style scoped>
  .card-content {
    padding: 1rem;
  }
  
  .card-title + .card-content {
    padding-top: 0;
  }
  </style>