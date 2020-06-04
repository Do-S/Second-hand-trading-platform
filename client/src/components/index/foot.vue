<template>
  <div id="foot">
    <p>
      <span style="padding-right:5px">Copyright © 2020 DuLeihao</span>
      <a href="http://beian.miit.gov.cn/" target="_blank">豫ICP备20016050号</a>
    </p>
  </div>
</template>

<script>
export default {
  name: "foot",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
#foot {
  width: 100%;
  background-color: #fcfcfc;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    font-size: 14px;
    padding: 20px;
    a {
      color: black;
      &:hover {
        color: blueviolet;
      }
    }
  }
}
</style>