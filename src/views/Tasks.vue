<template>
  <div class="card mb-4">
    <div class="card-header pb-0">
      <h5>Tasks</h5>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-2">
        <table class="table align-items-center justify-content-center mb-3">
          <thead>
          <tr>
            <th v-for="(column, index) in columns" :key="index" colspan="1">
                <span v-if="!column.isEditing" @click="editColumn(index)" class="btn mb-0 shadow-none">
                  {{ column.label || 'New Column' }}
                </span>
              <DropdownComponent
                  v-else
                  :options="columnOptions"
                  @columnSelected="updateColumnLabel(index, $event)"
              />
            </th>
            <th>
              <button class="btn btn-primary btn-sm mx-2 py-1 mb-0" @click="addColumn">+&nbsp;New</button>
            </th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.id">
              <td v-for="(column, index) in columns" :key="index">
                <div v-if="column.key === 'completion'" class="align-items-center">
                  <span class="me-2">{{ task[column.key] }}</span>
                  <div class="progress flex-grow-1 ml-auto" style="width: 40%">
                    <div
                        class="progress-bar bg-gradient-success"
                        role="progressbar"
                        :aria-valuenow="task[column.key].replace('%', '')"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        :style="{ width: task[column.key] }"
                    ></div>
                  </div>
                </div>
                <div v-else>
                  {{ task[column.key] || '' }}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <button class="btn shadow-none">+&nbsp;New Task</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import DropdownComponent from './components/ContentsDropdown.vue';
import axios from 'axios';
import ArgonButton from "@/components/ArgonButton.vue";

export default {
  components: {
    // ArgonButton,
    DropdownComponent
  },
  data() {
    return {
      mainImage: require('@/assets/img/애옹.png'),
      columns: [
        { key: 'projectName', label: '프로젝트명', isEditing: false },
        { key: 'budget', label: '예산', isEditing: false },
        { key: 'status', label: '상태', isEditing: false },
        { key: 'completion', label: '완료율', isEditing: false },
      ],
      tasks: [
        { id: 1, projectName: 'Spotify', budget: '$2,500', status: '진행 중', completion: '60%' },
        { id: 2, projectName: 'Invision', budget: '$5,000', status: '완료', completion: '100%' },
        { id: 3, projectName: 'Jira', budget: '$3,400', status: '취소됨', completion: '30%' },
        { id: 4, projectName: 'Slack', budget: '$1,000', status: '취소됨', completion: '0%' },
        { id: 5, projectName: 'Webdev', budget: '$14,000', status: '진행 중', completion: '80%' },
        { id: 6, projectName: 'Adobe XD', budget: '$2,300', status: '완료', completion: '100%' },
      ],
      columnOptions: ['projectName', 'budget', 'status', 'completion']
    };
  },
  created() {
    this.fetchData(); // 컴포넌트 생성 시 데이터를 가져오는 함수 호출
  },
  methods: {

    async fetchData() {
      try {
        const response = await axios.get('/api/getTasks'); // API 요청으로 데이터 가져오기
        this.tasks = response.data.tasks;
        this.columns = response.data.columns; // 열 데이터도 가져옴
      } catch (error) {
        console.error('데이터를 불러오지 못했습니다.', error);
      }
    },
    addColumn() {
      this.columns.push({ key: '', label: '', isEditing: true });
    },
    editColumn(index) {
      this.columns[index].isEditing = true;
    },
    updateColumnLabel(index, selectedValue) {
      this.columns[index].key = selectedValue;
      this.columns[index].label = this.getLabelForKey(selectedValue);
      this.columns[index].isEditing = false;
    },
    getLabelForKey(key) {
      const labelMap = {
        projectName: '프로젝트명',
        budget: '예산',
        status: '상태',
        completion: '완료율',
        deadline: '마감 기한',
        department: '소속',
        type: '유형',
        content: '내용',
      };
      return labelMap[key] || '새 열';
    }
  }
};
</script>
