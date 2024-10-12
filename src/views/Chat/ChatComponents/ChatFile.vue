<template>
    <div class="file-container">
        <!-- 상단 헤더 -->
        <div class="file-header">
            <h3 class="file-header-name">파일함</h3>
            <button @click="closeFileBox" class="header-button close-button">
                <i class="fa fa-arrow-right" aria-hidden="true"></i>
            </button>
        </div>

        <!-- 파일 목록 -->
        <ul class="file-list">
            <li v-for="(file, index) in fileList" :key="index" class="file-item">
                <span class="file-name">{{ file.name }}</span>
                <button @click="downloadFile(file.url)" class="download-button">
                    <i class="fa fa-arrow-circle-o-down" aria-hidden="true"></i>
                </button>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "ChatFile",
    props: {
        fileList: {
            type: Array,
            required: true,
        },
    },
    methods: {
        // 파일함 닫기 이벤트
        closeFileBox() {
            this.$emit("close-file-box");
        },
        // 파일 다운로드 함수
        downloadFile(fileUrl) {
            window.open(fileUrl, "_blank");
        },
    },
};
</script>

<style scoped>
.file-container {
    display: flex;
    flex-direction: column;
    width: 350px;
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    background-color: #fff;
}

.file-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 19px;
    border-bottom: 1px solid #ddd;
    background-color: #f5f5f5;
}

.file-header-name {
    margin: 0;
    font-size: 16px;
}

.header-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0px;
    font-size: 14px;
    color: #666;
}

.close-button:hover {
    color: #5b5b5b;
}

.file-list {
    padding: 0;
    list-style-type: none;
    margin: 0;
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 13px 15px 20px;
    border-bottom: 1px solid #ddd;
}

.file-name {
    flex-grow: 1;
    font-size: 13px;
}

.download-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #666;
}

.download-button:hover {
    color: #5b5b5b;
}
</style>