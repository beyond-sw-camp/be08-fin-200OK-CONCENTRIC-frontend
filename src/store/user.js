import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';
import axios from 'axios';

export const useUserStore = defineStore('user', () => {
    const state = reactive({
        userInfo: null,
        isLoggedIn: false,
        accessToken: null,
        team_id: null,
        teams: [],
    });



    const setUser = (user) => {
        state.userInfo = user;
        state.isLoggedIn = true;
    }

    const clearUser = () => {
        state.userInfo = null;
        state.isLoggedIn = false;
        state.accessToken = null;
    }

    const setToken = (accessToken) => {
        if(accessToken !== undefined){
            state.accessToken = accessToken;
            axios.defaults.headers.common['authorization'] = accessToken;
        }
    }

    const updateUser = (user) => {
        state.userInfo = user;
    }

    // team_id 설정 (Setter)
    const setTeamId = (team_id) => {
        state.team_id = team_id;

        // 기존의 user 객체를 가져와 업데이트
        const userData = JSON.parse(localStorage.getItem('user')) || {};
        userData.state.team_id = team_id;  // team_id 설정

        // 업데이트된 객체를 다시 로컬스토리지에 저장
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const updateTeam = (updatedTeam) => {
        const index = state.teams.findIndex(team => team.id === updatedTeam.id);
        if (index !== -1) {
            state.teams.splice(index, 1, updatedTeam); 
        } else {
            state.teams.push(updatedTeam); 
        }
    };
    const leaveTeam = (teamId) => {
        state.teams = state.teams.filter(team => team.id !== teamId); 
    };

    // team_id 조회 (Getter)
    const teamId = computed(() => state.team_id);

    const userInfo = computed(() => state.userInfo);
    const isLoggedIn = computed(() => state.isLoggedIn);
    const accessToken = computed(() => state.accessToken);

    return { 
        state,
        setUser,
        clearUser, 
        setToken,
        updateUser,
        setTeamId,
        teamId,
        userInfo,
        isLoggedIn,
        accessToken,
        updateTeam,
        leaveTeam,
    };
},
{
    persist: true
});