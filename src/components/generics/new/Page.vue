<template>
    <div class="page">
        <div class="header_section">
            <div class="title">{{ title }}</div>
            <div class="options">
                <slot name="options"></slot>
            </div>
        </div>
        <div class="page-content">
            <slot name="content"></slot>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Page',
    props: {
        title: {
            type: String,
            required: true
        }
    }
}
</script>
<style scoped lang="scss">
@import '@/styles/constants.scss';

.page {
  height: calc(100vh - 104px);
  width: 100%;
  background-color: #f7f7f7;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .header_section {
    height: 52px;
    background-color: $white;
    padding-left: 15px;
    border-bottom: 1px solid $light-grey;
    display: grid;
    grid-template-columns: 60% 40%;
    justify-content: center;
    align-items: center;
    color: $black;

    .options {
      display: inline-flex;
      gap: 5px;
      padding-top: 5px;
      direction: rtl;
      padding-right: 15px;
      text-align: left;

      > div {
        direction: ltr;
      }
    }
  }

  .page-content {
    height: calc(100vh - 171px);
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>