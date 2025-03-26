<template>
    <component
      :is="isLink ? 'router-link' : 'button'"
      :to="isLink ? to : undefined"
      :class="[
        'inline-flex items-center justify-center rounded-md transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
        sizeClasses,
        typeClasses,
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        fullWidth ? 'w-full' : ''
      ]"
      :disabled="disabled"
      @click="isLink ? null : $emit('click')"
    >
      <span v-if="icon && iconPosition === 'left'" class="icon-left">
        <i :class="['fas', `fa-${icon}`, iconSizeClass]"></i>
      </span>
      <span>{{ label }}</span>
      <span v-if="icon && iconPosition === 'right'" class="icon-right">
        <i :class="['fas', `fa-${icon}`, iconSizeClass]"></i>
      </span>
    </component>
  </template>
  
  <script>
  export default {
    name: 'Button',
    props: {
      label: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'primary',
        validator: value => ['primary', 'secondary', 'outline', 'text', 'white', 'outline-white'].includes(value)
      },
      size: {
        type: String,
        default: 'medium',
        validator: value => ['small', 'medium', 'large'].includes(value)
      },
      to: {
        type: [String, Object],
        default: null
      },
      icon: {
        type: String,
        default: ''
      },
      iconPosition: {
        type: String,
        default: 'right',
        validator: value => ['left', 'right'].includes(value)
      },
      disabled: {
        type: Boolean,
        default: false
      },
      fullWidth: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      isLink() {
        return !!this.to;
      },
      sizeClasses() {
        const sizes = {
          small: 'text-sm py-1.5 px-3',
          medium: 'text-base py-2 px-4',
          large: 'text-lg py-2.5 px-5'
        };
        return sizes[this.size] || sizes.medium;
      },
      typeClasses() {
        const types = {
          primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
          secondary: 'bg-purple-600 hover:bg-purple-700 text-white',
          outline: 'bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-50',
          text: 'bg-transparent text-indigo-600 hover:underline',
          white: 'bg-white text-indigo-600 hover:bg-gray-100',
          'outline-white': 'bg-transparent border border-white text-white hover:bg-white hover:bg-opacity-20'
        };
        return types[this.type] || types.primary;
      },
      iconSizeClass() {
        const sizes = {
          small: 'text-xs',
          medium: 'text-sm',
          large: 'text-base'
        };
        return sizes[this.size] || sizes.medium;
      }
    }
  };
  </script>
  
  <style scoped>
  .icon-left {
    margin-right: 0.5rem;
  }
  
  .icon-right {
    margin-left: 0.5rem;
  }
  </style>