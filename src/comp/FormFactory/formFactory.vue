<script>
export default{
  name: 'FormFactory',
  props: {
    init: {
      type: Function,
      default: function () {}
    }
  },
  render: function ($$) {
    return this.init($$, this.$slots.default)
  }
}
</script>
